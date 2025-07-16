'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useSpring, animated as a } from '@react-spring/web'
import { cn } from '@/utils'
import Image from 'next/image'

interface MasonryData {
  id: string
  image: string
  height: number
}

interface MasonryProps {
  data: MasonryData[]
  onImageClick?: (id: string) => void
}

// Optimized image component using Next.js Image
const OptimizedImage = ({ 
  src, 
  style, 
  className, 
  onClick,
  alt = "Travel photo"
}: { 
  src: string; 
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
  alt?: string;
}) => {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div 
        className={cn("flex items-center justify-center bg-neutral-200 dark:bg-neutral-700", className)}
        style={style}
        onClick={onClick}
      >
        <span className="text-neutral-500 text-sm">Failed to load</span>
      </div>
    )
  }

  return (
    <div 
      className={cn("relative overflow-hidden", className)}
      style={style}
      onClick={onClick}
    >
      {/* Loading placeholder */}
      {!loaded && (
        <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-700 animate-pulse rounded-lg" />
      )}
      
      {/* Optimized Next.js Image */}
      <Image
        src={src}
        alt={alt}
        fill
        className={cn(
          "object-cover transition-all duration-300 ease-in-out hover:scale-[1.02] cursor-pointer",
          loaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        sizes="(max-width: 640px) 50vw, (max-width: 1200px) 33vw, (max-width: 1536px) 25vw, 20vw"
        loading="lazy"
        quality={75}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R/W3Hf"
      />
    </div>
  )
}

// Custom hook for responsive breakpoints
function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState(2)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width >= 1536) setBreakpoint(5)      // 2xl: 5 columns
      else if (width >= 1280) setBreakpoint(4) // xl: 4 columns
      else if (width >= 1024) setBreakpoint(3) // lg: 3 columns
      else if (width >= 640) setBreakpoint(2)  // sm: 2 columns
      else setBreakpoint(1)                    // xs: 1 column
    }

    handleResize() // Set initial value
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return breakpoint
}

function Masonry({ data, onImageClick }: MasonryProps) {
  const [columns, setColumns] = useState<number>(2);
  const ref = useRef<HTMLDivElement>(null);
  const breakpoint = useBreakpoint()

  // Update columns when breakpoint changes
  useEffect(() => {
    setColumns(breakpoint)
  }, [breakpoint])

  // Calculate layout using useMemo for performance
  const { columnHeights, items } = useMemo(() => {
    const heights = new Array(columns).fill(0);
    const layoutItems = data.map((item) => {
      const shortestColumnIndex = heights.indexOf(Math.min(...heights));
      const x = (shortestColumnIndex * 100) / columns;
      const y = heights[shortestColumnIndex];
      
      heights[shortestColumnIndex] += item.height + 16; // 16px gap
      
      return {
        ...item,
        x: `${x}%`,
        y,
        width: `${100 / columns - (columns - 1) * 1}%`, // Account for gaps
      };
    });

    return { columnHeights: heights, items: layoutItems };
  }, [data, columns]);

  // Spring animations for smooth transitions
  const transitions = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { tension: 200, friction: 15 }
  })

  return (
    <div
      ref={ref}
      className={cn("relative w-full")}
      style={{ height: Math.max(...columnHeights) || 0 }}
    >
      {items.map((item) => (
        <a.div
          key={item.id}
          style={{
            ...transitions,
            position: 'absolute',
            left: item.x,
            top: item.y,
            width: item.width,
            height: item.height,
            willChange: 'transform, width, height, opacity'
          }}
        >
          <OptimizedImage
            src={item.image}
            className="relative w-full h-full overflow-hidden rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out"
            onClick={() => onImageClick?.(item.id)}
            alt="Travel photo"
          />
        </a.div>
      ))}
    </div>
  );
}

export { Masonry as Component }
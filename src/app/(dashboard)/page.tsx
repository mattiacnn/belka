'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { EmptyState } from '@/components/ui/empty-state'
import { Component as Masonry } from '@/components/ui/masonry'
import { ImageModal } from '@/components/ui/image-modal'
import { Camera, Image, Plus, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { TravelImageWithUrls } from '@/types'

// Skeleton loading component
const GallerySkeleton = () => (
  <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 gap-4">
    {Array.from({ length: 12 }).map((_, i) => (
      <div
        key={i}
        className="break-inside-avoid mb-4 bg-neutral-200 dark:bg-neutral-700 rounded-lg animate-pulse"
        style={{ height: Math.floor(Math.random() * 200) + 200 }}
      />
    ))}
  </div>
)

export default function HomePage() {
  const router = useRouter()
  
  const [images, setImages] = useState<TravelImageWithUrls[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedImageId, setSelectedImageId] = useState<string>('')

  // Load user images from API
  useEffect(() => {
    const loadImages = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const supabase = createClient()

        // Check if user is authenticated
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !user) {
          throw new Error("Authentication required")
        }

        // Fetch images from API
        const response = await fetch('/api/images', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch images: ${response.statusText}`)
        }

        const imageData: TravelImageWithUrls[] = await response.json()
        
        // Update state with fetched images
        setImages(imageData)
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load images'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    loadImages()
  }, []) // Empty dependency array - run only once on mount

  const handleUploadClick = () => {
    router.push('/upload')
  }

  const handleImageClick = (imageId: string) => {
    setSelectedImageId(imageId)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedImageId('')
  }

  // Convert images to masonry format with optimized URLs
  const masonryData = images.map(img => {
    // Try to get dimensions from metadata, fallback to aspect ratio calculation or default
    let height = 300 // Default height
    
    if (img.metadata?.height && img.metadata?.width) {
      // Use real dimensions, but scale to reasonable size for masonry
      const aspectRatio = img.metadata.width / img.metadata.height
      height = 400 / aspectRatio // Base width of 400px
    } else if (img.metadata?.aspectRatio) {
      // Use aspect ratio if available
      height = 400 / img.metadata.aspectRatio
    } else {
      // Use a variety of heights for visual interest
      const heights = [250, 300, 350, 400, 450]
      height = heights[parseInt(img.id.slice(-1), 16) % heights.length]
    }

    // Use thumbnail URLs for better performance in gallery view
    const imageUrl = img.thumbnail_urls?.medium || img.thumbnail_urls?.small || img.image_url

    return {
      id: img.id,
      image: imageUrl || '',
      height: Math.max(200, Math.min(600, height)), // Clamp between 200-600px
    }
  })

  // Convert images for modal (with high-res URLs and thumbnail fallbacks)
  const modalImages = images.map(img => ({
    id: img.id,
    title: img.title,
    image_url: img.image_url || '', // Use full resolution for modal
    tags: img.tags,
    description: img.description || undefined, // Convert null to undefined for compatibility
    created_at: img.created_at,
    metadata: img.metadata
  }))

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">
            La tua Galleria di Viaggio
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Esplora e organizza i tuoi ricordi fotografici
          </p>
          {images.length > 0 && !isLoading && (
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              {images.length} foto{images.length > 1 ? '' : ''} nella tua galleria
            </p>
          )}
        </div>
      </div>

      {/* Gallery Content */}
      <div className="mobile-scroll-container">
        {isLoading ? (
          <div className="flex-1">
            <GallerySkeleton />
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState
              title="Errore nel caricamento"
              description={`Si è verificato un errore: ${error}`}
              icons={[AlertCircle]}
            />
          </div>
        ) : images.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState
              title="Nessuna foto caricata"
              description="Inizia caricando le tue prime foto di viaggio per creare la tua galleria personale"
              icons={[Camera, Image, Plus]}
              action={{
                label: "Carica la tua prima foto",
                onClick: handleUploadClick
              }}
            />
          </div>
        ) : (
          <div className="flex-1">
            <Masonry 
              data={masonryData} 
              onImageClick={handleImageClick}
            />
          </div>
        )}
      </div>

      {/* Image Modal */}
      <ImageModal
        images={modalImages}
        currentImageId={selectedImageId}
        isOpen={modalOpen}
        onClose={handleCloseModal}
      />
    </>
  )
} 
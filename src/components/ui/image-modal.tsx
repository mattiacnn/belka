'use client'

import { useEffect, useState, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight, Calendar, Tag, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn, formatDate } from '@/utils'
import { getResponsiveSizes, getOptimalQuality, generateBlurDataURL } from '@/utils'
import Image from 'next/image'

interface ImageModalProps {
  images: Array<{
    id: string
    title: string
    image_url: string
    tags: string[]
    description?: string
    created_at: string
    metadata?: {
      width?: number
      height?: number
      size?: number
      type?: string
      originalName?: string
    } | null
  }>
  currentImageId: string
  isOpen: boolean
  onClose: () => void
}

export function ImageModal({ images, currentImageId, isOpen, onClose }: ImageModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Find current image index
  useEffect(() => {
    const index = images.findIndex(img => img.id === currentImageId)
    if (index !== -1) {
      setCurrentIndex(index)
    }
  }, [currentImageId, images])

  // Reset image loaded state when changing images
  useEffect(() => {
    setImageLoaded(false)
  }, [currentIndex])

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => prev > 0 ? prev - 1 : images.length - 1)
  }, [images.length])

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => prev < images.length - 1 ? prev + 1 : 0)
  }, [images.length])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          e.preventDefault()
          goToPrevious()
          break
        case 'ArrowRight':
          e.preventDefault()
          goToNext()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, goToPrevious, goToNext, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i]
  }


  if (!isOpen || images.length === 0) return null

  const currentImage = images[currentIndex]

  // Calculate responsive dimensions for the image
  const getImageDimensions = () => {
    if (!currentImage.metadata?.width || !currentImage.metadata?.height) {
      return { width: 800, height: 600 }
    }

    // Get available viewport space (accounting for header, padding, and sidebar)
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200
    
    // Account for header (80px), padding (32px top/bottom), and sidebar on desktop (320px)
    const availableHeight = viewportHeight - 112 // 80px header + 32px padding
    const availableWidth = viewportWidth > 1024 ? viewportWidth - 320 - 32 : viewportWidth - 32 // sidebar + padding

    const originalWidth = currentImage.metadata.width
    const originalHeight = currentImage.metadata.height
    const aspectRatio = originalWidth / originalHeight

    // Calculate dimensions that fit within available space
    let displayWidth = originalWidth
    let displayHeight = originalHeight

    // Scale down if image is larger than available space
    if (displayWidth > availableWidth) {
      displayWidth = availableWidth
      displayHeight = displayWidth / aspectRatio
    }

    if (displayHeight > availableHeight) {
      displayHeight = availableHeight
      displayWidth = displayHeight * aspectRatio
    }

    return {
      width: Math.round(displayWidth),
      height: Math.round(displayHeight)
    }
  }

  const imageDimensions = getImageDimensions()

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center gap-4 text-white min-w-0 flex-1 pr-4">
          <h2 className="text-lg font-semibold truncate max-w-none">
            {currentImage.title}
          </h2>
          <span className="text-sm text-white/70 whitespace-nowrap flex-shrink-0">
            {currentIndex + 1} di {images.length}
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:bg-white/20 h-8 w-8 flex-shrink-0"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation */}
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 h-12 w-12"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 h-12 w-12 lg:right-[336px]"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Main content */}
      <div className="flex h-full">
        {/* Image container */}
        <div className="flex-1 flex items-center justify-center p-4 pt-20 pb-16 lg:pb-4 lg:pr-0">
          <div className="relative flex items-center justify-center w-full h-full">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
            
            <div 
              className="relative"
              style={{
                width: imageDimensions.width,
                height: imageDimensions.height,
                maxWidth: '100%',
                maxHeight: '100%'
              }}
            >
              <Image
                src={currentImage.image_url}
                alt={currentImage.title}
                fill
                className={cn(
                  "object-contain transition-opacity duration-300",
                  imageLoaded ? "opacity-100" : "opacity-0"
                )}
                onLoad={() => setImageLoaded(true)}
                priority
                quality={getOptimalQuality('full')}
                sizes={getResponsiveSizes('modal')}
                placeholder="blur"
                blurDataURL={generateBlurDataURL()}
              />
            </div>
          </div>
        </div>

        {/* Sidebar with metadata */}
        <div className="hidden lg:block w-80 bg-black/50 backdrop-blur-sm border-l border-white/10 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Image info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">
                {currentImage.title}
              </h3>
              
              {currentImage.description && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-white/70">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">Descrizione</span>
                  </div>
                  <p className="text-white text-sm">
                    {currentImage.description}
                  </p>
                </div>
              )}

              {/* Date */}
              <div className="flex items-center gap-2 text-white/70">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  {formatDate(currentImage.created_at)}
                </span>
              </div>

              {/* Tags */}
              {currentImage.tags.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-white/70">
                    <Tag className="h-4 w-4" />
                    <span className="text-sm">Tag</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {currentImage.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-white/20 text-white rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical details */}
              {currentImage.metadata && (
                <div className="space-y-2 border-t border-white/10 pt-4">
                  <h4 className="text-sm font-medium text-white/70">Dettagli Tecnici</h4>
                  <div className="space-y-1 text-sm text-white/60">
                    {currentImage.metadata.width && currentImage.metadata.height && (
                      <div>Dimensioni: {currentImage.metadata.width} × {currentImage.metadata.height}px</div>
                    )}
                    {currentImage.metadata.size && (
                      <div>Dimensione: {formatFileSize(currentImage.metadata.size)}</div>
                    )}
                    {currentImage.metadata.type && (
                      <div>Formato: {currentImage.metadata.type.toUpperCase()}</div>
                    )}
                    {currentImage.metadata.originalName && (
                      <div>Nome originale: {currentImage.metadata.originalName}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom overlay for mobile metadata */}
      <div className="lg:hidden absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 space-y-2">
        {currentImage.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {currentImage.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-white/20 text-white rounded-full"
              >
                {tag}
              </span>
            ))}
            {currentImage.tags.length > 3 && (
              <span className="px-2 py-1 text-xs bg-white/20 text-white rounded-full">
                +{currentImage.tags.length - 3}
              </span>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between text-sm text-white/70">
          <span>{formatDate(currentImage.created_at)}</span>
          {currentImage.metadata?.width && currentImage.metadata?.height && (
            <span>{currentImage.metadata.width} × {currentImage.metadata.height}</span>
          )}
        </div>
      </div>

      {/* Click overlay to close */}
      <div 
        className="absolute inset-0 -z-10"
        onClick={onClose}
      />
    </div>
  )
} 
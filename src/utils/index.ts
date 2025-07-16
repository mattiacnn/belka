import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility for merging Tailwind CSS classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility for file size formatting
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Utility for generating unique file names
export function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const extension = originalName.split('.').pop()
  return `${timestamp}-${randomString}.${extension}`
}

// Utility for extracting image metadata (browser-side)
export function getImageMetadata(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    // Validate file type first
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'))
      return
    }

    const img = new Image()
    let objectUrl: string | null = null
    
    img.onload = function() {
      const dimensions = {
        width: img.naturalWidth,
        height: img.naturalHeight,
      }
      
      // Clean up the object URL to prevent memory leaks
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
      
      // Validate dimensions
      if (dimensions.width > 0 && dimensions.height > 0) {
        resolve(dimensions)
      } else {
        reject(new Error('Invalid image dimensions'))
      }
    }
    
    img.onerror = function(error) {
      console.error('Error loading image for metadata extraction:', error)
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
      reject(new Error('Failed to load image for dimension extraction'))
    }
    
    try {
      objectUrl = URL.createObjectURL(file)
      img.src = objectUrl
    } catch (error) {
      console.error('Error creating object URL:', error)
      reject(new Error('Failed to create object URL'))
    }
  })
}

// Utility for date formatting
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

// Generate a low-quality placeholder for blur effect
export function generateBlurDataURL(): string {
  return "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R/W3Hf"
}

// Utility for creating responsive sizes attribute for Next.js Image
export function getResponsiveSizes(type: 'gallery' | 'preview' | 'modal' | 'thumbnail' = 'gallery'): string {
  switch (type) {
    case 'gallery':
      return "(max-width: 640px) 50vw, (max-width: 1200px) 33vw, (max-width: 1536px) 25vw, 20vw"
    case 'preview':
      return "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
    case 'modal':
      return "(max-width: 1024px) 100vw, calc(100vw - 320px)"
    case 'thumbnail':
      return "(max-width: 640px) 25vw, (max-width: 1200px) 20vw, 15vw"
    default:
      return "100vw"
  }
}

// Utility for calculating optimal image quality based on context
export function getOptimalQuality(context: 'thumbnail' | 'gallery' | 'preview' | 'full' = 'gallery'): number {
  switch (context) {
    case 'thumbnail':
      return 60
    case 'gallery':
      return 75
    case 'preview':
      return 85
    case 'full':
      return 90
    default:
      return 75
  }
}
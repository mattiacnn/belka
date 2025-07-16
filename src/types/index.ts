
// Enhanced metadata type with optimization support
export interface ImageMetadata {
  [key: string]: any
  width?: number
  height?: number
  size?: number
  type?: string
  originalName?: string
  aspectRatio?: number
  thumbnails?: Record<string, string> // thumbnail size -> storage path mapping
  uploadedAt?: string
  optimized?: boolean
}

// Base image type from database
export interface TravelImage {
  id: string
  title: string
  description?: string | null
  image_path: string
  tags: string[]
  created_at: string
  updated_at: string
  user_id: string
  metadata?: ImageMetadata | null
}

// Extended image type with frontend URLs
export interface TravelImageWithUrls extends TravelImage {
  image_url: string | null
  thumbnail_urls?: Record<string, string> // thumbnail size -> signed URL mapping
}

// Component prop types
export interface Tag {
  id: string
  name: string
  created_at: string
  user_id: string
}

// File upload related types
export interface FileUploadProgress {
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'completed' | 'error'
  error?: string
}

export interface ImageCardProps {
  image: TravelImage
  onDelete?: (id: string) => void
  onEdit?: (image: TravelImage) => void
} 
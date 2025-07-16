import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/toast'
import { z } from 'zod'
import { getImageMetadata } from '@/utils'

// Validation schemas
const FileSchema = z.object({
  name: z.string().min(1, "File name is required"),
  size: z.number()
    .max(10 * 1024 * 1024, "File size must be less than 10MB")
    .min(1, "File cannot be empty"),
  type: z.string()
    .refine(
      (type) => type.startsWith('image/'),
      "Only image files are allowed"
    )
    .refine(
      (type) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'].includes(type),
      "Only JPEG, PNG, WebP, and GIF images are supported"
    )
})

const TagSchema = z.object({
  id: z.string().min(1, "Tag ID is required"),
  label: z.string()
    .min(1, "Tag label is required")
    .regex(/^#[a-zA-Z0-9_]+$/, "Tag must start with # and contain only letters, numbers, and underscores")
})

// Individual file metadata schema
const FileMetadataSchema = z.object({
  title: z.string().min(1, "Title is required").max(30, "Title must be less than 30 characters"),
  description: z.string().max(100, "Description must be less than 100 characters").optional(),
  tags: z.array(TagSchema).max(10, "Maximum 10 tags allowed").optional()
})

const UploadFormSchema = z.object({
  files: z.array(FileSchema)
    .min(1, "At least one file is required")
    .max(20, "Maximum 20 files allowed"),
  filesMetadata: z.record(z.string(), FileMetadataSchema) // fileId -> metadata mapping
})

export type Tag = z.infer<typeof TagSchema>
export type FileMetadata = z.infer<typeof FileMetadataSchema>

export interface FileWithPreview extends File {
  id: string
  preview: string
}

export interface UseFileUploadReturn {
  files: FileWithPreview[]
  filesMetadata: Record<string, FileMetadata>
  isUploading: boolean
  uploadedCount: number
  currentFileName: string
  totalSizeMB: string
  addFiles: (files: File[]) => void
  removeFile: (fileId: string) => void
  updateFileMetadata: (fileId: string, metadata: Partial<FileMetadata>) => void
  uploadFiles: () => Promise<void>
  clearAll: () => void
}

export function useFileUpload(): UseFileUploadReturn {
  const router = useRouter()
  const toast = useToast()
  
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [filesMetadata, setFilesMetadata] = useState<Record<string, FileMetadata>>({})
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedCount, setUploadedCount] = useState(0)
  const [currentFileName, setCurrentFileName] = useState('')

  const createFilePreview = useCallback((file: File): FileWithPreview => {
    const id = Math.random().toString(36).substr(2, 9)
    const preview = URL.createObjectURL(file)
    
    return Object.assign(file, { id, preview })
  }, [])

  const addFiles = useCallback((uploadedFiles: File[]) => {
    try {
      const validFiles: FileWithPreview[] = []
      const errors: string[] = []

      uploadedFiles.forEach((file) => {
        try {
          // Validate file with Zod
          FileSchema.parse({
            name: file.name,
            size: file.size,
            type: file.type
          })
          
          // Check for duplicates
          const isDuplicate = files.some(existingFile => 
            existingFile.name === file.name && existingFile.size === file.size
          )
          
          if (isDuplicate) {
            errors.push(`File "${file.name}" è già stato selezionato`)
            return
          }

          validFiles.push(createFilePreview(file))
        } catch (err) {
          if (err instanceof z.ZodError) {
            const errorMessage = err.issues.map((issue) => issue.message).join(', ')
            errors.push(`File "${file.name}": ${errorMessage}`)
          } else {
            errors.push(`File "${file.name}": Errore di validazione`)
          }
        }
      })

      // Check total file count
      if (files.length + validFiles.length > 20) {
        toast.error("Non puoi caricare più di 20 file in totale")
        return
      }

      // Show errors if any
      if (errors.length > 0) {
        errors.forEach(error => toast.error(error))
      }

      // Add valid files and initialize their metadata
      if (validFiles.length > 0) {
        setFiles(prevFiles => [...prevFiles, ...validFiles])
        
        // Initialize metadata for each new file
        const newMetadata: Record<string, FileMetadata> = {}
        validFiles.forEach(file => {
          newMetadata[file.id] = {
            title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension for default title
            description: "",
            tags: []
          }
        })
        
        setFilesMetadata(prevMetadata => ({
          ...prevMetadata,
          ...newMetadata
        }))

        toast.success(`${validFiles.length} file${validFiles.length > 1 ? 's' : ''} aggiunto${validFiles.length > 1 ? 'i' : ''} con successo`)
      }

    } catch (error) {
      console.error('Error adding files:', error)
      toast.error("Errore durante l'aggiunta dei file")
    }
  }, [files, createFilePreview, toast])

  const removeFile = useCallback((fileId: string) => {
    setFiles(prevFiles => {
      const fileToRemove = prevFiles.find(f => f.id === fileId)
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview)
      }
      return prevFiles.filter(f => f.id !== fileId)
    })
    
    // Remove metadata for this file
    setFilesMetadata(prevMetadata => {
      const newMetadata = { ...prevMetadata }
      delete newMetadata[fileId]
      return newMetadata
    })
  }, [])

  const updateFileMetadata = useCallback((fileId: string, metadata: Partial<FileMetadata>) => {
    setFilesMetadata(prevMetadata => ({
      ...prevMetadata,
      [fileId]: {
        ...prevMetadata[fileId],
        ...metadata
      }
    }))
  }, [])

  const clearAll = useCallback(() => {
    // Clean up object URLs
    files.forEach(file => {
      URL.revokeObjectURL(file.preview)
    })
    
    setFiles([])
    setFilesMetadata({})
    setIsUploading(false)
    setUploadedCount(0)
    setCurrentFileName('')
  }, [files])

  const uploadFiles = useCallback(async () => {
    if (files.length === 0) {
      toast.error("Seleziona almeno un file da caricare")
      return
    }

    // Validate form data
    try {
      const formData = {
        files: files.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type
        })),
        filesMetadata
      }

      const validation = UploadFormSchema.safeParse(formData)
      if (!validation.success) {
        validation.error.issues.forEach((error) => {
          const path = error.path.join('.')
          toast.error(`${path}: ${error.message}`)
        })
        return
      }
    } catch (error) {
      console.error('Validation error:', error)
      toast.error("Validazione fallita. Controlla i tuoi dati.")
      return
    }

    setIsUploading(true)
    setUploadedCount(0)
    setCurrentFileName('')
    let localUploadedCount = 0
    const totalFiles = files.length

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const metadata = filesMetadata[file.id]
        setCurrentFileName(file.name)
        
        try {
          // Extract image dimensions
          let imageDimensions = { width: 0, height: 0 }
          try {
            imageDimensions = await getImageMetadata(file)
          } catch (error) {
            console.warn(`Could not extract dimensions for ${file.name}:`, error)
          }

          // Prepare form data for API call
          const formData = new FormData()
          formData.append('file', file)
          formData.append('title', metadata.title)
          formData.append('description', metadata.description || '')
          formData.append('tags', JSON.stringify(metadata.tags?.map(tag => tag.label) || []))
          
          // Add image dimensions
          if (imageDimensions.width > 0) {
            formData.append('width', imageDimensions.width.toString())
          }
          if (imageDimensions.height > 0) {
            formData.append('height', imageDimensions.height.toString())
          }

          // Upload through API endpoint
          const response = await fetch('/api/images', {
            method: 'POST',
            body: formData,
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || `HTTP ${response.status}`)
          }

          const uploadResult = await response.json()
          console.log('File uploaded successfully:', uploadResult)

          localUploadedCount++
          setUploadedCount(localUploadedCount)
          
          // Update progress
          if (localUploadedCount < totalFiles) {
            toast.info(`Caricati ${localUploadedCount}/${totalFiles} file...`)
          }

        } catch (fileError) {
          console.error(`Error uploading file ${file.name}:`, fileError)
          toast.error(`Errore nel caricamento di "${file.name}": ${fileError instanceof Error ? fileError.message : 'Errore sconosciuto'}`)
        }
      }

      // Show final success message
      if (localUploadedCount > 0) {
        if (localUploadedCount === totalFiles) {
          toast.success(`Tutti i ${localUploadedCount} file caricati con successo!`)
        } else {
          toast.success(`Caricati ${localUploadedCount} di ${totalFiles} file`)
        }
        
        // Clear form after successful upload
        clearAll()
        
        // Redirect to gallery after short delay
        setTimeout(() => {
          router.push('/')
        }, 2000)
      }

    } catch (error) {
      console.error('Upload error:', error)
      toast.error(`Caricamento fallito: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`)
    } finally {
      setIsUploading(false)
      setCurrentFileName('')
    }
  }, [files, filesMetadata, toast, router, clearAll])

  // Calculate total size
  const totalSize = files.reduce((acc, file) => acc + file.size, 0)
  const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2)

  return {
    files,
    filesMetadata,
    isUploading,
    uploadedCount,
    currentFileName,
    totalSizeMB,
    addFiles,
    removeFile,
    updateFileMetadata,
    uploadFiles,
    clearAll
  }
} 
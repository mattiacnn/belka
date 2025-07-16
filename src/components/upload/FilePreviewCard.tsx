'use client'

import React, { memo } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { IconX, IconPhoto } from '@tabler/icons-react'
import type { FileWithPreview, FileMetadata } from '@/hooks/useFileUpload'

interface FilePreviewCardProps {
  file: FileWithPreview
  metadata: FileMetadata
  onRemove: (fileId: string) => void
  onMetadataChange: (fileId: string, metadata: Partial<FileMetadata>) => void
}

export const FilePreviewCard = memo(function FilePreviewCard({ 
  file, 
  metadata, 
  onRemove, 
  onMetadataChange 
}: FilePreviewCardProps) {
  const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
  
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onMetadataChange(file.id, { title: event.target.value })
  }
  
  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onMetadataChange(file.id, { description: event.target.value })
  }
  
  return (
    <div className="group relative bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 hover:shadow-lg transition-all duration-200">
      {/* Preview Image */}
      <div className="aspect-video relative mb-4 bg-neutral-100 dark:bg-neutral-700 rounded-lg overflow-hidden">
        <Image
          src={file.preview}
          alt={file.name}
          fill
          className="object-cover transition-transform duration-200 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          quality={85}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R/W3Hf"
        />
        
        {/* Remove Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(file.id)}
          className="absolute top-2 right-2 h-8 w-8 bg-black/60 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-sm"
          title="Rimuovi file"
        >
          <IconX className="h-4 w-4" />
        </Button>
        
        {/* File Type Indicator */}
        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
          <IconPhoto className="h-3 w-3" />
          {file.type.split('/')[1].toUpperCase()}
        </div>
      </div>

      {/* File Metadata Form */}
      <div className="space-y-4">
        {/* Title Field */}
        <div className="space-y-2">
          <Label htmlFor={`title-${file.id}`} className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Titolo *
          </Label>
          <Input
            id={`title-${file.id}`}
            value={metadata.title}
            onChange={handleTitleChange}
            placeholder="Inserisci il titolo dell'immagine"
            className="text-sm"
            maxLength={30}
            required
          />
        </div>

        {/* Description Field */}
        <div className="space-y-2">
          <Label htmlFor={`description-${file.id}`} className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Descrizione
          </Label>
          <Textarea
            id={`description-${file.id}`}
            value={metadata.description || ''}
            onChange={handleDescriptionChange}
            placeholder="Descrivi questa foto (opzionale)"
            className="text-sm resize-none"
            rows={3}
            maxLength={100}
          />
        </div>

        {/* File Info */}
        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-700">
          <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <span className="truncate pr-2">{file.name}</span>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span>{fileSizeMB} MB</span>
              <span className="font-mono bg-neutral-100 dark:bg-neutral-700 px-2 py-1 rounded">
                {file.type.split('/')[1].toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}) 
'use client'

import { memo } from 'react'
import { FilePreviewCard } from './FilePreviewCard'
import { IconFiles, IconTrash } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import type { FileWithPreview, FileMetadata } from '@/hooks/useFileUpload'

interface FilesListProps {
  files: FileWithPreview[]
  filesMetadata: Record<string, FileMetadata>
  onRemoveFile: (fileId: string) => void
  onMetadataChange: (fileId: string, metadata: Partial<FileMetadata>) => void
  onClearAll?: () => void
}

export const FilesList = memo(function FilesList({ 
  files, 
  filesMetadata, 
  onRemoveFile, 
  onMetadataChange, 
  onClearAll 
}: FilesListProps) {
  if (files.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Files Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <IconFiles className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          <div>
            <h3 className="text-lg font-medium text-neutral-700 dark:text-neutral-300">
              File Selezionati
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {files.length} file{files.length > 1 ? 's' : ''} pronti per il caricamento
            </p>
          </div>
        </div>
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {files.map((file) => (
          <FilePreviewCard
            key={file.id}
            file={file}
            metadata={filesMetadata[file.id]}
            onRemove={onRemoveFile}
            onMetadataChange={onMetadataChange}
          />
        ))}
      </div>


    </div>
  )
}) 
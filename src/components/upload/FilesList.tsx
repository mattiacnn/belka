'use client'

import { memo } from 'react'
import { FilePreviewCard } from './FilePreviewCard'
import { IconFiles, IconTrash } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import type { FileWithPreview } from '@/hooks/useFileUpload'

interface FilesListProps {
  files: FileWithPreview[]
  onRemoveFile: (fileId: string) => void
  onClearAll?: () => void
}

export const FilesList = memo(function FilesList({ files, onRemoveFile, onClearAll }: FilesListProps) {
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {files.map((file) => (
          <FilePreviewCard
            key={file.id}
            file={file}
            onRemove={onRemoveFile}
          />
        ))}
      </div>

      {/* Files Summary */}
      <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">
            Totale file selezionati:
          </span>
          <span className="font-medium text-neutral-700 dark:text-neutral-300">
            {files.length} file{files.length > 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-neutral-600 dark:text-neutral-400">
            Dimensione totale:
          </span>
          <span className="font-medium text-neutral-700 dark:text-neutral-300">
            {(files.reduce((acc, file) => acc + file.size, 0) / (1024 * 1024)).toFixed(2)} MB
          </span>
        </div>
      </div>
    </div>
  )
}) 
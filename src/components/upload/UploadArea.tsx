'use client'

import { memo } from 'react'
import { FileUpload } from '@/components/ui/file-upload'
import { IconCloudUpload, IconInfoCircle } from '@tabler/icons-react'

interface UploadAreaProps {
  onFilesAdded: (files: File[]) => void
}

export const UploadArea = memo(function UploadArea({ onFilesAdded }: UploadAreaProps) {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <IconCloudUpload className="h-6 w-6 text-violet-600 dark:text-violet-400" />
          <h2 className="text-lg font-regular text-neutral-800 dark:text-neutral-200">
            Seleziona le tue foto
          </h2>
        </div>
        <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto text-sm">
          Trascina le immagini qui sotto o clicca per selezionarle. Puoi caricare fino a 20 foto alla volta.
        </p>
      </div>

      {/* File Upload Component */}
      <div className="border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-xl p-2 bg-neutral-50/50 dark:bg-neutral-800/50">
        <FileUpload onChange={onFilesAdded} />
      </div>
    </div>
  )
}) 
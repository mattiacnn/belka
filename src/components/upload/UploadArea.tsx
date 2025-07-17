'use client'

import { memo, useRef, forwardRef, useImperativeHandle } from 'react'
import { FileUpload, type FileUploadRef } from '@/components/ui/file-upload'
import { IconCloudUpload } from '@tabler/icons-react'

interface UploadAreaProps {
  onFilesAdded: (files: File[]) => void
}

export interface UploadAreaRef {
  reset: () => void
}

export const UploadArea = memo(forwardRef<UploadAreaRef, UploadAreaProps>(
  function UploadArea({ onFilesAdded }, ref) {
    const fileUploadRef = useRef<FileUploadRef>(null)

    useImperativeHandle(ref, () => ({
      reset: () => {
        fileUploadRef.current?.reset()
      }
    }))

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
          <FileUpload ref={fileUploadRef} onChange={onFilesAdded} />
        </div>
      </div>
    )
  }
))

UploadArea.displayName = "UploadArea" 
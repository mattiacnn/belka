'use client'

import { memo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { IconUpload, IconArrowLeft, IconCheck } from '@tabler/icons-react'

interface UploadActionsProps {
  filesCount: number
  isUploading: boolean
  onUpload: () => void
  onCancel?: () => void
}

export const UploadActions = memo(function UploadActions({ 
  filesCount, 
  isUploading, 
  onUpload, 
  onCancel 
}: UploadActionsProps) {
  const router = useRouter()
  
  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      router.push('/')
    }
  }

  return (
    <div className="pt-6 border-t border-neutral-200 dark:border-neutral-700">
      <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
        <Button
          variant="outline"
          onClick={handleCancel}
          disabled={isUploading}
          className="flex items-center gap-2"
        >
          <IconArrowLeft className="h-4 w-4" />
          Annulla
        </Button>
        
        <Button
          onClick={onUpload}
          disabled={isUploading || filesCount === 0}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white border-violet-600 hover:border-violet-700 disabled:bg-neutral-400 disabled:border-neutral-400"
        >
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Caricamento in corso...
            </>
          ) : (
            <>
              <IconUpload className="h-4 w-4" />
              Carica {filesCount > 0 ? `${filesCount} ` : ''}Foto{filesCount !== 1 ? '' : ''}
            </>
          )}
        </Button>
      </div>
      
    </div>
  )
}) 
'use client'

import { memo } from 'react'

interface UploadHeaderProps {
  filesCount: number
  totalSizeMB: string
}

export const UploadHeader = memo(function UploadHeader({ filesCount, totalSizeMB }: UploadHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">
            Carica Nuove Foto
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Seleziona le tue foto di viaggio e aggiungi tag per organizzarle
          </p>
        </div>
      </div>
      
      {filesCount > 0 && (
        <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
              <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
                {filesCount} file{filesCount > 1 ? 's' : ''} selezionati
              </span>
            </div>
            <span className="text-sm text-violet-600 dark:text-violet-400">
              {totalSizeMB} MB totali
            </span>
          </div>
        </div>
      )}
    </div>
  )
}) 
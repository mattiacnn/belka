'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import { IconUpload, IconCheck, IconX } from '@tabler/icons-react'

interface UploadProgressProps {
  isUploading: boolean
  filesCount: number
  uploadedCount?: number
  currentFileName?: string
}

export const UploadProgress = memo(function UploadProgress({ 
  isUploading, 
  filesCount, 
  uploadedCount = 0,
  currentFileName 
}: UploadProgressProps) {
  if (!isUploading) return null

  const progress = filesCount > 0 ? (uploadedCount / filesCount) * 100 : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 max-w-md w-full shadow-2xl border border-neutral-200 dark:border-neutral-700">
        <div className="text-center space-y-4">
          {/* Upload Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center">
                <IconUpload className="h-8 w-8 text-violet-600 dark:text-violet-400 animate-bounce" />
              </div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-violet-200 dark:border-violet-700 rounded-full animate-spin border-t-violet-600 dark:border-t-violet-400"></div>
            </div>
          </div>

          {/* Progress Text */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
              Caricamento in corso...
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {uploadedCount} di {filesCount} file caricati
            </p>
            {currentFileName && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                Caricando: {currentFileName}
              </p>
            )}
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
              <motion.div
                className="bg-violet-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
              <span>{Math.round(progress)}%</span>
              <span>{uploadedCount}/{filesCount}</span>
            </div>
          </div>

          {/* Status Message */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Le tue foto vengono caricate e organizzate nella galleria. Non chiudere questa pagina.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}) 
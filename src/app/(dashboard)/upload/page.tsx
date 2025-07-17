'use client'

import { useRef, useEffect } from 'react'
import { Toaster, useToast } from '@/components/ui/toast'
import { useFileUpload } from '@/hooks/useFileUpload'
import { 
  UploadHeader, 
  UploadArea, 
  type UploadAreaRef,
  FilesList, 
  UploadActions,
  UploadProgress 
} from '@/components/upload'

export default function UploadPage() {
  const toast = useToast()
  const uploadAreaRef = useRef<UploadAreaRef>(null)
  
  const {
    files,
    filesMetadata,
    fileErrors,
    isUploading,
    uploadedCount,
    currentFileName,
    totalSizeMB,
    addFiles,
    removeFile,
    updateFileMetadata,
    clearFileErrors,
    uploadFiles,
    clearAll,
    registerResetCallback
  } = useFileUpload()

  // Register the reset callback when component mounts
  useEffect(() => {
    registerResetCallback(() => {
      uploadAreaRef.current?.reset()
    })
  }, [registerResetCallback])

  return (
    <>
      <div className="">
        {/* Page Header */}
        <UploadHeader 
          filesCount={files.length} 
          totalSizeMB={totalSizeMB} 
        />

        {/* Main Content */}
        <div className="space-y-8">
          {/* File Upload Area */}
          <section>
            <UploadArea onFilesAdded={addFiles} ref={uploadAreaRef} />
          </section>

          {/* Selected Files */}
          {files.length > 0 && (
            <section>
              <FilesList 
                files={files}
                filesMetadata={filesMetadata}
                fileErrors={fileErrors}
                onRemoveFile={removeFile}
                onMetadataChange={updateFileMetadata}
                onClearErrors={clearFileErrors}
                onClearAll={clearAll}
              />
            </section>
          )}

          {/* Upload Actions */}
          {files.length > 0 && (
            <section>
              <UploadActions
                filesCount={files.length}
                isUploading={isUploading}
                onUpload={uploadFiles}
                onCancel={clearAll}
              />
            </section>
          )}
        </div>

        {/* Toast Notifications */}
        <Toaster toasts={toast.toasts} onDismiss={toast.dismissToast} />
      </div>

      {/* Upload Progress Modal */}
      {isUploading && (
        <UploadProgress
          isUploading={isUploading}
          filesCount={files.length}
          uploadedCount={uploadedCount}
          currentFileName={currentFileName}
        />
      )}
    </>
  )
} 
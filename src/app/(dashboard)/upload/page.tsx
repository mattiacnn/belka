'use client'

import { Toaster, useToast } from '@/components/ui/toast'
import { useFileUpload } from '@/hooks/useFileUpload'
import { 
  UploadHeader, 
  UploadArea, 
  FilesList, 
  UploadActions,
  UploadProgress 
} from '@/components/upload'

export default function UploadPage() {
  const toast = useToast()
  const {
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
  } = useFileUpload()

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
            <UploadArea onFilesAdded={addFiles} />
          </section>

          {/* Selected Files */}
          {files.length > 0 && (
            <section>
              <FilesList 
                files={files}
                filesMetadata={filesMetadata}
                onRemoveFile={removeFile}
                onMetadataChange={updateFileMetadata}
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
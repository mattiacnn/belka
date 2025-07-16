'use client'

import { Toaster, useToast } from '@/components/ui/toast'
import { useFileUpload } from '@/hooks/useFileUpload'
import { 
  UploadHeader, 
  UploadArea, 
  FilesList, 
  TagsSection, 
  UploadActions,
  UploadProgress 
} from '@/components/upload'

export default function UploadPage() {
  const toast = useToast()
  const {
    files,
    selectedTags,
    isUploading,
    uploadedCount,
    currentFileName,
    totalSizeMB,
    addFiles,
    removeFile,
    setSelectedTags,
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
                onRemoveFile={removeFile}
                onClearAll={clearAll}
              />
            </section>
          )}

          {/* Tags Selection */}
          {files.length > 0 && (
            <section>
              <TagsSection 
                selectedTags={selectedTags}
                onTagsChange={setSelectedTags}
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
      <UploadProgress
        isUploading={isUploading}
        filesCount={files.length}
        uploadedCount={uploadedCount}
        currentFileName={currentFileName}
      />
    </>
  )
} 
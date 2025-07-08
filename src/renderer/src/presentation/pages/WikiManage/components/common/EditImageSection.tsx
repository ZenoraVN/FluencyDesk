import { Button } from '../../../../components/ui/button'
import { MultiImageDropzone } from '../../../../../componentsImage/CustomMultiImageDropzone'
import { Loader2 } from 'lucide-react'

export interface ImageSectionProps {
  keptImageUrls: string[]
  setKeptImageUrls: React.Dispatch<React.SetStateAction<string[]>>
  imageFiles: File[]
  setImageFiles: React.Dispatch<React.SetStateAction<File[]>>
  imageFilePreviews: string[]
  setImageFilePreviews: React.Dispatch<React.SetStateAction<string[]>>
  deletedImageIndexes: Set<number>
  setDeletedImageIndexes: React.Dispatch<React.SetStateAction<Set<number>>>
  fieldStatus: 'idle' | 'success' | 'error' | 'modified'
  setFieldStatus: (val: 'idle' | 'success' | 'error' | 'modified') => void

  imageError: string | null
  setImageError: (v: string | null) => void
  imageSaveLoading: boolean
  handleSaveImages: () => Promise<void>
  handleCancelImages: () => void
  originalImageUrlsLength: number
  onPreviewImages?: (
    images: { src: string; name?: string; size?: string; type?: string }[],
    index: number
  ) => void
}

export function EditImageSection({
  keptImageUrls,
  setKeptImageUrls,
  imageFiles,
  setImageFiles,
  setImageFilePreviews,
  deletedImageIndexes,
  setFieldStatus,
  imageError,
  imageSaveLoading,
  handleSaveImages,
  handleCancelImages,
  originalImageUrlsLength,
  onPreviewImages
}: ImageSectionProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[#2D3748] font-medium">Hình ảnh</h3>
        {(imageFiles.length > 0 ||
          keptImageUrls.length !== originalImageUrlsLength ||
          deletedImageIndexes.size > 0) && (
          <div className="flex gap-2">
            <Button
              onClick={handleCancelImages}
              type="button"
              variant="ghost"
              size="sm"
              className="border bg-gray-100 hover:bg-gray-200 text-gray-600"
              disabled={imageSaveLoading}
            >
              Hủy thay đổi
            </Button>
            <Button
              onClick={handleSaveImages}
              type="button"
              variant="outline"
              size="sm"
              disabled={imageSaveLoading}
              className="bg-[#52aaa5]/10 text-[#52aaa5] hover:bg-[#52aaa5]/20 flex items-center gap-2"
            >
              {imageSaveLoading && <Loader2 className="w-4 h-4 animate-spin mr-1" />}
              Lưu thay đổi
            </Button>
          </div>
        )}
      </div>
      <div className="space-y-4">
        {/* TRUYỀN THÊM imageUrls vào đây */}
        <MultiImageDropzone
          files={imageFiles}
          imageUrls={keptImageUrls}
          onChange={(newFiles) => {
            setImageFiles(newFiles)
            setFieldStatus('modified')
            setImageFilePreviews(newFiles.map((f) => URL.createObjectURL(f)))
          }}
          onRemoveImageUrl={(idx) => {
            setKeptImageUrls((prev) => prev.filter((_, i) => i !== idx))
            setFieldStatus('modified')
          }}
          onPreviewImage={(idx, images) => {
            if (onPreviewImages) onPreviewImages(images, idx)
          }}
        />
        {imageError && <div className="text-red-500 text-xs px-1">{imageError}</div>}
      </div>
    </div>
  )
}

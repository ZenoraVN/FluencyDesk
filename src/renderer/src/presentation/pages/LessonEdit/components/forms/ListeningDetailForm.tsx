import { FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '../../../../../components/ui/form'
import { Button } from '../../../../../components/ui/button'
import { Upload, X } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { RichtextchtEditor } from '../../../../../components/Input/CustomRichtext'
import { MultiImageDropzone } from '../../../../../components/Image/CustomMultiImageDropzone'

export interface ListeningDetailFormData {
  transcript?: string
  audio_file?: File
  image_files?: File[]
}

interface ListeningDetailFormProps {
  onChange: (data: ListeningDetailFormData) => void
  initialData?: {
    transcript?: string
    audio_file?: File
    image_files?: File[]
  }
}

export const ListeningDetailForm: FC<ListeningDetailFormProps> = ({ initialData, onChange }) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [, setImageUrls] = useState<string[]>([])

  const form = useForm<ListeningDetailFormData>({
    defaultValues: {
      transcript: initialData?.transcript || '',
      audio_file: initialData?.audio_file,
      image_files: initialData?.image_files || []
    }
  })

  // Force show validation on mount
  useEffect(() => {
    form.trigger('audio_file')
  }, [])

  // Set initial files and emit changes
  useEffect(() => {
    if (initialData) {
      if (initialData.audio_file) {
        form.setValue('audio_file', initialData.audio_file)
      }
      if (initialData.image_files?.length) {
        form.setValue('image_files', initialData.image_files)
      }
    }
  }, [initialData, form])

  // Watch form changes and emit to parent
  useEffect(() => {
    const subscription = form.watch((value) => {
      onChange(value as ListeningDetailFormData)
    })
    return () => subscription.unsubscribe()
  }, [form, onChange])

  // Create audio preview URLs
  useEffect(() => {
    const audioFile = form.watch('audio_file')
    if (audioFile) {
      const url = URL.createObjectURL(audioFile)
      setAudioUrl(url)
      return () => URL.revokeObjectURL(url)
    }
    setAudioUrl(null)
    return () => {}
  }, [form.watch('audio_file')])

  // Create image preview URLs
  useEffect(() => {
    const imageFiles = form.watch('image_files') || []
    const urls = imageFiles.map((file) => URL.createObjectURL(file))
    setImageUrls(urls)
    return () => urls.forEach((url) => URL.revokeObjectURL(url))
  }, [form.watch('image_files')])

  // Handle image upload
  const handleImageDrop = (newFiles: File[]) => {
    form.setValue('image_files', newFiles, {
      shouldValidate: true,
      shouldDirty: true
    })
  }

  const ImageUploadSection = () => (
    <div className="space-y-4">
      <MultiImageDropzone files={form.watch('image_files') || []} onChange={handleImageDrop} />
    </div>
  )

  return (
    <Form {...form}>
      <form className="space-y-6">
        <div className="rounded-lg space-y-6">
          {/* Audio Upload */}
          <FormField
            control={form.control}
            name="audio_file"
            rules={{
              validate: (value) => !!value || 'Vui lòng tải lên file âm thanh'
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => {
              const { getRootProps, getInputProps, isDragActive } = useDropzone({
                accept: {
                  'audio/mpeg': ['.mp3'],
                  'audio/mp3': ['.mp3']
                },
                maxFiles: 1,
                onDrop: async (acceptedFiles) => {
                  const file = acceptedFiles[0]
                  if (file) {
                    onChange(file)
                    // Update form value and trigger validation
                    await form.setValue('audio_file', file, {
                      shouldValidate: true,
                      shouldDirty: true
                    })
                  }
                }
              })

              return (
                <FormItem>
                  <FormLabel className="text-[#2D3748] font-medium">File âm thanh (MP3)</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {!value && (
                        <div
                          {...getRootProps()}
                          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                            ${
                              isDragActive
                                ? 'border-blue-500 bg-blue-50'
                                : error
                                  ? 'border-red-500 hover:border-red-600'
                                  : 'border-gray-300 hover:border-blue-400'
                            }`}
                        >
                          <input {...getInputProps()} />
                          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-600">
                            {isDragActive
                              ? 'Thả file vào đây'
                              : 'Kéo thả file MP3 hoặc click để chọn'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Chỉ chấp nhận file MP3</p>
                        </div>
                      )}

                      {value && audioUrl && (
                        <div className="relative bg-[#52aaa5]/5 rounded-lg p-4">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 flex items-center justify-center bg-[#52aaa5]/10 rounded-lg">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6 text-[#52aaa5]"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                <line x1="12" y1="19" x2="12" y2="23" />
                                <line x1="8" y1="23" x2="16" y2="23" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-[#2D3748] font-medium mb-1">
                                Xem trước âm thanh
                              </h4>
                              <p className="text-sm text-gray-600 truncate">
                                {(value as File).name}
                              </p>
                            </div>
                          </div>

                          <div className="bg-[#52aaa5]/5 rounded-lg p-2">
                            <audio
                              controls
                              className="w-full"
                              src={audioUrl}
                              style={{
                                height: '36px'
                              }}
                            />
                          </div>

                          <Button
                            type="button"
                            onClick={() => {
                              onChange(undefined)
                              setAudioUrl(null)
                            }}
                            className="absolute top-2 right-2 w-8 h-8 p-0 bg-red-500 text-white rounded-lg hover:bg-red-600"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}

                      {error && <div className="text-sm text-red-500 mt-1">{error.message}</div>}
                    </div>
                  </FormControl>
                </FormItem>
              )
            }}
          />

          {/* Transcript */}
          <FormField
            control={form.control}
            name="transcript"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#2D3748] font-medium">
                  Nội dung bài nghe (Không bắt buộc)
                </FormLabel>
                <FormControl>
                  <div className="mt-2">
                    <RichtextchtEditor
                      value={field.value || ''}
                      onChange={field.onChange}
                      className="border-[#52aaa5]/20"
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          {/* Image Upload */}
          <FormItem>
            <FormLabel className="text-[#2D3748] font-medium">Hình ảnh (Không bắt buộc)</FormLabel>
            <FormControl>
              <ImageUploadSection />
            </FormControl>
          </FormItem>
        </div>
      </form>
    </Form>
  )
}

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '../../../../../components/ui/form'
import { ButtonGroup, Option } from '../../../../../componentsButton/ButtonGroup'
import { CustomInput } from '../../../../../componentsInput/CustomInput'
import { MultiImageDropzone } from '../../../../../componentsImage/CustomMultiImageDropzone'
import { UseFormReturn } from 'react-hook-form'
import { CreatePhraseFormData } from './CreatePhraseDrawer'
import { Button } from '../../../../../components/ui/button'
import { Sparkles, Search, Plus, Minus } from 'lucide-react'
import { RichtextchtEditor } from '../../../../../componentsInput/CustomRichtext'
import { RichtextView } from '../../../../../componentscommon/RichtextView'

interface Props {
  form: UseFormReturn<CreatePhraseFormData>
  frequencyBtnOptions: Option<string>[]
  levelBtnOptions: Option<string>[]
  frequencyBtnColors: string[]
  levelBtnColors: string[]
  isSubmitting: boolean
  handleCheckPhrase: () => void
  isChecking: boolean
  searchBtnDisabled: boolean
  searchBtnClassName: string
  hasCheckedPhrase: boolean
  phraseExists: boolean
  isGenerating: boolean
  handleGeminiClick: () => void
  sparklesBtnClassName: string
  checkResult: any
  usageNoteInput: string
  setUsageNoteInput: (val: string) => void
  handleAddUsageNote: () => void
  handleRemoveUsageNote: (index: number) => void
}
export const CreatePhraseInfoSection = ({
  form,
  frequencyBtnOptions,
  frequencyBtnColors,
  levelBtnOptions,
  levelBtnColors,
  isSubmitting,
  handleCheckPhrase,
  isChecking,
  searchBtnDisabled,
  searchBtnClassName,
  hasCheckedPhrase,
  phraseExists,
  isGenerating,
  handleGeminiClick,
  sparklesBtnClassName,
  checkResult,
  usageNoteInput,
  setUsageNoteInput,
  handleAddUsageNote,
  handleRemoveUsageNote
}: Props) => (
  <div className="space-y-6 flex-1">
    <div className="grid grid-cols-2 gap-4">
      {/* PHRASE */}
      <FormField
        control={form.control}
        name="phrase"
        render={({ field, fieldState: { error } }) => (
          <FormItem>
            <FormLabel className="text-[#2D3748] font-medium">Cụm từ</FormLabel>
            <div className="flex gap-2 items-center">
              <FormControl className="flex-1">
                <CustomInput
                  className={`w-full bg-transparent text-[#2D3748] ${
                    error
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                      : 'border-[#52aaa5] hover:border-[#52aaa5] focus:border-[#52aaa5] focus:ring-2 focus:ring-[#52aaa5]/20'
                  }`}
                  value={field.value || ''}
                  onChange={field.onChange}
                  disabled={isSubmitting}
                />
              </FormControl>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleCheckPhrase}
                disabled={searchBtnDisabled}
                className={searchBtnClassName}
              >
                {isChecking ? (
                  <span className="animate-spin">
                    <Search className="h-4 w-4" />
                  </span>
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
              {hasCheckedPhrase && !phraseExists && !isChecking && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleGeminiClick}
                  disabled={isGenerating}
                  className={sparklesBtnClassName}
                >
                  <Sparkles className="h-4 w-4" />
                </Button>
              )}
            </div>
            {checkResult && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg mt-2">
                <p className="text-red-700 text-sm font-medium mb-1">
                  Cụm từ này đã tồn tại trong hệ thống
                </p>
                <div className="text-sm text-red-600">
                  <p>Phát âm: {checkResult.pronunciation || 'N/A'}</p>
                  <p>Tần suất: {checkResult.frequency || 'N/A'}</p>
                  <p>Cấp độ: {checkResult.language_level || 'N/A'}</p>
                </div>
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
      {/* PRONUNCIATION */}
      <FormField
        control={form.control}
        name="pronunciation"
        render={({ field, fieldState: { error } }) => (
          <FormItem>
            <FormLabel className="text-[#2D3748] font-medium">Phát âm</FormLabel>
            <FormControl>
              <CustomInput
                value={field.value || ''}
                onChange={field.onChange}
                disabled={isSubmitting}
                className={`bg-transparent text-[#2D3748] ${
                  error
                    ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                    : 'border-[#52aaa5] hover:border-[#52aaa5] focus:border-[#52aaa5] focus:ring-2 focus:ring-[#52aaa5]/20'
                }`}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
    {/* Image Upload */}
    <FormField
      control={form.control}
      name="image_files"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-[#2D3748] font-medium">Hình ảnh (Không bắt buộc)</FormLabel>
          <FormControl>
            <div className="space-y-4 pb-4">
              <MultiImageDropzone
                files={field.value || []}
                onChange={async (newFiles) => {
                  await form.setValue('image_files', newFiles, {
                    shouldValidate: true,
                    shouldDirty: true
                  })
                }}
              />
            </div>
          </FormControl>
        </FormItem>
      )}
    />
    {/* Frequency & Level */}
    <div className="grid grid-cols-2 gap-4 mb-4">
      <FormField
        control={form.control}
        name="frequency"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#2D3748] font-medium mb-2 block">Tần suất</FormLabel>
            <FormControl>
              <ButtonGroup
                options={frequencyBtnOptions}
                selected={field.value}
                onClick={field.onChange}
                colorNames={frequencyBtnColors}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="language_level"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#2D3748] font-medium mb-2 block">Cấp độ</FormLabel>
            <FormControl>
              <ButtonGroup
                options={levelBtnOptions}
                selected={field.value}
                onClick={field.onChange}
                colorNames={levelBtnColors}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
    {/* ------------ USAGE NOTES --------------- */}
    <FormField
      control={form.control}
      name="usage_notes"
      rules={{
        validate: {
          required: (value) => {
            if (!value || value.length === 0) return 'Vui lòng thêm ít nhất một ghi chú'
            return true
          }
        }
      }}
      render={({ fieldState: { error } }) => (
        <FormItem>
          <div className="flex items-center justify-between mb-2">
            <FormLabel className="text-[#2D3748] font-medium">Ghi chú sử dụng</FormLabel>
            <Button
              type="button"
              onClick={handleAddUsageNote}
              variant="outline"
              size="sm"
              className={`flex items-center gap-2 bg-[#52aaa5]/10 text-[#52aaa5] hover:bg-[#52aaa5]/20 ${
                error ? 'border-red-500' : 'border-[#52aaa5]'
              }`}
            >
              <Plus className="h-4 w-4" />
              Thêm
            </Button>
          </div>
          <FormControl>
            <div className="space-y-2">
              <div className="flex-1">
                <RichtextchtEditor
                  value={usageNoteInput}
                  onChange={setUsageNoteInput}
                  className={error ? 'border-red-500' : ''}
                />
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    {/* Usage Notes List */}
    <div className="mt-4 space-y-2">
      {form.watch('usage_notes')?.map((note, index, array) => (
        <div
          key={index}
          className={`group relative flex items-start gap-3 rounded-lg border border-[#52aaa5]/10 p-4
            ${index !== array.length - 1 ? 'mb-2' : ''}`}
        >
          <div className="flex-1">
            <RichtextView content={note} className="text-[#2D3748]" />
          </div>
          <div className="absolute right-2 top-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveUsageNote(index)}
              className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
            >
              <Minus className="h-4 w-4 mr-1" />
              Xóa
            </Button>
          </div>
        </div>
      ))}
      {form.watch('usage_notes')?.length === 0 && (
        <div className="text-center py-3 text-gray-500 text-sm italic">Chưa có ghi chú nào</div>
      )}
    </div>
  </div>
)

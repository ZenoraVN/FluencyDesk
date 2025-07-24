import { FC, useEffect, useRef } from 'react'
import { useFormContext, useFieldArray } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel } from '../../../../../components/ui/form'
import { Button } from '../../../../../components/ui/button'
import { Plus, Minus } from 'lucide-react'
import { CustomInput } from '../../../../../components/Input/CustomInput'

export interface ShadowWordFormData {
  shadow_words: Array<{
    content: string
    ipa?: string
  }>
}

interface ShadowWordFormProps {
  initialData?: ShadowWordFormData
}

export const ShadowWordForm: FC<ShadowWordFormProps> = ({ initialData }) => {
  const form = useFormContext<ShadowWordFormData>()
  const initialized = useRef(false)
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'shadow_words',
    rules: { required: 'Vui lòng thêm ít nhất một nội dung' }
  })

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      const hasInitial =
        initialData &&
        Array.isArray(initialData.shadow_words) &&
        initialData.shadow_words.length > 0
      if (hasInitial) {
        initialData!.shadow_words.forEach((item) => append(item))
      } else if (fields.length === 0) {
        append({ content: '', ipa: '' })
      }
    }
  }, [initialData, append, fields.length])

  useEffect(() => {
    form.trigger('shadow_words')
  }, [])

  return (
    <>
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-[auto_1fr_1fr_auto] gap-x-4 items-center">
            {/* Sequence number */}
            <div className="flex items-center justify-center">
              <span className="text-gray-500">{index + 1}.</span>
            </div>
            <div className="flex-1">
              {/* Content input */}
              <FormField
                control={form.control}
                name={`shadow_words.${index}.content`}
                rules={{ required: 'Vui lòng nhập nội dung' }}
                render={({ field: inputField, fieldState: { error } }) => (
                  <FormItem>
                    <FormLabel>Nội dung</FormLabel>
                    <FormControl>
                      <CustomInput
                        value={inputField.value || ''}
                        onChange={inputField.onChange}
                        className={`w-full ${
                          error
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-[#52aaa5] hover:border-[#52aaa5]'
                        }`}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-1">
              {/* IPA input */}
              <FormField
                control={form.control}
                name={`shadow_words.${index}.ipa`}
                render={({ field: inputField }) => (
                  <FormItem>
                    <FormLabel>IPA (tuỳ chọn)</FormLabel>
                    <FormControl>
                      <CustomInput
                        value={inputField.value || ''}
                        onChange={inputField.onChange}
                        className="w-full border-[#52aaa5] hover:border-[#52aaa5]"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            {fields.length > 1 && (
              <div className="self-start mt-6 flex items-center justify-center">
                <Button
                  type="button"
                  onClick={() => remove(index)}
                  className="h-10 w-10 flex items-center justify-center text-gray-400 hover:text-red-600 border border-red-600 rounded-lg"
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        ))}
        {/* Add new entry */}
        {fields.length < 10 && (
          <Button
            type="button"
            onClick={() => append({ content: '', ipa: '' })}
            className="flex items-center gap-2 text-gray-500 hover:text-[#52aaa5]"
          >
            <Plus className="h-4 w-4" /> Thêm nội dung
          </Button>
        )}
        {/* Validation error */}
        {form.formState.errors.shadow_words?.root && (
          <div className="text-sm text-red-500">
            {form.formState.errors.shadow_words.root.message}
          </div>
        )}
      </div>
    </>
  )
}

export default ShadowWordForm

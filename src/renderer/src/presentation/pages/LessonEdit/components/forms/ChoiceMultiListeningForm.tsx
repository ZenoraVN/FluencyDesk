import { FC, useEffect, useRef } from 'react'
import { useFormContext, useFieldArray } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '../../../../../components/ui/form'
import { Button } from '../../../../../components/ui/button'
import { Checkbox } from '../../../../../components/ui/checkbox'
import { Plus, Minus } from 'lucide-react'
import { RichtextchtEditor } from '../../../../../components/Input/CustomRichtext'
import { CustomInput } from '../../../../../components/Input/CustomInput'

export interface ChoiceMultiListeningFormData {
  choice_multi_question: {
    question: string
    explain: string
  }
  choice_multi_options: Array<{
    option: string
    is_correct: boolean
  }>
}

interface ChoiceMultiListeningFormProps {
  initialData?: ChoiceMultiListeningFormData
}

export const ChoiceMultiListeningForm: FC<ChoiceMultiListeningFormProps> = ({ initialData }) => {
  const form = useFormContext<ChoiceMultiListeningFormData>()
  const initialized = useRef(false)

  const { fields, append, remove } = useFieldArray<ChoiceMultiListeningFormData>({
    control: form.control,
    name: 'choice_multi_options',
    rules: {
      required: 'Vui lòng thêm ít nhất một lựa chọn',
      validate: {
        minThree: (v) => (v?.length ?? 0) >= 3 || 'Phải có ít nhất 3 lựa chọn',
        maxTen: (v) => (v?.length ?? 0) <= 10 || 'Chỉ được tối đa 10 lựa chọn',
        hasAnswers: (v) => {
          const correct = v?.filter((o) => o.is_correct).length || 0
          const wrong = v?.filter((o) => !o.is_correct).length || 0
          return (correct >= 2 && wrong >= 1) || 'Phải có ít nhất 2 đáp án đúng và 1 sai'
        },
        noDuplicates: (v) => {
          const opts = v?.map((o) => o.option.trim()) || []
          return new Set(opts).size === opts.length || 'Các lựa chọn không được trùng nhau'
        }
      }
    }
  })

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      const hasInit =
        Array.isArray(initialData?.choice_multi_options) &&
        initialData!.choice_multi_options.length > 0
      if (!hasInit && fields.length === 0) {
        append([
          { option: '', is_correct: true },
          { option: '', is_correct: true },
          { option: '', is_correct: false }
        ])
      }
    }
  }, [initialData, fields.length, append])

  useEffect(() => {
    form.trigger([
      'choice_multi_question.question',
      'choice_multi_question.explain',
      'choice_multi_options'
    ])
  }, [])

  useEffect(() => {
    if (fields.length > 0) {
      form.trigger('choice_multi_options')
    }
  }, [fields.length])

  return (
    <Form {...form}>
      <div className="flex space-x-6">
        {/* Left Panel: Question & Explanation */}
        <div className="w-1/2 space-y-6">
          {/* Question */}
          <div className="space-y-4">
            <div className="rounded-lg overflow-hidden question-section">
              <FormField
                control={form.control}
                name="choice_multi_question.question"
                rules={{
                  required: 'Vui lòng nhập câu hỏi',
                  validate: (v) => {
                    const plain = (v || '').replace(/<p>|<\/p>|<br\s*\/?>/gi, '').trim()
                    return plain ? true : 'Vui lòng nhập câu hỏi'
                  }
                }}
                render={({ field }) => {
                  const plain = (field.value || '').replace(/<p>|<\/p>|<br\s*\/?>/gi, '').trim()
                  return (
                    <FormItem>
                      <FormLabel className="text-[#2D3748] font-medium">Câu hỏi</FormLabel>
                      <FormControl>
                        <div className="mt-2">
                          <RichtextchtEditor
                            value={field.value || ''}
                            onChange={field.onChange}
                            className={
                              !plain ? 'border-red-500 text-red-500' : 'hover:border-[#52aaaf]'
                            }
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )
                }}
              />
            </div>
          </div>
          {/* Explanation */}
          <div className="space-y-4">
            <div className="rounded-lg overflow-hidden question-section">
              <FormField
                control={form.control}
                name="choice_multi_question.explain"
                rules={{ required: 'Vui lòng nhập giải thích' }}
                render={({ field }) => {
                  const plain = (field.value || '').replace(/<p>|<\/p>|<br\s*\/?>/gi, '').trim()
                  return (
                    <FormItem>
                      <FormLabel className="text-[#2D3748] font-medium">Giải thích</FormLabel>
                      <FormControl>
                        <div className="mt-2">
                          <RichtextchtEditor
                            value={field.value || ''}
                            onChange={field.onChange}
                            className={
                              !plain ? 'border-red-500 text-red-500' : 'hover:border-[#52aaaf]'
                            }
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )
                }}
              />
            </div>
          </div>
        </div>
        {/* Right Panel: Options */}
        <div className="w-1/2 space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3">
              <div>
                <h4 className="text-sm font-medium text-[#2D3748]">Các lựa chọn</h4>
                {form.formState.errors.choice_multi_options?.root && (
                  <div className="text-sm text-red-500 mt-1">
                    {form.formState.errors.choice_multi_options.root.message}
                  </div>
                )}
              </div>
              {fields.length < 10 && (
                <Button
                  type="button"
                  onClick={() => append({ option: '', is_correct: false })}
                  className="p-2 text-gray-500 hover:text-[#52aaa5]"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {fields.map((field, index) => (
                <div key={field.id} className="relative rounded-lg">
                  <div className="flex gap-4 items-center">
                    {/* Checkbox */}
                    <div className="flex justify-center px-2">
                      <FormField
                        control={form.control}
                        name={`choice_multi_options.${index}.is_correct`}
                        render={({ field: chk }) => (
                          <FormItem className="flex items-center space-x-3">
                            <FormControl>
                              <Checkbox
                                checked={Boolean(chk.value)}
                                onCheckedChange={(val: boolean) => {
                                  chk.onChange(val || false)
                                  form.trigger('choice_multi_options')
                                }}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    {/* Option Input */}
                    <div className="flex-1 min-w-0">
                      <FormField
                        control={form.control}
                        name={`choice_multi_options.${index}.option`}
                        rules={{ required: 'Vui lòng nhập lựa chọn' }}
                        render={({ field: inputField }) => (
                          <FormItem>
                            <FormControl>
                              <div className="block w-full">
                                <CustomInput
                                  value={inputField.value || ''}
                                  onChange={(val: string) => {
                                    inputField.onChange(val)
                                    form.trigger('choice_multi_options')
                                  }}
                                  className={`w-full bg-[#fdfdfb] text-[#2D3748] min-h-[40px] py-1.5 my-1 ${
                                    form.formState.errors.choice_multi_options?.root
                                      ? 'border-red-500 focus:ring-red-500'
                                      : 'border-[#52aaa5] hover:border-[#52aaa5] focus:border-[#52aaa5] focus:ring-2 focus:ring-[#52aaa5]/20'
                                  }`}
                                />
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    {/* Remove Button */}
                    {fields.length > 3 && (
                      <Button
                        type="button"
                        onClick={() => remove(index)}
                        className="flex items-center gap-2 px-3 h-[34px] text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded-lg"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Form>
  )
}

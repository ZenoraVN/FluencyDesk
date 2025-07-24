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
import { RadioGroup, RadioGroupItem } from '../../../../../components/ui/radio-group'
import { Plus, Minus } from 'lucide-react'
import { RichtextchtEditor } from '../../../../../components/Input/CustomRichtext'
import { CustomInput } from '../../../../../components/Input/CustomInput'

export interface ChoiceOneReadingFormData {
  choice_one_question: {
    question: string
    explain: string
  }
  choice_one_options: Array<{
    option: string
    is_correct: boolean
  }>
}

interface ChoiceOneReadingFormProps {
  initialData?: ChoiceOneReadingFormData
}

export const ChoiceOneReadingForm: FC<ChoiceOneReadingFormProps> = ({
  initialData
}): JSX.Element => {
  const form = useFormContext<ChoiceOneReadingFormData>()
  const initialized = useRef(false)

  const { fields, append, remove } = useFieldArray<ChoiceOneReadingFormData>({
    control: form.control,
    name: 'choice_one_options',
    rules: { required: 'Vui lòng thêm ít nhất một lựa chọn' }
  })

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      const hasInitialOptions =
        initialData &&
        Array.isArray(initialData.choice_one_options) &&
        initialData.choice_one_options.length > 0
      if (!hasInitialOptions && fields.length === 0) {
        append([
          { option: '', is_correct: false },
          { option: '', is_correct: false }
        ])
      }
    }
  }, [initialData, fields.length, append])

  useEffect(() => {
    form.trigger([
      'choice_one_question.question',
      'choice_one_question.explain',
      'choice_one_options'
    ])
  }, [])

  useEffect(() => {
    if (fields.length > 0) {
      form.trigger('choice_one_options')
    }
  }, [fields.length])

  return (
    <Form {...form}>
      <div className="flex space-x-6">
        {/* Left Panel: Question & Explanation */}
        <div className="w-1/2 space-y-6">
          {/* Question Section */}
          <div className="space-y-4">
            <div className="rounded-lg overflow-hidden question-section">
              <FormField
                control={form.control}
                name="choice_one_question.question"
                rules={{
                  required: 'Vui lòng nhập câu hỏi',
                  validate: (value) => {
                    const plain = (value || '').replace(/<p>|<\/p>|<br\s*\/?>/gi, '').trim()
                    if (!plain) return 'Vui lòng nhập câu hỏi'
                    return true
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
                      {/* removed inline question error message */}
                    </FormItem>
                  )
                }}
              />
            </div>
          </div>
          {/* Explanation Section */}
          <div className="space-y-4">
            <div className="rounded-lg overflow-hidden question-section">
              <FormField
                control={form.control}
                name="choice_one_question.explain"
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
                      {/* explanation error removed */}
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
                {form.formState.errors.choice_one_options?.root && (
                  <div className="text-sm text-red-500 mt-1">
                    {form.formState.errors.choice_one_options.root.message}
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
                  <div className="flex gap-4">
                    {/* RadioGroup chọn đáp án đúng */}
                    <div className="flex justify-center px-2">
                      <FormField
                        control={form.control}
                        name={`choice_one_options.${index}.is_correct`}
                        render={({ field: radioField }) => (
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroup
                                onValueChange={() => {
                                  const newOptions = form
                                    .getValues('choice_one_options')
                                    .map((opt, i) => ({
                                      ...opt,
                                      is_correct: i === index
                                    }))
                                  form.setValue('choice_one_options', newOptions)
                                  form.trigger('choice_one_options')
                                }}
                                value={radioField.value ? 'true' : ''}
                              >
                                <RadioGroupItem value="true" />
                              </RadioGroup>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    {/* Đáp án - Input */}
                    <div className="flex-1 min-w-0">
                      <FormField
                        control={form.control}
                        name={`choice_one_options.${index}.option`}
                        rules={{
                          required: 'Vui lòng nhập lựa chọn'
                        }}
                        render={({ field: inputField, fieldState: { error } }) => (
                          <FormItem>
                            <FormControl>
                              <div className="block w-full">
                                <CustomInput
                                  value={inputField.value || ''}
                                  onChange={(val: any) => {
                                    inputField.onChange(val)
                                    form.trigger('choice_one_options')
                                  }}
                                  className={`w-full bg-[#fdfdfb] text-[#2D3748] min-h-[40px] py-1.5 my-1 ${
                                    error || form.formState.errors.choice_one_options?.root
                                      ? 'border-red-500 focus:ring-red-500'
                                      : 'border-[#52aaa5] hover:border-[#52aaa5] focus:border-[#52aaa5] focus:ring-2 focus:ring-[#52aaa5]/20'
                                  }`}
                                />
                              </div>
                            </FormControl>
                            {/* removed option error message */}
                          </FormItem>
                        )}
                      />
                    </div>
                    {/* Nút xóa lựa chọn */}
                    {fields.length > 2 && (
                      <Button
                        type="button"
                        onClick={() => remove(index)}
                        className="flex items-center gap-2 px-3 h-[34px] text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded-lg my-1"
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

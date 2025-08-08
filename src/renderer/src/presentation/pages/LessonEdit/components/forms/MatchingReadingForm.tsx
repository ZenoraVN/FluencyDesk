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
import { Plus, Minus } from 'lucide-react'
import { CustomTextarea } from '../../../../../components/Input/CustomTextarea'
import { CustomInput } from '../../../../../components/Input/CustomInput'

export interface MatchingReadingFormData {
  matchings: Array<{
    question: string
    answer: string
    explain: string
  }>
}

interface MatchingReadingFormProps {
  initialData?: MatchingReadingFormData
}

export const MatchingReadingForm: FC<MatchingReadingFormProps> = ({ initialData }) => {
  const form = useFormContext<MatchingReadingFormData>()
  const initialized = useRef(false)

  const { fields, append, remove } = useFieldArray<MatchingReadingFormData>({
    control: form.control,
    name: 'matchings',
    rules: {
      required: 'Vui lòng thêm ít nhất một cặp ghép nối',
      validate: {
        atLeastTwo: (value: MatchingReadingFormData['matchings']) =>
          value && value.length >= 2 ? true : 'Phải có ít nhất 2 cặp ghép nối',
        maxTen: (value: MatchingReadingFormData['matchings']) =>
          value && value.length <= 10 ? true : 'Chỉ được tối đa 10 cặp ghép nối',
        noDuplicateContent: (value: MatchingReadingFormData['matchings']) => {
          if (!value) return true
          const clean = (val: string) =>
            (val || '')
              .replace(/<[^>]*>/g, '')
              .replace(/&nbsp;/g, ' ')
              .replace(/\s+/g, ' ')
              .trim()

          const questions = value.map((v) => clean(v.question))
          const answers = value.map((v) => clean(v.answer))
          const explains = value.map((v) =>
            (v.explain || '')
              .replace(/<p>|<\/p>|<br\s*\/?>/gi, '')
              .replace(/<[^>]*>/g, '')
              .replace(/&nbsp;/g, ' ')
              .replace(/\s+/g, ' ')
              .trim()
          )

          const hasDuplicates = (arr: string[]) => {
            const filtered = arr.filter((v) => v !== '')
            return filtered.length !== new Set(filtered).size
          }

          if (hasDuplicates(questions)) return 'Các câu hỏi không được trùng nhau'
          if (hasDuplicates(answers)) return 'Các đáp án không được trùng nhau'
          if (hasDuplicates(explains)) return 'Các giải thích không được trùng nhau'

          for (let i = 0; i < value.length; i++) {
            const q = clean(value[i].question)
            const a = clean(value[i].answer)
            const e = clean(value[i].explain)
            if (!q || !a || !e) continue
            if (q === a) return `Câu hỏi và đáp án trong cặp ${i + 1} không được giống nhau`
            if (q === e) return `Câu hỏi và giải thích trong cặp ${i + 1} không được giống nhau`
            if (a === e) return `Đáp án và giải thích trong cặp ${i + 1} không được giống nhau`
          }
          return true
        }
      }
    }
  })

  // Initialize with 2 default pairs if no initial data
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      const hasInitialPairs =
        initialData && Array.isArray(initialData.matchings) && initialData.matchings.length > 0
      if (!hasInitialPairs && fields.length === 0) {
        append([
          { question: '', answer: '', explain: '' },
          { question: '', answer: '', explain: '' }
        ])
      }
    }
  }, [initialData, fields.length, append])

  // Trigger validation on mount
  useEffect(() => {
    form.trigger(['matchings'])
  }, [])

  // Trigger validation when fields change
  useEffect(() => {
    if (fields.length > 0) {
      form.trigger('matchings')
    }
  }, [fields.length])

  return (
    <Form {...form}>
      <div className="space-y-6">
        {/* Matching Pairs Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-gray-200">
            <div>
              <h4 className="text-sm font-medium text-[#2D3748]">Các cặp ghép nối</h4>
              {form.formState.errors.matchings?.root && (
                <div className="text-sm text-red-500 mt-1">
                  {form.formState.errors.matchings.root.message}
                </div>
              )}
            </div>
            {fields.length < 10 && (
              <Button
                type="button"
                onClick={() => append({ question: '', answer: '', explain: '' })}
                className="flex items-center gap-2 px-4 py-1.5 text-sm bg-[#52aaa5]/10 text-[#52aaa5] hover:bg-[#52aaa5]/20 rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                Thêm cặp ghép nối
              </Button>
            )}
          </div>
          <div className="flex flex-col gap-4">
            {fields.map((field, index) => (
              <div key={field.id} className="relative rounded-lg border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h5 className="text-sm font-medium text-[#2D3748]">Cặp ghép nối {index + 1}</h5>
                  {fields.length > 2 && (
                    <Button
                      type="button"
                      onClick={() => remove(index)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded-lg"
                    >
                      <Minus className="h-4 w-4" />
                      Xóa
                    </Button>
                  )}
                </div>
                <div className="flex flex-col gap-4">
                  {/* Question */}
                  <FormField
                    control={form.control}
                    name={`matchings.${index}.question`}
                    rules={{
                      required: 'Vui lòng nhập câu hỏi',
                      validate: (value: string) => {
                        const plain = (value || '').replace(/<[^>]*>/g, '').trim()
                        if (!plain) return 'Vui lòng nhập câu hỏi'
                        return true
                      }
                    }}
                    render={({ field: qField }) => {
                      const plain = (qField.value || '').replace(/<[^>]*>/g, '').trim()
                      return (
                        <FormItem>
                          <FormLabel className="text-[#2D3748] font-medium">Câu hỏi</FormLabel>
                          <FormControl>
                            <CustomInput
                              value={qField.value || ''}
                              onChange={(val: any) => {
                                qField.onChange(val)
                                form.trigger('matchings')
                              }}
                              className={`w-full min-h-[40px] bg-transparent text-[#2D3748] py-1.5 my-1 ${
                                !plain
                                  ? 'border-red-500 focus:ring-red-500'
                                  : 'border-[#52aaa5] hover:border-[#52aaa5] focus:border-[#52aaa5] focus:ring-2 focus:ring-[#52aaa5]/20'
                              }`}
                            />
                          </FormControl>
                          {!plain && (
                            <div className="text-sm text-red-500 mt-1">Vui lòng nhập câu hỏi</div>
                          )}
                        </FormItem>
                      )
                    }}
                  />
                  {/* Answer */}
                  <FormField
                    control={form.control}
                    name={`matchings.${index}.answer`}
                    rules={{
                      required: 'Vui lòng nhập đáp án',
                      validate: (value: string) => {
                        const plain = (value || '').replace(/<[^>]*>/g, '').trim()
                        if (!plain) return 'Vui lòng nhập đáp án'
                        return true
                      }
                    }}
                    render={({ field: aField }) => {
                      const plain = (aField.value || '').replace(/<[^>]*>/g, '').trim()
                      return (
                        <FormItem>
                          <FormLabel className="text-[#2D3748] font-medium">Đáp án</FormLabel>
                          <FormControl>
                            <CustomInput
                              value={aField.value || ''}
                              onChange={(val: any) => {
                                aField.onChange(val)
                                form.trigger('matchings')
                              }}
                              className={`w-full min-h-[40px] bg-transparent text-[#2D3748] py-1.5 my-1 ${
                                !plain
                                  ? 'border-red-500 focus:ring-red-500'
                                  : 'border-[#52aaa5] hover:border-[#52aaa5] focus:border-[#52aaa5] focus:ring-2 focus:ring-[#52aaa5]/20'
                              }`}
                            />
                          </FormControl>
                          {!plain && (
                            <div className="text-sm text-red-500 mt-1">Vui lòng nhập đáp án</div>
                          )}
                        </FormItem>
                      )
                    }}
                  />
                  {/* Explanation */}
                  <FormField
                    control={form.control}
                    name={`matchings.${index}.explain`}
                    rules={{
                      required: 'Vui lòng nhập giải thích',
                      validate: (value: string) => {
                        const plain = (value || '')
                          .replace(/<p>|<\/p>|<br\s*\/?>/gi, '')
                          .replace(/<[^>]*>/g, '')
                          .replace(/&nbsp;/g, ' ')
                          .replace(/\s+/g, ' ')
                          .trim()
                        if (!plain) return 'Vui lòng nhập giải thích'
                        return true
                      }
                    }}
                    render={({ field: eField }) => {
                      const plain = (eField.value || '')
                        .replace(/<p>|<\/p>|<br\s*\/?>/gi, '')
                        .replace(/<[^>]*>/g, '')
                        .replace(/&nbsp;/g, ' ')
                        .replace(/\s+/g, ' ')
                        .trim()
                      return (
                        <FormItem className="mt-2">
                          <FormLabel className="text-[#2D3748] font-medium">Giải thích</FormLabel>
                          <FormControl>
                            <div className="mt-2">
                              <CustomTextarea
                                value={eField.value || ''}
                                onChange={eField.onChange}
                                className={
                                  !plain ? 'border-red-500 text-red-500' : 'hover:border-[#52aaaf]'
                                }
                              />
                            </div>
                          </FormControl>
                          {!plain && (
                            <div className="text-sm text-red-500 mt-1">
                              Vui lòng nhập giải thích
                            </div>
                          )}
                        </FormItem>
                      )
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Form>
  )
}

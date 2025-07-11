import { FC, useEffect, useRef } from 'react'
import {
  useFormContext,
  useFieldArray,
  ControllerRenderProps,
  ControllerFieldState,
  UseFormStateReturn
} from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../../../../../components/ui/form'
import { Button } from '../../../../../components/ui/button'
import { Plus, Minus } from 'lucide-react'
import { RichtextchtEditor } from '../../../../../components/Input/CustomRichtext'

export interface TrueFalseNotGivenFormData {
  true_false_not_givens: Array<{
    question: string
    answer: 'TRUE' | 'FALSE' | 'NOT_GIVEN'
    explain: string
  }>
}

interface TrueFalseNotGivenFormProps {
  initialData?: TrueFalseNotGivenFormData
}

type TrueFalseNotGivenFormPath =
  | `true_false_not_givens.${number}.question`
  | `true_false_not_givens.${number}.answer`
  | `true_false_not_givens.${number}.explain`

interface RenderProps<TName extends TrueFalseNotGivenFormPath = TrueFalseNotGivenFormPath> {
  field: ControllerRenderProps<TrueFalseNotGivenFormData, TName>
  fieldState: ControllerFieldState
  formState: UseFormStateReturn<TrueFalseNotGivenFormData>
}

const ANSWER_OPTIONS = [
  {
    value: 'TRUE',
    label: 'Đúng',
    color: 'bg-green-50 text-green-600 hover:bg-green-100'
  },
  {
    value: 'FALSE',
    label: 'Sai',
    color: 'bg-red-50 text-red-600 hover:bg-red-100'
  },
  {
    value: 'NOT_GIVEN',
    label: 'Không chắc chắn',
    color: 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
  }
] as const

export const TrueFalseNotGivenForm: FC<TrueFalseNotGivenFormProps> = ({
  initialData
}): JSX.Element => {
  const form = useFormContext<TrueFalseNotGivenFormData>()
  const initialized = useRef(false)

  const { fields, append, remove } = useFieldArray<TrueFalseNotGivenFormData>({
    control: form.control,
    name: 'true_false_not_givens',
    rules: {
      required: 'Vui lòng thêm ít nhất một câu hỏi',
      validate: {
        atLeastTwo: (value: Array<{ question: string; answer: string; explain: string }>) =>
          (value && value.length >= 2) || 'Phải có ít nhất 2 câu hỏi',
        maxTen: (value: Array<{ question: string; answer: string; explain: string }>) =>
          (value && value.length <= 10) || 'Chỉ được tối đa 10 câu hỏi',
        noDuplicates: (value: Array<{ question: string; answer: string; explain: string }>) => {
          if (!value) return true
          const questions = value.map((v) => v.question.trim())
          const uniqueQuestions = new Set(questions)
          return questions.length === uniqueQuestions.size || 'Các câu hỏi không được trùng nhau'
        },
        uniqueExplanations: (
          value: Array<{ question: string; answer: string; explain: string }>
        ) => {
          if (!value) return true
          const explanations = value.map((v) => v.explain?.trim()).filter(Boolean)
          return (
            explanations.length === new Set(explanations).size ||
            'Các giải thích không được trùng nhau'
          )
        }
      }
    }
  })

  // Initialize with 2 default questions if no initial data
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      const hasInitialQuestions =
        initialData &&
        Array.isArray(initialData.true_false_not_givens) &&
        initialData.true_false_not_givens.length > 0
      if (!hasInitialQuestions && fields.length === 0) {
        append([
          { question: '', answer: 'TRUE', explain: '' },
          { question: '', answer: 'TRUE', explain: '' }
        ])
      }
    }
  }, [initialData, fields.length, append])

  // Trigger initial validation
  useEffect(() => {
    form.trigger(['true_false_not_givens'])
  }, []) // Run only once on mount

  // Trigger validation when fields change
  useEffect(() => {
    if (fields.length > 0) {
      form.trigger('true_false_not_givens')
    }
  }, [fields.length]) // Run when number of fields changes

  return (
    <Form {...form}>
      <div className="space-y-6">
        {/* Questions Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-gray-200">
            <div>
              <h4 className="text-sm font-medium text-[#2D3748]">
                Các câu hỏi True/False/Not Given
              </h4>
              {form.formState.errors.true_false_not_givens?.root && (
                <div className="text-sm text-red-500 mt-1">
                  {form.formState.errors.true_false_not_givens.root.message}
                </div>
              )}
            </div>
            {fields.length < 10 && (
              <Button
                type="button"
                onClick={() => append({ question: '', answer: 'TRUE', explain: '' })}
                className="flex items-center gap-2 px-4 py-1.5 text-sm bg-[#52aaa5]/10 text-[#52aaa5] hover:bg-[#52aaa5]/20 rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                Thêm câu hỏi
              </Button>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {fields.map((field, index) => (
              <div key={field.id} className="relative rounded-lg border border-gray-100 p-4">
                <div className="flex justify-between items-center mb-4">
                  <h5 className="text-sm font-medium text-[#2D3748]">Câu hỏi {index + 1}</h5>
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

                <div className="space-y-4">
                  {/* Question */}
                  <FormField
                    control={form.control}
                    name={`true_false_not_givens.${index}.question`}
                    rules={{
                      required: 'Vui lòng nhập câu hỏi'
                    }}
                    render={({ field: questionField, fieldState: { error } }: RenderProps) => (
                      <FormItem>
                        <FormLabel className="text-[#2D3748] font-medium">Câu hỏi</FormLabel>
                        <FormControl>
                          <div className="mt-2">
                            <RichtextchtEditor
                              value={questionField.value || ''}
                              onChange={questionField.onChange}
                              className={error ? 'border-red-500' : ''}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Answer Buttons */}
                  <FormField
                    control={form.control}
                    name={`true_false_not_givens.${index}.answer`}
                    rules={{ required: 'Vui lòng chọn đáp án' }}
                    render={({ field: answerField }: RenderProps) => (
                      <FormItem>
                        <FormLabel className="text-[#2D3748] font-medium">Đáp án</FormLabel>
                        <div className="flex gap-3">
                          {ANSWER_OPTIONS.map((option) => (
                            <Button
                              key={option.value}
                              type="button"
                              onClick={() => answerField.onChange(option.value)}
                              className={`flex-1 ${option.color} ${
                                answerField.value === option.value
                                  ? 'ring-2 ring-offset-2 ring-current'
                                  : ''
                              }`}
                            >
                              {option.label}
                            </Button>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Explanation */}
                  <FormField
                    control={form.control}
                    name={`true_false_not_givens.${index}.explain`}
                    rules={{
                      required: 'Vui lòng nhập giải thích',
                      validate: (value: string) => {
                        if (!value?.trim()) return 'Vui lòng nhập giải thích'
                        return true
                      }
                    }}
                    render={({ field: explainField, fieldState: { error } }: RenderProps) => (
                      <FormItem>
                        <FormLabel className="text-[#2D3748] font-medium">Giải thích</FormLabel>
                        <FormControl>
                          <div className="mt-2">
                            <RichtextchtEditor
                              value={explainField.value || ''}
                              onChange={explainField.onChange}
                              className={error ? 'border-red-500' : ''}
                            />
                          </div>
                        </FormControl>
                        {error && <div className="text-sm text-red-500 mt-1">{error.message}</div>}
                      </FormItem>
                    )}
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

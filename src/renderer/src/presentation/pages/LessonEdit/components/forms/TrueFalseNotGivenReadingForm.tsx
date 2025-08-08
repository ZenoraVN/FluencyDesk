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
import { Plus, Trash } from 'lucide-react'
import { CustomTextarea } from '../../../../../components/Input/CustomTextarea'
import { CustomInput } from '../../../../../components/Input/CustomInput'
import CustomCombobox from '../../../../../components/Combobox/CustomCombobox'

export interface TrueFalseNotGivenReadingFormData {
  true_false_not_givens: Array<{
    question: string
    answer: 'TRUE' | 'FALSE' | 'NOT_GIVEN'
    explain: string
  }>
}

interface TrueFalseNotGivenReadingFormProps {
  initialData?: TrueFalseNotGivenReadingFormData
}

type TrueFalseNotGivenReadingFormPath =
  | `true_false_not_givens.${number}.question`
  | `true_false_not_givens.${number}.answer`
  | `true_false_not_givens.${number}.explain`

interface RenderProps<
  TName extends TrueFalseNotGivenReadingFormPath = TrueFalseNotGivenReadingFormPath
> {
  field: ControllerRenderProps<TrueFalseNotGivenReadingFormData, TName>
  fieldState: ControllerFieldState
  formState: UseFormStateReturn<TrueFalseNotGivenReadingFormData>
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

export const TrueFalseNotGivenReadingForm: FC<TrueFalseNotGivenReadingFormProps> = ({
  initialData
}): JSX.Element => {
  const form = useFormContext<TrueFalseNotGivenReadingFormData>()
  const initialized = useRef(false)

  const { fields, append, remove } = useFieldArray<TrueFalseNotGivenReadingFormData>({
    control: form.control,
    name: 'true_false_not_givens',
    rules: {
      required: 'Vui lòng thêm ít nhất một câu hỏi',
      validate: {
        atLeastTwo: (value: Array<{ question: string; answer: string; explain: string }>) =>
          (value && value.length >= 2) || 'Phải có ít nhất 2 câu hỏi',
        maxTen: (value: Array<{ question: string; answer: string; explain: string }>) =>
          (value && value.length <= 10) || 'Chỉ được tối đa 10 câu hỏi',

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
              <h4 className="text-sm font-medium text-[#2D3748]"></h4>
              {form.formState.errors.true_false_not_givens?.root && (
                <div className="text-sm text-red-500 mt-1">
                  {form.formState.errors.true_false_not_givens.root.message}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="relative rounded-lg border border-gray-100 border-b p-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <h5 className="text-sm font-medium text-[#2D3748]">Question {index + 1}</h5>
                  {fields.length > 2 && (
                    <Button
                      type="button"
                      onClick={() => remove(index)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded-lg"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Row 1: Question + Answer */}
                  <div className="flex flex-col sm:flex-row sm:gap-4">
                    <FormField
                      control={form.control}
                      name={`true_false_not_givens.${index}.question`}
                      rules={{ required: true }}
                      render={({ field: questionField }) => (
                        <FormItem className="flex-1">
                          <FormLabel className="text-[#2D3748] font-medium">Question</FormLabel>
                          <FormControl>
                            <CustomInput
                              value={questionField.value}
                              onChange={questionField.onChange}
                              placeholder="Enter question"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`true_false_not_givens.${index}.answer`}
                      rules={{ required: true }}
                      render={() => (
                        <FormItem className="w-full sm:w-1/3">
                          <FormLabel className="text-[#2D3748] font-medium">Answer</FormLabel>
                          <FormControl>
                            <CustomCombobox
                              label=""
                              value={form.getValues(`true_false_not_givens.${index}.answer`)}
                              options={ANSWER_OPTIONS.map((o) => ({
                                value: o.value,
                                label: o.label
                              }))}
                              onChange={(val: string | string[]) =>
                                form.setValue(`true_false_not_givens.${index}.answer`, val as any)
                              }
                              placeholder="Select answer"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* End Row 1 */}

                  {/* Row 2: Explanation */}
                  <FormField
                    control={form.control}
                    name={`true_false_not_givens.${index}.explain`}
                    rules={{ required: true }}
                    render={({ field: explainField }) => (
                      <FormItem>
                        <FormLabel className="text-[#2D3748] font-medium">Explanation</FormLabel>
                        <FormControl>
                          <CustomTextarea
                            value={explainField.value}
                            onChange={explainField.onChange}
                            placeholder="Enter explanation"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* End Row 2 */}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end pt-4">
            {fields.length < 10 && (
              <Button
                type="button"
                onClick={() => append({ question: '', answer: 'TRUE', explain: '' })}
                className="flex items-center gap-2 px-4 py-1.5 text-sm bg-[#52aaa5]/10 text-[#52aaa5] hover:bg-[#52aaa5]/20 rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Question
              </Button>
            )}
          </div>
        </div>
      </div>
    </Form>
  )
}

import { FC, useRef, useState, useEffect } from 'react'
import { useFormContext, useFieldArray } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '../../../../../components/ui/form'
import { Trash } from 'lucide-react'
import { Button } from '../../../../../components/ui/button'
import { GapFillView } from '../GapFillView'
import { CustomInput } from '../../../../../components/Input/CustomInput'

const HEX_COLORS = [
  '3E8E7E',
  'C44536',
  'F4A261',
  'E6B800',
  '7D5A50',
  '5D5C61',
  '8D6A9F',
  '70C1B3',
  'A98467',
  '2D4059'
]

export interface GapFillListeningAnswer {
  id: string // hex color id
  answer: string
  explain: string
}

export interface GapFillListeningFormData {
  fill_in_the_blank_question: {
    question: string
  }
  fill_in_the_blank_answers: GapFillListeningAnswer[]
}

interface GapFillListeningFormProps {
  initialData?: GapFillListeningFormData
}

export const GapFillListeningForm: FC<GapFillListeningFormProps> = ({
  initialData
}): JSX.Element => {
  const [selectedBlankId, setSelectedBlankId] = useState<string | null>(null)
  const [blankValidation] = useState<string | null>(null)
  const form = useFormContext<GapFillListeningFormData>()
  const questionInputRef = useRef<any>(null)
  const answerRefs = useRef<(HTMLDivElement | null)[]>([])

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'fill_in_the_blank_answers'
  })

  const answers = form.watch('fill_in_the_blank_answers') || []
  const question = form.watch('fill_in_the_blank_question.question') || ''

  // Validate blanks - disabled
  const validateBlanks = (): true => true

  // Handle blank selection
  const handleBlankClick = (hex: string) => {
    setSelectedBlankId(hex)
    const idx = answers.findIndex((a) => a.id === hex)
    if (idx >= 0 && answerRefs.current[idx]) {
      answerRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  // Remove blank from question and answers
  const handleBlankRemove = (hex: string) => {
    const current = form.getValues('fill_in_the_blank_question.question') || ''
    const doc = new DOMParser().parseFromString(current, 'text/html')
    const el = doc.querySelector(`span[data-blank-id="${hex}"]`)
    el?.parentNode?.removeChild(el)
    const html = doc.body.innerHTML
    form.setValue('fill_in_the_blank_question.question', html)

    const idx = answers.findIndex((a) => a.id === hex)
    if (idx >= 0) remove(idx)
  }

  // Subscription: sync manual typing of placeholders to answers
  useEffect(() => {
    const subscription = form.watch((value) => {
      const q = value.fill_in_the_blank_question?.question || ''
      const blanks = q.match(/\*\*\*([a-f0-9]{6})\*\*\*/g) || []
      const ids = blanks.map((b) => b.replace(/\*\*\*/g, ''))
      const currentAnswers = form.getValues('fill_in_the_blank_answers') as GapFillListeningAnswer[]
      ids.forEach((id) => {
        if (!currentAnswers.find((a) => a.id === id)) {
          append({ id, answer: '', explain: '' })
        }
      })
    })
    return () => subscription.unsubscribe()
  }, [form, append])

  // On load, preload from initial data if any
  useEffect(() => {
    if (initialData?.fill_in_the_blank_question?.question) {
      form.setValue(
        'fill_in_the_blank_question.question',
        initialData.fill_in_the_blank_question.question
      )
    }
    if (initialData?.fill_in_the_blank_answers?.length) {
      form.setValue('fill_in_the_blank_answers', initialData.fill_in_the_blank_answers)
    }
    // eslint-disable-next-line
  }, [initialData])

  // Scroll to answer on blank selection update
  useEffect(() => {
    if (selectedBlankId) {
      const idx = answers.findIndex((a) => a.id === selectedBlankId)
      if (idx >= 0 && answerRefs.current[idx]) {
        answerRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [selectedBlankId, answers.length])

  return (
    <Form {...form}>
      <div className="flex flex-row gap-8 w-full">
        {/* Left Panel: Question input & preview */}
        <div className="w-1/2 space-y-6">
          {/* Input Area */}
          <div className="space-y-4">
            <div className="rounded-lg overflow-hidden question-section">
              <FormField
                control={form.control}
                name="fill_in_the_blank_question.question"
                rules={{
                  required: 'Please enter the question',
                  validate: validateBlanks
                }}
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel className="text-[#2D3748] font-medium flex items-center gap-2">
                        Question
                      </FormLabel>
                      {/* blanks auto-insert on "***" */}
                    </div>
                    {/* Color palette: click to insert hex placeholder */}
                    <div className="flex gap-2 my-2 overflow-hidden whitespace-nowrap">
                      {HEX_COLORS.map((hex) => {
                        const used = question.includes(`***${hex}***`)
                        return (
                          <div
                            key={hex}
                            className={`inline-flex items-center justify-center px-2 py-1 text-xs text-white font-mono rounded-md border border-gray-200 cursor-pointer ${
                              used ? 'hidden' : ''
                            }`}
                            style={{ backgroundColor: `#${hex}` }}
                            onClick={() => {
                              const current =
                                form.getValues('fill_in_the_blank_question.question') || ''
                              if (!current.includes(`***${hex}***`)) {
                                const updated = current + `***${hex}***`
                                form.setValue('fill_in_the_blank_question.question', updated, {
                                  shouldValidate: true,
                                  shouldDirty: true
                                })
                                append({ id: hex, answer: '', explain: '' })
                                setTimeout(() => {
                                  form.trigger('fill_in_the_blank_question.question')
                                  form.trigger('fill_in_the_blank_answers')
                                }, 10)
                              }
                            }}
                          >
                            {hex}
                          </div>
                        )
                      })}
                    </div>
                    <FormControl>
                      <div className="mt-2">
                        <CustomInput
                          ref={questionInputRef}
                          value={field.value || ''}
                          onChange={(val: string) => {
                            field.onChange(val)
                            setTimeout(
                              () => form.trigger('fill_in_the_blank_question.question'),
                              10
                            )
                          }}
                          className={`bg-gray-50 ${
                            error ? 'border-red-500 text-red-500' : 'hover:border-[#52aaaf]'
                          }`}
                          min={true}
                          placeholder="Enter the question here (e.g., I heard a phrase with ***1a2b3c***)"
                        />
                      </div>
                    </FormControl>
                    {error && <div className="text-sm text-red-500 mt-1">{error?.message}</div>}
                    {blankValidation && (
                      <div className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded mt-2">
                        {blankValidation}
                      </div>
                    )}
                  </FormItem>
                )}
              />
            </div>

            {/* Preview Area */}
            <div className="rounded-lg">
              <div className="pb-3 flex items-center gap-2">
                <h4 className="text-sm font-medium text-[#2D3748]">Preview</h4>
              </div>
              <div className="p-4 border border-gray-200 rounded-b-lg min-h-[80px] hover:border-[#52aaaf] bg-gray-50">
                {question ? (
                  <GapFillView
                    content={question}
                    onBlankClick={handleBlankClick}
                    onBlankRemove={handleBlankRemove}
                    selectedBlankId={selectedBlankId}
                  />
                ) : (
                  <div className="flex items-center justify-center h-[60px] text-gray-400">
                    <span className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full animate-pulse"></div>
                      Enter a question above to preview
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Answers & Explanations */}
        <div className="w-1/2 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-sm font-medium text-[#2D3748]">Answers & Explanations</h4>
            </div>
            <div>
              {fields.length > 0 &&
                fields.map((field, index) => {
                  const answer = answers[index] || { id: '', answer: '', explain: '' }
                  const hexId = answer.id || ''
                  return (
                    <div
                      key={field.id}
                      ref={(el) => (answerRefs.current[index] = el)}
                      className="rounded-lg transition-all space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{index + 1}. </span>
                          <span
                            className="text-xs px-1.5 py-0.5 rounded-md border text-white"
                            style={{ backgroundColor: `#${hexId}` }}
                          >
                            #{hexId}
                          </span>
                        </div>
                        <Button
                          type="button"
                          onClick={() => remove(index)}
                          variant="ghost"
                          size="icon"
                          className="text-gray-500 hover:text-red-600"
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                      {/* Answer */}
                      <FormField
                        control={form.control}
                        name={`fill_in_the_blank_answers.${index}.answer`}
                        rules={{
                          required: 'Please enter an answer',
                          validate: (value: string) => {
                            const plain = (value || '').trim()
                            if (!plain) return 'Please enter an answer'
                            return true
                          }
                        }}
                        render={({ field: ansField }) => {
                          const plain = (ansField.value || '').trim()
                          return (
                            <FormItem>
                              <FormLabel className="text-[#2D3748] font-medium">Answer</FormLabel>
                              <FormControl>
                                <div className="mt-2">
                                  <CustomInput
                                    value={ansField.value || ''}
                                    onChange={(val: string) => {
                                      ansField.onChange(val)
                                      form.trigger(`fill_in_the_blank_answers.${index}.answer`)
                                    }}
                                    className={`bg-gray-50 ${
                                      !plain
                                        ? 'border-red-500 text-red-500'
                                        : 'hover:border-[#52aaaf]'
                                    }`}
                                    placeholder="Enter answer here"
                                    min={true}
                                  />
                                </div>
                              </FormControl>
                            </FormItem>
                          )
                        }}
                      />
                      {/* Explanation */}
                      <FormField
                        control={form.control}
                        name={`fill_in_the_blank_answers.${index}.explain`}
                        rules={{
                          required: 'Please enter an explanation',
                          validate: {
                            notEmpty: (value: string) => {
                              const plain = (value || '').trim()
                              return !plain ? 'Please enter an explanation' : true
                            },
                            unique: (value: string) => {
                              const plain = (value || '').trim()
                              if (!plain) return true
                              const allExplanations = form
                                .getValues('fill_in_the_blank_answers')
                                .map((a: GapFillListeningAnswer) => (a.explain || '').trim())
                                .filter((_, i) => i !== index)
                              return (
                                !allExplanations.includes(plain) ||
                                'Explanation must not duplicate other answers'
                              )
                            }
                          }
                        }}
                        render={({ field: expField }) => {
                          const plain = (expField.value || '').trim()
                          return (
                            <FormItem>
                              <FormLabel className="text-[#2D3748] font-medium">
                                Explanation
                              </FormLabel>
                              <FormControl>
                                <div className="mt-2">
                                  <CustomInput
                                    value={expField.value || ''}
                                    onChange={(val: string) => {
                                      expField.onChange(val)
                                      form.trigger(`fill_in_the_blank_answers.${index}.explain`)
                                    }}
                                    className={`bg-gray-50 ${
                                      !plain ? 'border-red-500 text-red-500' : ''
                                    }`}
                                    placeholder="Enter explanation here"
                                    min={true}
                                  />
                                </div>
                              </FormControl>
                            </FormItem>
                          )
                        }}
                      />
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      </div>
    </Form>
  )
}

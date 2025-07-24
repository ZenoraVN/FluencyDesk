import { FC, useRef, useState, useEffect } from 'react'
import { useFormContext, useFieldArray } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '../../../../../components/ui/form'
import { Button } from '../../../../../components/ui/button'
import { RichtextFillInBlankView } from '../RichtextFillInBlankView'
import { CustomInput } from '../../../../../components/Input/CustomInput'

const HEX_COLORS = (() => {
  const colors = new Set<string>()
  while (colors.size < 100) {
    const color = Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, '0')
    colors.add(color)
  }
  return Array.from(colors)
})()

export interface GapFillReadingAnswer {
  id: string // hex color id
  answer: string
  explain: string
}

export interface GapFillReadingFormData {
  fill_in_the_blank_question: {
    question: string
  }
  fill_in_the_blank_answers: GapFillReadingAnswer[]
}

interface GapFillReadingFormProps {
  initialData?: GapFillReadingFormData
}

export const GapFillReadingForm: FC<GapFillReadingFormProps> = ({ initialData }): JSX.Element => {
  const [selectedBlankId, setSelectedBlankId] = useState<string | null>(null)
  const [blankValidation, setBlankValidation] = useState<string | null>(null)
  const form = useFormContext<GapFillReadingFormData>()
  const questionInputRef = useRef<any>(null)
  const answerRefs = useRef<(HTMLDivElement | null)[]>([])

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: 'fill_in_the_blank_answers'
  })

  const answers = form.watch('fill_in_the_blank_answers') || []
  const question = form.watch('fill_in_the_blank_question.question') || ''

  // Validate blanks - improved with state
  const validateBlanks = (question: string) => {
    const blanks = question.match(/\*\*\*([a-f0-9]{6})\*\*\*/g) || []
    if (blanks.length === 0) {
      const msg = 'The question must have at least one blank (***1a2b3c***)'
      setBlankValidation(msg)
      return msg
    }
    const blankIds = blanks.map((b) => b.replace(/\*\*\*/g, ''))
    const answerIds = answers.map((a) => a.id)

    const missingInQuestion = answerIds.filter((id) => !blankIds.includes(id))
    const missingInAnswers = blankIds.filter((id) => !answerIds.includes(id))
    if (missingInQuestion.length || missingInAnswers.length) {
      const parts = []
      if (missingInQuestion.length) {
        parts.push(`Answers exist for missing blanks: ${missingInQuestion.join(', ')}`)
      }
      if (missingInAnswers.length) {
        parts.push(`Blanks exist without answers: ${missingInAnswers.join(', ')}`)
      }
      const msg = parts.join('. ')
      setBlankValidation(msg)
      return msg
    }

    setBlankValidation(null)
    return true
  }

  // Get next unused hex across question and answers
  const getNextAvailableHex = (): string => {
    const questionContent = form.getValues('fill_in_the_blank_question.question') || ''
    const usedInQ = [...questionContent.matchAll(/\*\*\*([a-f0-9]{6})\*\*\*/g)].map((m) => m[1])
    const usedInA = answers.map((a) => a.id)
    const used = new Set([...usedInQ, ...usedInA])
    return HEX_COLORS.find((c) => !used.has(c)) || HEX_COLORS[0]
  }

  // Insert blank placeholder at cursor with styled span
  const insertBlankAtCursor = () => {
    const selection = window.getSelection()
    if (!selection || !questionInputRef.current) return

    const hex = getNextAvailableHex()
    const span = document.createElement('span')
    span.className = 'blank-placeholder'
    span.style.backgroundColor = `#${hex}33`
    span.style.border = `1px dashed #${hex}`
    span.style.padding = '2px 4px'
    span.style.borderRadius = '4px'
    span.style.margin = '0 2px'
    span.textContent = '___'
    span.dataset.blankId = hex

    const range = selection.getRangeAt(0)
    range.deleteContents()
    range.insertNode(span)

    const newValue = questionInputRef.current.innerHTML
    form.setValue('fill_in_the_blank_question.question', newValue)

    if (!answers.find((a) => a.id === hex)) {
      append({ id: hex, answer: '', explain: '' })
    }

    setTimeout(() => form.trigger('fill_in_the_blank_question.question'), 10)
  }

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

  // Sync answers with blanks using form.watch
  useEffect(() => {
    const sub = form.watch((value) => {
      const q = value.fill_in_the_blank_question?.question || ''
      const answersData = (value.fill_in_the_blank_answers ?? []) as GapFillReadingAnswer[]
      const blanks = q.match(/\*\*\*([a-f0-9]{6})\*\*\*/g) || []
      const ids = blanks.map((b) => b.replace(/\*\*\*/g, ''))
      // add missing answer entries
      ids.forEach((id) => {
        if (!answersData.find((a) => a.id === id)) {
          append({ id, answer: '', explain: '' })
        }
      })
      // remove orphaned answers
      answersData.forEach((a, i) => {
        if (!ids.includes(a.id)) {
          remove(i)
        }
      })
    })
    return () => sub.unsubscribe()
  }, [form, append, remove])

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
                      <Button
                        type="button"
                        onClick={insertBlankAtCursor}
                        className="flex items-center gap-1 text-sm"
                      >
                        <PlusIcon className="w-4 h-4" />
                        Add Blank
                      </Button>
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
                          placeholder="Enter the question here (e.g., The capital of France is ***1a2b3c***)"
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
              <div className="p-4 border border-gray-200 rounded-b-lg min-h-[80px] hover:border-[#52aaaf] rounded-lg bg-gray-50">
                {question ? (
                  <RichtextFillInBlankView
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
            <div className="space-y-4">
              {fields.length > 0 &&
                fields.map((field, index) => {
                  const answer = answers[index] || { id: '', answer: '', explain: '' }
                  const hexId = answer.id || ''
                  const isSelected = selectedBlankId === hexId
                  const bgColor = `#${hexId}33`
                  return (
                    <div
                      key={field.id}
                      ref={(el) => (answerRefs.current[index] = el)}
                      className={`p-4 rounded-lg transition-all border ${
                        isSelected
                          ? 'border-blue-300 shadow-sm'
                          : 'border-gray-200 hover:border-[#52aaaf] hover:shadow-sm'
                      }`}
                      style={{ backgroundColor: bgColor }}
                    >
                      <div className="mb-2 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-[#2D3748]">
                            Answer {index + 1}
                          </span>
                          <span
                            className="text-xs px-1.5 py-0.5 rounded border"
                            style={{
                              backgroundColor: `#${hexId}22`,
                              borderColor: `#${hexId}`
                            }}
                          >
                            #{hexId}
                          </span>
                        </div>
                        <Button
                          type="button"
                          onClick={() => remove(index)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          Delete
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
                        render={({ field: ansField, fieldState: { error } }) => {
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
                                    className={`bg-gray-50 ${!plain ? 'border-red-500 text-red-500' : 'hover:border-[#52aaaf]'}`}
                                    placeholder="Enter answer here"
                                    min={true}
                                  />
                                </div>
                              </FormControl>
                              {!plain && error && (
                                <div className="text-sm text-red-500 mt-1">{error.message}</div>
                              )}
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
                                .map((a: GapFillReadingAnswer) => (a.explain || '').trim())
                                .filter((_, i) => i !== index)
                              return (
                                !allExplanations.includes(plain) ||
                                'Explanation must not duplicate other answers'
                              )
                            }
                          }
                        }}
                        render={({ field: expField, fieldState: { error } }) => {
                          const plain = (expField.value || '').trim()
                          return (
                            <FormItem className="mt-6 pt-4 border-t border-gray-100">
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
                                    className={`bg-gray-50 ${!plain ? 'border-red-500 text-red-500' : ''}`}
                                    placeholder="Enter explanation here"
                                    min={true}
                                  />
                                </div>
                              </FormControl>
                              {!plain && error && (
                                <div className="text-sm text-red-500 mt-1">{error.message}</div>
                              )}
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

// PlusIcon component
const PlusIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className={className}
  >
    <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

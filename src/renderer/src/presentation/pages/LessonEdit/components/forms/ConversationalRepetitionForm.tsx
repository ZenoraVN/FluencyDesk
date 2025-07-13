import { FC, useEffect, useRef } from 'react'
import { useFormContext, useFieldArray } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../../../../../components/ui/form'
import { Input } from '../../../../../components/ui/input'
import { Button } from '../../../../../components/ui/button'
import { Plus, Minus } from 'lucide-react'

export interface ConversationalRepetitionFormData {
  conversational_repetition: {
    title: string
    overview: string
  }
  conversational_repetition_qa: Array<{
    question: string
    answer: string
    mean_of_question: string
    mean_of_answer: string
  }>
}

interface ConversationalRepetitionFormProps {
  initialData?: ConversationalRepetitionFormData
}

export const ConversationalRepetitionForm: FC<ConversationalRepetitionFormProps> = ({
  initialData
}): JSX.Element => {
  const form = useFormContext<ConversationalRepetitionFormData>()
  const initialized = useRef(false)

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'conversational_repetition_qa',
    rules: {
      required: 'Vui lòng thêm ít nhất một cặp hội thoại'
    }
  })

  // Initialize with default data if no initial data
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      const hasInitialItems =
        initialData?.conversational_repetition_qa &&
        initialData.conversational_repetition_qa.length > 0

      if (!hasInitialItems && fields.length === 0) {
        append({
          question: '',
          answer: '',
          mean_of_question: '',
          mean_of_answer: ''
        })
      }
    }
  }, [initialData, fields.length, append])

  // Trigger initial validation
  useEffect(() => {
    form.trigger(['conversational_repetition', 'conversational_repetition_qa'])
  }, []) // Run only once on mount

  return (
    <Form {...form}>
      <div className="space-y-6">
        {/* Overview Section */}
        <div className="rounded-lg">
          <h4 className="text-sm font-medium text-[#2D3748] mb-4">Thông tin hội thoại</h4>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="conversational_repetition.title"
              rules={{ required: 'Vui lòng nhập tiêu đề' }}
              render={({ field, fieldState: { error } }) => (
                <FormItem>
                  <FormLabel className="text-[#2D3748] font-medium">Tiêu đề</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Nhập tiêu đề hội thoại"
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

            <FormField
              control={form.control}
              name="conversational_repetition.overview"
              rules={{ required: 'Vui lòng nhập tổng quan' }}
              render={({ field, fieldState: { error } }) => (
                <FormItem>
                  <FormLabel className="text-[#2D3748] font-medium">Tổng quan</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      placeholder="Nhập tổng quan..."
                      className={`w-full min-h-[100px] p-3 rounded-lg bg-transparent text-[#2D3748] placeholder:text-[#718096] outline-none border resize-none overflow-hidden ${
                        error
                          ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                          : 'border-[#52aaa5] hover:border-[#52aaa5] focus:border-[#52aaa5] focus:ring-2 focus:ring-[#52aaa5]/20'
                      }`}
                      onInput={(e) => {
                        const textarea = e.target as HTMLTextAreaElement
                        textarea.style.height = 'auto'
                        textarea.style.height = `${textarea.scrollHeight}px`
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Question-Answer Pairs Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-gray-200">
            <div>
              <h4 className="text-sm font-medium text-[#2D3748]">Các cặp hội thoại</h4>
              {form.formState.errors.conversational_repetition_qa?.root && (
                <div className="text-sm text-red-500 mt-1">
                  {form.formState.errors.conversational_repetition_qa.root.message}
                </div>
              )}
            </div>
            <Button
              type="button"
              onClick={() =>
                append({
                  question: '',
                  answer: '',
                  mean_of_question: '',
                  mean_of_answer: ''
                })
              }
              className="flex items-center gap-2 px-4 py-1.5 text-sm bg-[#52aaa5]/10 text-[#52aaa5] hover:bg-[#52aaa5]/20 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              Thêm cặp hội thoại
            </Button>
          </div>

          <div className="flex flex-col gap-4">
            {fields.map((field, index) => (
              <div key={field.id} className="relative rounded-lg  shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h5 className="text-sm font-medium text-[#2D3748]">Cặp hội thoại {index + 1}</h5>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => remove(index)}
                      className="flex items-center gap-2 px-3 h-[34px] text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded-lg my-1"
                    >
                      <Minus className="h-4 w-4" />
                      Xóa
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Left Column - Question */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 rounded-lg border border-[#52aaa5]/20 ">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#52aaa5]/20 flex items-center justify-center text-[#52aaa5]">
                        <span className="text-sm font-medium text-[#52aaa5]">Q</span>
                      </div>
                      <div className="flex-1 space-y-3">
                        <FormField
                          control={form.control}
                          name={`conversational_repetition_qa.${index}.question`}
                          rules={{ required: 'Vui lòng nhập câu hỏi' }}
                          render={({ field, fieldState: { error } }) => (
                            <FormItem>
                              <FormLabel className="text-[#2D3748] font-medium">Câu hỏi</FormLabel>
                              <FormControl>
                                <textarea
                                  {...field}
                                  placeholder="Nhập câu hỏi"
                                  className={`w-full min-h-[40px] p-3 rounded-lg bg-transparent text-[#2D3748] placeholder:text-[#718096] outline-none border resize-none overflow-hidden ${
                                    error
                                      ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                                      : 'border-[#52aaa5] hover:border-[#52aaa5] focus:border-[#52aaa5] focus:ring-2 focus:ring-[#52aaa5]/20'
                                  }`}
                                  onInput={(e) => {
                                    const target = e.target as HTMLTextAreaElement
                                    target.style.height = 'auto'
                                    target.style.height = target.scrollHeight + 'px'
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`conversational_repetition_qa.${index}.mean_of_question`}
                          rules={{ required: 'Vui lòng nhập nghĩa câu hỏi' }}
                          render={({ field, fieldState: { error } }) => (
                            <FormItem>
                              <FormLabel className="text-[#2D3748] font-medium">
                                Nghĩa câu hỏi
                              </FormLabel>
                              <FormControl>
                                <textarea
                                  {...field}
                                  placeholder="Nhập nghĩa tiếng Việt của câu hỏi"
                                  className={`w-full min-h-[40px] px-3 py-2 rounded-md resize-none overflow-hidden bg-transparent text-[#2D3748] border ${
                                    error
                                      ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                                      : 'border-[#52aaa5] hover:border-[#52aaa5] focus:border-[#52aaa5] focus:ring-2 focus:ring-[#52aaa5]/20'
                                  }`}
                                  onInput={(e) => {
                                    const target = e.target as HTMLTextAreaElement
                                    target.style.height = 'auto'
                                    target.style.height = target.scrollHeight + 'px'
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Answer */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 rounded-lg border border-[#52aaa5]/20 ">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#52aaa5]/20 flex items-center justify-center text-[#52aaa5]">
                        <span className="text-sm font-medium text-[#52aaa5]">A</span>
                      </div>
                      <div className="flex-1 space-y-3">
                        <FormField
                          control={form.control}
                          name={`conversational_repetition_qa.${index}.answer`}
                          rules={{ required: 'Vui lòng nhập câu trả lời' }}
                          render={({ field, fieldState: { error } }) => (
                            <FormItem>
                              <FormLabel className="text-[#2D3748] font-medium">
                                Câu trả lời
                              </FormLabel>
                              <FormControl>
                                <textarea
                                  {...field}
                                  placeholder="Nhập câu trả lời"
                                  className={`w-full min-h-[40px] p-3 rounded-lg resize-none overflow-hidden bg-transparent text-[#2D3748] placeholder:text-[#718096] outline-none border ${
                                    error
                                      ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                                      : 'border-[#52aaa5] hover:border-[#52aaa5] focus:border-[#52aaa5] focus:ring-2 focus:ring-[#52aaa5]/20'
                                  }`}
                                  onInput={(e) => {
                                    const target = e.target as HTMLTextAreaElement
                                    target.style.height = 'auto'
                                    target.style.height = target.scrollHeight + 'px'
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`conversational_repetition_qa.${index}.mean_of_answer`}
                          rules={{ required: 'Vui lòng nhập nghĩa câu trả lời' }}
                          render={({ field, fieldState: { error } }) => (
                            <FormItem>
                              <FormLabel className="text-[#2D3748] font-medium">
                                Nghĩa câu trả lời
                              </FormLabel>
                              <FormControl>
                                <textarea
                                  {...field}
                                  placeholder="Nhập nghĩa tiếng Việt của câu trả lời"
                                  className={`w-full min-h-[40px] px-3 py-2 rounded-md resize-none overflow-hidden bg-transparent text-[#2D3748] border ${
                                    error
                                      ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                                      : 'border-[#52aaa5] hover:border-[#52aaa5] focus:border-[#52aaa5] focus:ring-2 focus:ring-[#52aaa5]/20'
                                  }`}
                                  onInput={(e) => {
                                    const target = e.target as HTMLTextAreaElement
                                    target.style.height = 'auto'
                                    target.style.height = target.scrollHeight + 'px'
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Form>
  )
}

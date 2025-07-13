import { FC, useState, useRef, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '../../../../../components/ui/form'
import { CustomInput } from '../../../../../components/Input/CustomInput'
import type { SkillType, QuestionType, LevelType } from '../../types/questionDetail'

export interface BaseQuestionFormData {
  skill: SkillType
  type: QuestionType
  topic: string[]
  tags: string[]
  level: LevelType
  score: number
  instruction: string
}

export interface BaseQuestionFormProps {
  skill: SkillType
  type: QuestionType
  defaultValues?: BaseQuestionFormData
}

export const BaseQuestionForm: FC<BaseQuestionFormProps> = ({}) => {
  const form = useFormContext<BaseQuestionFormData>()

  // Force show validation on mount
  useEffect(() => {
    form.setValue('topic', [], { shouldValidate: true })
    form.setValue('tags', [], { shouldValidate: true })
    form.setValue('instruction', '', { shouldValidate: true })
  }, [])

  const [, setShowTopicSuggestions] = useState(false)
  const [, setShowTagSuggestions] = useState(false)
  const topicInputRef = useRef<HTMLDivElement>(null)
  const tagInputRef = useRef<HTMLDivElement>(null)

  // Handle click outside suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (topicInputRef.current && !topicInputRef.current.contains(event.target as Node)) {
        setShowTopicSuggestions(false)
      }
      if (tagInputRef.current && !tagInputRef.current.contains(event.target as Node)) {
        setShowTagSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <Form {...form}>
      <div className="rounded-lg">
        <FormField
          control={form.control}
          name="instruction"
          rules={{
            validate: (value) => {
              // Consider empty if value has no characters after removing p, br, tag
              const plain = (value || '').replace(/<p>|<\/p>|<br\s*\/?>/gi, '').trim()
              if (!plain) return 'Vui lòng nhập tổng quan cho câu hỏi'
              const wordCount = plain.split(/\s+/).length
              if (wordCount > 1000) return 'Tổng quan không được vượt quá 1000 từ'
              return true
            }
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#2D3748] font-medium">Hướng dẫn</FormLabel>
              <FormControl>
                <div className="mt-2">
                  <CustomInput
                    value={field.value || ''}
                    onChange={field.onChange}
                    className={
                      !(field.value || '').trim()
                        ? 'border-red-500 text-red-500'
                        : 'hover:border-[#52aaaf]'
                    }
                    placeholder="Nhập hướng dẫn cho câu hỏi"
                    style={{ minHeight: 40, borderRadius: 8 }}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </Form>
  )
}

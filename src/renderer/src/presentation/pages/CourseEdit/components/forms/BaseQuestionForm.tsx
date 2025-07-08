import { FC, useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '../../../../../components/ui/form'
import { RichtextchtEditor } from '../../../../../components/Input/CustomRichtext'
import { CustomInput } from '../../../../../components/Input/CustomInput'

// Types
export type SkillType = 'listening' | 'reading' | 'grammar' | 'speaking' | 'writing'

export type QuestionType =
  | 'fill_in_the_blank'
  | 'choice_one'
  | 'choice_multi'
  | 'matching'
  | 'true_false_not_given'
  | 'error_identification'
  | 'sentence_completion'
  | 'word_repetition'
  | 'phrase_repetition'
  | 'conversational_repetition'
  | 'open_conversation'
  | 'open_paragraph'

export type LevelType = 'beginner' | 'intermediate' | 'advanced'

export interface SkillInfo {
  label: string
  description: string
}

export interface QuestionTypeInfo {
  label: string
  overview: string
}

export interface LevelInfo {
  value: LevelType
  label: string
  color: string
}

// Constants
export const SKILLS: Record<SkillType, SkillInfo> = {
  listening: { label: 'Listening', description: 'Luyện tập kỹ năng nghe hiểu' },
  reading: { label: 'Reading', description: 'Luyện tập kỹ năng đọc hiểu' },
  grammar: { label: 'Grammar', description: 'Luyện tập ngữ pháp' },
  speaking: { label: 'Speaking', description: 'Luyện tập kỹ năng nói' },
  writing: { label: 'Writing', description: 'Luyện tập kỹ năng viết' }
}

export const QUESTION_TYPES: Record<QuestionType, QuestionTypeInfo> = {
  fill_in_the_blank: {
    label: 'Fill in the blank',
    overview: 'Điền từ thích hợp vào chỗ trống để hoàn thành câu'
  },
  choice_one: {
    label: 'Single choice',
    overview: 'Chọn một đáp án đúng từ nhiều lựa chọn'
  },
  choice_multi: {
    label: 'Multiple choice',
    overview: 'Chọn nhiều đáp án đúng từ các lựa chọn'
  },
  matching: {
    label: 'Matching',
    overview: 'Ghép nối các cặp thông tin tương ứng'
  },
  true_false_not_given: {
    label: 'True/False/Not Given',
    overview: 'Xác định tính đúng sai của câu dựa trên thông tin cho trước'
  },
  error_identification: {
    label: 'Error Identification',
    overview: 'Xác định lỗi ngữ pháp trong câu'
  },
  sentence_completion: {
    label: 'Sentence Completion',
    overview: 'Hoàn thành câu với cấu trúc phù hợp'
  },
  word_repetition: {
    label: 'Word Repetition',
    overview: 'Lặp lại từ theo phát âm chuẩn'
  },
  phrase_repetition: {
    label: 'Phrase Repetition',
    overview: 'Lặp lại cụm từ theo phát âm chuẩn'
  },
  conversational_repetition: {
    label: 'Conversation Repetition',
    overview: 'Lặp lại đoạn hội thoại theo phát âm chuẩn'
  },
  open_conversation: {
    label: 'Open Conversation',
    overview: 'Thực hành hội thoại tự do về chủ đề cho trước'
  },
  open_paragraph: {
    label: 'Open Paragraph',
    overview: 'Viết đoạn văn về chủ đề cho trước'
  }
}

export const LEVELS: LevelInfo[] = [
  { value: 'beginner', label: 'Cơ bản', color: '#FF6B6B' },
  { value: 'intermediate', label: 'Trung cấp', color: '#4ECDC4' },
  { value: 'advanced', label: 'Nâng cao', color: '#45B7D1' }
]

const SUGGESTED_TOPICS = [
  'Vocabulary',
  'Grammar',
  'Pronunciation',
  'Business English',
  'Academic Writing',
  'IELTS Speaking',
  'TOEIC Listening',
  'Daily Conversation',
  'Job Interview',
  'Travel English',
  'Social Media',
  'Technology',
  'Environment',
  'Education',
  'Health and Fitness',
  'Food and Cooking',
  'Entertainment'
]

const SUGGESTED_TAGS = [
  'IELTS',
  'TOEIC',
  'Business',
  'Academic',
  'General',
  'Kids',
  'Teens',
  'Adults',
  'Conversation',
  'Exam',
  'Grammar',
  'Vocabulary',
  'Pronunciation',
  'Writing',
  'Speaking',
  'Listening',
  'Reading'
]

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

export const BaseQuestionForm: FC<BaseQuestionFormProps> = ({ skill, type }) => {
  const form = useFormContext<BaseQuestionFormData>()

  // Force show validation on mount
  useEffect(() => {
    form.setValue('topic', [], { shouldValidate: true })
    form.setValue('tags', [], { shouldValidate: true })
    form.setValue('instruction', '', { shouldValidate: true })
  }, [])

  // State declarations
  const [topicColors, setTopicColors] = useState<Record<string, { bg: string; text: string }>>({})
  const [tagColors, setTagColors] = useState<Record<string, { bg: string; text: string }>>({})
  const [topicInput, setTopicInput] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [showTopicSuggestions, setShowTopicSuggestions] = useState(false)
  const [showTagSuggestions, setShowTagSuggestions] = useState(false)
  const topicInputRef = useRef<HTMLDivElement>(null)
  const tagInputRef = useRef<HTMLDivElement>(null)

  // Watch form values
  const topics = form.watch('topic') || []
  const tags = form.watch('tags') || []

  // Memoize derived values
  const currentTopics = useMemo(() => topics, [topics])
  const currentTags = useMemo(() => tags, [tags])

  const filteredTopics = useMemo(
    () =>
      SUGGESTED_TOPICS.filter(
        (topic) =>
          topic.toLowerCase().includes(topicInput.toLowerCase()) && !currentTopics.includes(topic)
      ),
    [topicInput, currentTopics]
  )

  const filteredTags = useMemo(
    () =>
      SUGGESTED_TAGS.filter(
        (tag) => tag.toLowerCase().includes(tagInput.toLowerCase()) && !currentTags.includes(tag)
      ),
    [tagInput, currentTags]
  )

  const generateColor = useCallback((key: string) => {
    const hue = Math.abs(key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 360
    return {
      bg: `hsla(${hue}, 85%, 97%, 1)`,
      text: `hsla(${hue}, 85%, 35%, 1)`
    }
  }, [])

  // Memoize form handlers
  const handleAddTopic = useCallback(
    (topic: string): void => {
      const trimmedTopic = topic.trim()
      if (trimmedTopic && !currentTopics.includes(trimmedTopic)) {
        if (!topicColors[trimmedTopic]) {
          setTopicColors((prev) => ({
            ...prev,
            [trimmedTopic]: generateColor(trimmedTopic)
          }))
        }
        form.setValue('topic', [...currentTopics, trimmedTopic])
        setTopicInput('')
        setShowTopicSuggestions(false)
      }
    },
    [form, currentTopics, topicColors, generateColor]
  )

  const handleAddTag = useCallback(
    (tag: string) => {
      const trimmedTag = tag.trim()
      if (trimmedTag && !currentTags.includes(trimmedTag)) {
        if (!tagColors[trimmedTag]) {
          setTagColors((prev) => ({
            ...prev,
            [trimmedTag]: generateColor(trimmedTag)
          }))
        }
        form.setValue('tags', [...currentTags, trimmedTag])
        setTagInput('')
        setShowTagSuggestions(false)
      }
    },
    [form, currentTags, tagColors, generateColor]
  )

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

  const handleTopicKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTopic(topicInput)
    }
  }

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag(tagInput)
    }
  }

  const handleRemoveTopic = useCallback(
    (topicToRemove: string) => {
      const topics = form.getValues('topic')
      form.setValue(
        'topic',
        topics.filter((t: string) => t !== topicToRemove)
      )
    },
    [form]
  )

  const handleRemoveTag = useCallback(
    (tagToRemove: string) => {
      const tags = form.getValues('tags')
      form.setValue(
        'tags',
        tags.filter((t: string) => t !== tagToRemove)
      )
    },
    [form]
  )

  const skillInfo = SKILLS[skill]
  const typeInfo = QUESTION_TYPES[type]

  return (
    <Form {...form}>
      <div className="rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#2D3748]">Thông tin cơ bản</h3>
        </div>

        <div className="space-y-6">
          {/* Skill and Type Info */}
          <div className="grid grid-cols-2 gap-4">
            {/* Skill Info */}
            <div className="p-5 rounded-lg border border-gray-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#52aaa5]/10 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-[#52aaa5]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <FormLabel className="text-[#2D3748] font-semibold block mb-1">Kỹ năng</FormLabel>
                  <div className="text-lg font-medium text-[#52aaa5] mb-1">{skillInfo.label}</div>
                  <div className="text-sm text-[#718096] leading-relaxed">
                    {skillInfo.description}
                  </div>
                </div>
              </div>
            </div>

            {/* Type Info */}
            <div className="p-5 rounded-lg border border-gray-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#52aaa5]/10 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-[#52aaa5]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </div>
                <div className="flex-1">
                  <FormLabel className="text-[#2D3748] font-semibold block mb-1">
                    Dạng câu hỏi
                  </FormLabel>
                  <div className="text-lg font-medium text-[#52aaa5] mb-1">{typeInfo.label}</div>
                  <div className="text-sm text-[#718096] leading-relaxed">{typeInfo.overview}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Level */}
          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#2D3748] font-medium">Độ khó</FormLabel>
                <div className="flex gap-2 mt-2">
                  {LEVELS.map((level) => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => field.onChange(level.value)}
                      className={`flex-1 px-4 py-2 rounded-xl transition-colors ${
                        field.value === level.value ? 'text-white' : 'hover:bg-opacity-20'
                      }`}
                      style={{
                        backgroundColor:
                          field.value === level.value ? level.color : `${level.color}20`,
                        color: field.value === level.value ? 'white' : level.color
                      }}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </FormItem>
            )}
          />

          {/* Topics */}
          <FormField
            control={form.control}
            name="topic"
            rules={{
              validate: (value) => (value && value.length > 0) || 'Vui lòng chọn ít nhất một chủ đề'
            }}
            render={({}) => (
              <FormItem>
                <FormLabel className="text-[#2D3748] font-medium">Chủ đề</FormLabel>
                <FormControl>
                  <div className="mt-2">
                    <div className="relative">
                      <div ref={topicInputRef}>
                        <CustomInput
                          value={topicInput}
                          onChange={(text) => {
                            setTopicInput(text)
                            setShowTopicSuggestions(true)
                          }}
                          onKeyDown={handleTopicKeyDown}
                          onFocus={() => setShowTopicSuggestions(true)}
                          className={`
    ${
      !form.getValues('topic') || form.getValues('topic').length === 0
        ? 'border-red-500'
        : 'hover:border-[#52aaaf]'
    }
  `}
                        />

                        {/* Topic Suggestions */}
                        {showTopicSuggestions && topicInput && (
                          <div className="absolute z-50 left-0 right-0 top-full mt-1 py-1 rounded-lg border shadow-lg max-h-[200px] overflow-y-auto backdrop-blur bg-white/80">
                            {filteredTopics.length > 0 ? (
                              filteredTopics.slice(0, 5).map((topic: string) => (
                                <button
                                  key={topic}
                                  onClick={() => handleAddTopic(topic)}
                                  className="w-full px-3 py-2 text-left text-[#2D3748] hover:bg-gray-50"
                                >
                                  {topic}
                                </button>
                              ))
                            ) : (
                              <div className="px-3 py-2 text-[#2D3748]">Không tìm thấy kết quả</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Selected Topics */}
                    <div className="flex flex-wrap">
                      {(form.getValues('topic') || []).map((topic: string) => {
                        // Get or generate color for topic
                        if (!topicColors[topic]) {
                          setTopicColors((prev) => ({
                            ...prev,
                            [topic]: generateColor(topic)
                          }))
                        }
                        const { text } = topicColors[topic]
                          ? { text: topicColors[topic].text }
                          : generateColor(topic)

                        return (
                          <span
                            key={topic}
                            style={{
                              color: text
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg group"
                          >
                            {topic}
                            <button
                              onClick={() => handleRemoveTopic(topic)}
                              style={{ color: text }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </span>
                        )
                      })}
                    </div>
                  </div>
                </FormControl>
                {(!form.getValues('topic') || form.getValues('topic').length === 0) && (
                  <div className="text-sm text-red-500">Vui lòng chọn ít nhất một chủ đề</div>
                )}
              </FormItem>
            )}
          />

          {/* Tags */}
          <FormField
            control={form.control}
            name="tags"
            rules={{
              validate: (value) => (value && value.length > 0) || 'Vui lòng chọn ít nhất một tag'
            }}
            render={({}) => (
              <FormItem>
                <FormLabel className="text-[#2D3748] font-medium">Tags</FormLabel>
                <FormControl>
                  <div className="mt-2">
                    <div className="relative">
                      <div ref={tagInputRef}>
                        <CustomInput
                          value={tagInput}
                          onChange={(text) => {
                            setTagInput(text)
                            setShowTagSuggestions(true)
                          }}
                          onKeyDown={handleTagKeyDown}
                          onFocus={() => setShowTagSuggestions(true)}
                          className={`
    ${
      !form.getValues('tags') || form.getValues('tags').length === 0
        ? 'border-red-500 focus:ring-red-500'
        : 'hover:border-[#52aaaf]'
    }
  `}
                        />
                        {/* Tag Suggestions */}
                        {showTagSuggestions && tagInput && (
                          <div className="absolute z-50 left-0 right-0 top-full mt-1 py-1 rounded-lg border shadow-lg max-h-[200px] overflow-y-auto backdrop-blur bg-white/80">
                            {filteredTags.length > 0 ? (
                              filteredTags.slice(0, 5).map((tag: string) => (
                                <button
                                  key={tag}
                                  onClick={() => handleAddTag(tag)}
                                  className="w-full px-3 py-2 text-left text-[#2D3748] hover:bg-gray-50"
                                >
                                  {tag}
                                </button>
                              ))
                            ) : (
                              <div className="px-3 py-2 text-[#2D3748]">Không tìm thấy kết quả</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Selected Tags */}
                    <div className="flex flex-wrap gap-2">
                      {(form.getValues('tags') || []).map((tag: string) => {
                        // Get or generate color for tag
                        if (!tagColors[tag]) {
                          setTagColors((prev) => ({
                            ...prev,
                            [tag]: generateColor(tag)
                          }))
                        }
                        const { text } = tagColors[tag]
                          ? { text: tagColors[tag].text }
                          : generateColor(tag)

                        return (
                          <span
                            key={tag}
                            style={{
                              color: text
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg group"
                          >
                            {tag}
                            <button
                              onClick={() => handleRemoveTag(tag)}
                              style={{ color: text }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </span>
                        )
                      })}
                    </div>
                  </div>
                </FormControl>
                {(!form.getValues('tags') || form.getValues('tags').length === 0) && (
                  <div className="text-sm text-red-500">Vui lòng chọn ít nhất một tag</div>
                )}
              </FormItem>
            )}
          />

          {/* Instruction */}
          <FormField
            control={form.control}
            name="instruction"
            rules={{
              validate: (value) => {
                // Xem là trống nếu value không có ký tự nào sau khi loại p, br, tag
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
                    <RichtextchtEditor
                      value={field.value || ''}
                      onChange={field.onChange}
                      className={
                        !(field.value || '').replace(/<p>|<\/p>|<br\s*\/?>/gi, '').trim()
                          ? 'border-red-500 text-red-500'
                          : 'hover:border-[#52aaaf]'
                      }
                      placeholder="Nhập hướng dẫn cho câu hỏi"
                    />
                  </div>
                </FormControl>
                {!(field.value || '').replace(/<p>|<\/p>|<br\s*\/?>/gi, '').trim() && (
                  <div className="text-sm text-red-500 mt-1">
                    Vui lòng nhập tổng quan cho câu hỏi
                  </div>
                )}
              </FormItem>
            )}
          />
        </div>
      </div>
    </Form>
  )
}

import { FC, useState } from 'react'
import { Button } from '../../../../../components/ui/button'
import { CustomInput } from '../../../../../components/Input/CustomInput'
import { getFillInBlankAIGemini } from '../../../../pages/CourseEdit/service/FillInBlankGemini'
import { getChoiceOneAIGemini } from '../../../../pages/CourseEdit/service/ChoiceOneGemini'
import { getChoiceMultiAIGemini } from '../../../../pages/CourseEdit/service/ChoiceMultiGemini'
import { getMatchingAIGemini } from '../../../../pages/CourseEdit/service/MatchingGemini'
import { getTrueFalseNotGivenAIGemini } from '../../../../pages/CourseEdit/service/TrueFalseNotGivenGemini'
import { getErrorIdentificationAIGemini } from '../../../../pages/CourseEdit/service/ErrorIdentificationGemini'
import { getSentenceCompletionAIGemini } from '../../../../pages/CourseEdit/service/SentenceCompletionGemini'
import { getConversationalRepetitionAIGemini } from '../../../../pages/CourseEdit/service/ConversationalRepetitionGemini'
import { getOpenConversationAIGemini } from '../../../../pages/CourseEdit/service/OpenConversationGemini'
import { getOpenParagraphAIGemini } from '../../../../pages/CourseEdit/service/OpenParagraphGemini'
import { GeminiSetting } from '../../../../../components/form/GeminiSettingForm'

interface AIFormProps {
  skill: string
  type: string
  onResult: (aiData: any) => void
  transcript?: string
  passage?: string
}

export const AIForm: FC<AIFormProps> = ({ skill, type, onResult, transcript, passage }) => {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showGemini, setShowGemini] = useState(false)

  const callAI = async (topic: string, transcriptOrPassage?: string) => {
    switch (type) {
      case 'fill_in_the_blank':
        return await getFillInBlankAIGemini(topic, transcriptOrPassage)
      case 'choice_one':
        return await getChoiceOneAIGemini(topic, transcriptOrPassage)
      case 'choice_multi':
        return await getChoiceMultiAIGemini(topic, transcriptOrPassage)
      case 'matching':
        return await getMatchingAIGemini(topic, transcriptOrPassage)
      case 'true_false_not_given':
        return await getTrueFalseNotGivenAIGemini(topic, transcriptOrPassage)
      case 'error_identification':
        return await getErrorIdentificationAIGemini(topic)
      case 'sentence_completion':
        return await getSentenceCompletionAIGemini(topic)
      case 'conversational_repetition':
        return await getConversationalRepetitionAIGemini(topic)
      case 'open_paragraph':
        return await getOpenParagraphAIGemini(topic)
      case 'open_conversation':
        return await getOpenConversationAIGemini(topic)
      default:
        throw new Error('Dạng câu hỏi chưa hỗ trợ AI')
    }
  }

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)

    if (skill === 'listening' && (!transcript || !transcript.trim())) {
      setError('Bạn cần nhập nội dung transcript trước khi dùng AI')
      setLoading(false)
      return
    }
    if (skill === 'reading' && (!passage || !passage.trim())) {
      setError('Bạn cần nhập nội dung bài đọc (passage) trước khi dùng AI')
      setLoading(false)
      return
    }

    try {
      // Đã bỏ validate input rỗng
      const aiData = await callAI(
        input,
        skill === 'listening' ? transcript : skill === 'reading' ? passage : undefined
      )
      onResult(aiData)
    } catch (err: any) {
      setError(err.message || 'Đã có lỗi AI.')
    } finally {
      setLoading(false)
    }
  }

  const handleSettingsSaved = () => setShowGemini(false)

  return (
    <div className="mt-4 rounded-lg transition-all">
      <div className="mb-4 text-[#1A202C] text-lg font-bold">Gợi ý tự động bằng AI</div>
      <CustomInput
        value={input}
        onChange={setInput}
        className="mb-3 border border-[#e5e7eb] rounded hover:border-[#52aaa5] focus:border-[#52aaa5] transition"
      />
      <div className="flex justify-end gap-4 mb-3">
        <Button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className={`
            bg-[#52aaa5] text-white font-semibold 
            rounded-lg px-5 py-2
            hover:bg-[#319c93]
            transition-colors duration-150
            ${loading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {loading ? 'Đang lấy AI...' : 'Gợi ý từ AI'}
        </Button>
        <Button
          type="button"
          onClick={() => setShowGemini((b) => !b)}
          className={`
            bg-white text-[#52aaa5] border border-[#52aaa5]
            hover:bg-[#f0fdfa] hover:text-[#319c93] hover:border-[#319c93]
            font-semibold px-5 py-2 rounded-lg
            shadow
            transition-all duration-150
            active:scale-95 active:opacity-80
          `}
        >
          Cài đặt
        </Button>
      </div>
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      {showGemini && (
        <div className="pt-2 mt-2 border-t border-dashed border-gray-200">
          <GeminiSetting
            onSettingsSaved={handleSettingsSaved}
            onCancel={() => setShowGemini(false)}
          />
        </div>
      )}
    </div>
  )
}

export default AIForm

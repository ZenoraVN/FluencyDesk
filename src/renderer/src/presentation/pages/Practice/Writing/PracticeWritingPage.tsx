import React, { useState } from 'react'
import WritingCreationSection from './sections/WritingCreationSection'
import WritingDoingSection from './sections/WritingDoingSection'
import { WritingCheckerSection } from './sections/WritingCheckerSection'
import { GeminiService } from '../../../../service/GeminiService'
import { getWordCount, parseMinWords } from '../../../../utils/wordCount'
import type { MyExamType, TaskType, WritingPreviewData, EvaluationResult } from './types'
import { TEST_WRITING_CHECKER_SECTION, fakeExam, fakeTask, fakePreview, fakeAnswer } from './mocks'
import {
  stripWritingPromptInstructions,
  countParagraphs,
  buildEvaluationPrompt,
  parseEvaluationResult
} from './utils'

const PracticeWritingPage: React.FC = () => {
  // Configuration from mocks
  const exam: MyExamType = fakeExam
  const task: TaskType = fakeTask
  const preview: WritingPreviewData = fakePreview
  const minWords = parseMinWords(task.words) || 0

  // State
  const [answer, setAnswer] = useState<string>(TEST_WRITING_CHECKER_SECTION ? fakeAnswer : '')
  const [suggestions] = useState<string[]>([])
  const [remaining] = useState<number>(40 * 60)
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [showChecker, setShowChecker] = useState<boolean>(false)
  const [clientError, setClientError] = useState<string | null>(null)

  // Derived values
  const wordCount = getWordCount(answer)
  const minParagraphs = task.minParagraphs || 0
  const paragraphCount = countParagraphs(answer)
  const hasEnoughParagraphs = paragraphCount >= minParagraphs
  const canSubmit =
    !loading &&
    !showChecker &&
    wordCount >= minWords &&
    hasEnoughParagraphs &&
    answer.trim().length > 0

  // Submit handler
  const handleSubmit = async () => {
    if (wordCount < minWords) {
      setClientError(`Bài làm cần tối thiểu ${minWords} từ (hiện tại: ${wordCount}).`)
      return
    }
    if (!hasEnoughParagraphs) {
      setClientError(
        minParagraphs > 1
          ? `Bài làm cần có ít nhất ${minParagraphs} đoạn văn (phân tách rõ bằng dòng trống).`
          : 'Bài làm cần có ít nhất một đoạn văn.'
      )
      return
    }
    setClientError(null)
    setLoading(true)
    setError(null)

    try {
      const apiKey = await GeminiService.getNextApiKey()
      if (!apiKey) {
        setError('No Gemini API key configured')
        return
      }
      const prompt = buildEvaluationPrompt(preview.text, answer)
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        }
      )
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData?.error?.message || 'Evaluation failed')
      }
      const data = await response.json()
      const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
      console.log('Raw Gemini response:', resultText)
      const parsedResult = parseEvaluationResult(resultText)
      console.log('Parsed evaluation result:', parsedResult)

      // Inject demo suggestions when in TEST mode
      if (TEST_WRITING_CHECKER_SECTION && parsedResult) {
        parsedResult.sampleEssays = [
          {
            level: 'intermediate',
            content:
              'Community service offers valuable experience for students. It develops life skills and empathy. Making it compulsory can be beneficial for both the individual and society. However, attention must be paid to avoid turning it into a mere obligation.'
          },
          {
            level: 'advanced',
            content:
              'Mandatory community service in high school curricula has the potential to cultivate not only practical skills but also a heightened awareness of social responsibility. When implemented thoughtfully, such initiatives foster civic engagement and help bridge social divides among youth from diverse backgrounds.'
          }
        ]
        parsedResult.sentenceDiversifications = [
          {
            original:
              'Helping at a shelter or organizing local clean-up campaigns exposes students to real-world problems and encourages them to take initiative.',
            improved:
              'Engaging in activities like volunteering at shelters or leading community clean-ups immerses students in real-world challenges and fosters their proactive spirit.',
            explanation: 'Varied sentence structure and more vivid verbs enhance engagement.'
          }
        ]
        parsedResult.vocabularyHighlights = [
          {
            word: 'empathy',
            meaning: 'the ability to understand and share the feelings of another',
            example: 'Participating in volunteer work fosters empathy among students.'
          },
          {
            word: 'civic engagement',
            meaning: 'involvement in activities intended to improve one’s community',
            example: 'Mandatory service can foster civic engagement in youth.'
          }
        ]
      }

      setEvaluation(parsedResult)
      setShowChecker(true)
    } catch (err: any) {
      setError('Evaluation error: ' + (err?.message || 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  // Retry handler
  const handleRetry = () => {
    setShowChecker(false)
    setEvaluation(null)
    setError(null)
    setClientError(null)
    setLoading(false)
  }

  // Render checker if done
  if (showChecker && evaluation) {
    return (
      <WritingCheckerSection
        exam={exam}
        task={task}
        preview={preview}
        answer={answer}
        evaluation={evaluation}
        onRetry={handleRetry}
      />
    )
  }

  // Default input mode
  return (
    <div className="w-full h-full min-h-[70vh] flex flex-col items-center">
      <WritingDoingSection
        exam={exam}
        task={task}
        preview={preview}
        answer={answer}
        onChangeAnswer={setAnswer}
        minWords={minWords}
        wordCount={wordCount}
        suggestions={suggestions}
        onSubmit={handleSubmit}
        onSaveDraft={undefined}
        onLoadSuggestion={undefined}
        canSubmit={canSubmit}
        remaining={remaining}
        evaluating={loading}
      />
      {clientError && (
        <div className="mt-4 text-red-500 text-base font-semibold">{clientError}</div>
      )}
      {!hasEnoughParagraphs && (
        <div className="mt-2 text-yellow-600 text-[15px] font-medium">
          Bài viết của bạn phải có tối thiểu {minParagraphs} đoạn. (Mở bài - Thân bài - Kết bài)
        </div>
      )}
      {error && <div className="mt-2 text-red-600 text-base">{error}</div>}
      {loading && (
        <div className="mt-4 text-blue-700 font-medium">Evaluating with Gemini, please wait...</div>
      )}
    </div>
  )
}

export default PracticeWritingPage

import React, { useState } from 'react'
import { MyExamType, TaskType, WritingPreviewData, EvaluationResult } from '../PracticeWritingPage'
import { BandScoreBox } from '../components/Checker/BandScoreBox'
import { ParagraphOptimizationBox } from '../components/Checker/ParagraphOptimizationBox'
import { VocabularyHighlightsBox } from '../components/Checker/VocabularyHighlightsBox'
import { SentenceDiversificationBox } from '../components/Checker/SentenceDiversificationBox'
import { SampleEssaysBox } from '../components/Checker/SampleEssaysBox'
import { AnnotatedAnswerBox } from '../components/Checker/AnnotatedAnswerBox'

interface WritingCheckerSectionProps {
  exam: MyExamType
  task: TaskType
  preview: WritingPreviewData | null
  answer: string
  evaluation: EvaluationResult
  onRetry: () => void
}

const WritingCheckerSection: React.FC<WritingCheckerSectionProps> = ({
  exam,
  task,
  preview,
  answer,
  evaluation,
  onRetry
}) => {
  const [activeError, setActiveError] = useState<number | null>(null)

  return (
    <div className="flex flex-col h-full p-6 bg-white rounded-xl shadow-lg overflow-y-auto">
      <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 py-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Evaluation Result - {exam.label} {task.name}
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Panel (Prompt + Answer annotation) */}
        <div className="w-full lg:w-7/12 space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="font-semibold text-lg mb-2 flex items-center">
              <span className="text-gray-600 mr-2">&#128196;</span>
              Prompt
            </h3>
            <p className="whitespace-pre-line">{preview?.text}</p>
          </div>
          <AnnotatedAnswerBox annotatedText={evaluation.annotatedText || answer} />
        </div>
        {/* Right Panel (Band Score and checker features) */}
        <div className="w-full lg:w-5/12 space-y-6">
          <BandScoreBox bandScores={evaluation.bandScores} />
          <ParagraphOptimizationBox optimizations={evaluation.paragraphOptimizations} />
          <VocabularyHighlightsBox vocabulary={evaluation.vocabularyHighlights} />
          <SentenceDiversificationBox diversifications={evaluation.sentenceDiversifications} />
          <SampleEssaysBox samples={evaluation.sampleEssays} />
        </div>
      </div>

      {/* Retry Button */}
      <div className="flex justify-center mt-8 sticky bottom-0 bg-white py-4">
        <button
          type="button"
          className="px-6 py-3 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center"
          onClick={onRetry}
        >
          <span className="mr-2">&#10227;</span>
          Retry
        </button>
      </div>
    </div>
  )
}

export { WritingCheckerSection }

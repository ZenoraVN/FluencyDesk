import React, { useState, useRef } from 'react'
import type { MyExamType, TaskType, WritingPreviewData, EvaluationResult } from '../types'
import { BandScoreBox } from '../components/Checker/BandScoreBox'
import { SuggestionsBox } from '../components/Checker/SuggestionsBox'
import { AnnotatedAnswerBox } from '../components/Checker/AnnotatedAnswerBox'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../../components/ui/tabs'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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
  evaluation
}) => {
  const tabsListRef = useRef<HTMLDivElement>(null)
  const [activeError, setActiveError] = useState<number | null>(null)

  const scrollLeft = () => {
    tabsListRef.current?.scrollBy({ left: -200, behavior: 'smooth' })
  }
  const scrollRight = () => {
    tabsListRef.current?.scrollBy({ left: 200, behavior: 'smooth' })
  }

  return (
    <div className="flex flex-col h-full p-4 rounded-xl shadow-lg overflow-y-auto">
      <div className="flex justify-between items-center py-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Evaluation Result - {exam.label} {task.name}
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Panel (Prompt + Answer annotation) */}
        <div className="w-full lg:w-8/12 space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center">
              <span className="text-gray-600 mr-2">&#128196;</span>
              Prompt
            </h3>
            <p className="whitespace-pre-line">{preview?.text}</p>
          </div>
          <AnnotatedAnswerBox
            answer={answer}
            errors={evaluation.errors}
            activeErrorId={activeError}
            onErrorClick={setActiveError}
          />
        </div>
        {/* Right Panel (Band Score and checker features) */}
        <Tabs defaultValue="bandScore" className="w-full lg:w-4/12 space-y-6 h-full">
          <div className="flex items-center space-x-1 min-w-0">
            <button
              type="button"
              onClick={scrollLeft}
              className="flex-none p-1 bg-white/70 dark:bg-gray-800/70"
            >
              <ChevronLeft size={20} />
            </button>
            <div
              ref={tabsListRef}
              className="flex-auto min-w-0 overflow-x-auto scroll-smooth border-b mb-2 px-2 scroll-pl-2 scroll-pr-2"
            >
              <TabsList className="flex space-x-2 whitespace-nowrap min-w-max">
                <TabsTrigger value="bandScore">Band Score</TabsTrigger>
                <TabsTrigger value="suggestion">Suggestion</TabsTrigger>
              </TabsList>
            </div>
            <button
              type="button"
              onClick={scrollRight}
              className="flex-none p-1 bg-white/70 dark:bg-gray-800/70"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <TabsContent value="bandScore">
            <BandScoreBox bandScores={evaluation.bandScores} />
          </TabsContent>
          <TabsContent value="suggestion">
            <SuggestionsBox
              errors={evaluation.errors}
              activeErrorId={activeError}
              onSuggestionClick={setActiveError}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export { WritingCheckerSection }

export type ExamTypeKey = 'IELTS' | 'TOEIC' | 'TOEFL' | 'PTE' | 'VSTEP'

export interface WritingError {
  id: number
  type: 'spelling' | 'grammar' | 'sentence' | 'vocabulary'
  original: string
  corrected: string
  explanation: string
  startPos: number
  endPos: number
}

export interface ParagraphOptimization {
  paragraphIndex: number
  paragraphType: 'introduction' | 'body' | 'conclusion'
  original: string
  optimized: string
  explanation: string
  errors: {
    original: string
    suggestion: string
    explanation: string
  }[]
}

export interface VocabularyHighlight {
  word: string
  meaning: string
  example: string
}

export interface SentenceDiversification {
  original: string
  improved: string
  explanation: string
}

export interface SampleEssay {
  level: 'intermediate' | 'advanced'
  content: string
}

export interface BandScores {
  overall: number
  TR: number | null
  CC: number | null
  GRA: number | null
  LR: number | null
}

export interface EvaluationResult {
  score: number
  bandScores: BandScores
  overallFeedback: string
  errors: WritingError[]
  paragraphOptimizations: ParagraphOptimization[]
  vocabularyHighlights: VocabularyHighlight[]
  sentenceDiversifications: SentenceDiversification[]
  sampleEssays: SampleEssay[]
  annotatedText?: string
}

export interface TaskType {
  key: string
  name: string
  description: string
  time: string
  words: string
  topics?: string[]
  disabled?: boolean
  minParagraphs?: number
}

export interface MyExamType {
  key: ExamTypeKey
  label: string
  info: string
  purpose: string
  tasks: TaskType[]
}

export interface WritingPreviewData {
  text: string
  chart?: any | null
}

export type AnyKeyObj = { [key: string]: any }

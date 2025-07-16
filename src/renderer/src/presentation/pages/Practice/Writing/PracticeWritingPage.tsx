import React, { useState, useEffect } from 'react'
import WritingCreationSection from './sections/WritingCreationSection'
import WritingDoingSection from './sections/WritingDoingSection'
import { GeminiService } from '../../../../service/GeminiService'
import { getWordCount, parseMinWords } from '../../../../utils/wordCount'
import { WritingCheckerSection } from './sections/WritingCheckerSection'

/**
 * Debug flag: always show the result screen with a mock writing for debug/dev UI.
 * Set to false or remove before shipping production!
 */
const TEST_WRITING_CHECKER_SECTION = true

// Mock data for checker demo
const fakeExam = {
  key: 'IELTS' as const,
  label: 'IELTS',
  info: '2 task types',
  purpose: 'For studying or working in English-speaking countries',
  tasks: [
    {
      key: 'task2',
      name: 'Task 2 (Essay)',
      description: 'Essay argumentative/opinion',
      time: '40 minutes',
      words: '~250 words',
      topics: [
        'Environment',
        'Technology',
        'Education',
        'Health',
        'Society',
        'Business',
        'Travel',
        'Culture'
      ]
    }
  ]
}

const fakeTask = fakeExam.tasks[0]

const fakePreview = {
  text: 'Some people believe that unpaid community service should be a compulsory part of high school programmes. To what extent do you agree or disagree?',
  chart: null
}

const fakeAnswer =
  "Personally, I strongly agree that unpaid community service should be a compulsory part of high school programmes because it provides students with valuable experiences. Firstly, community service helps young people develop practical skills and understand the importance of helping others. For example, volunteering at a food bank can teach responsibility and empathy. Secondly, it encourages teamwork and communication, which are crucial in both education and future careers. Although some may argue that unpaid work distracts from academic study, I believe it enhances students' social awareness and personal growth. In conclusion, making community service compulsory benefits students and society alike."

function stripWritingPromptInstructions(input: string): string {
  const lines = input
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
  const instructionPatterns = [
    /^(\*\*[^*]+\*\*)$/,
    /you should spend about/i,
    /write at least/i,
    /write about the following topic/i,
    /write about the following chart/i,
    /give reasons for your answer/i,
    /include any relevant examples/i,
    /discuss both sides/i,
    /discuss both views/i,
    /give your own opinion/i,
    /write no more than/i,
    /write your answer in/i,
    /your answer should be/i,
    /please write your response/i,
    /use specific reasons and examples/i,
    /make sure to/i,
    /be sure to/i,
    /this is a/i,
    /remember to/i,
    /you are required to/i,
    /your essay should/i,
    /support your arguments/i,
    /provide examples/i,
    /at least \d+ words/i,
    /between \d+ and \d+ words/i,
    /around \d+ words/i,
    /approximately \d+ words/i,
    /you have \d+ minutes/i,
    /spend no more than \d+ minutes/i,
    /spend about \d+ minutes/i,
    /^task \d+:$/i,
    /^ielts writing task \d+$/i,
    /^toefl (integrated|independent) writing$/i,
    /^cefr writing$/i,
    /^toeic writing$/i,
    /^#\s+/,
    /You should write at least \d+ words/i,
    /You do not need to include your name or addresses/i,
    /Your response will be evaluated in terms of/i,
    /Task fulfillment, Organization, Vocabulary, and Grammar/i
  ]
  const filtered = lines.filter(
    (line) => !instructionPatterns.some((pattern) => pattern.test(line))
  )
  const cleanedLines = filtered.map((line) => line.replace(/^\*\*|\*\*$/g, '').trim())
  return cleanedLines.join('\n').trim()
}

export type ExamTypeKey = 'IELTS' | 'TOEIC' | 'TOEFL' | 'PTE' | 'VSTEP'

/**
 * --- NEW v2.0 Evaluation Types For Checker ---
 */

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
  original: string
  optimized: string
  explanation: string
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
  TR: number | null // Task Response
  CC: number | null // Coherence & Cohesion
  GRA: number | null // Grammatical Range & Accuracy
  LR: number | null // Lexical Resource
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

// --------- DEV/DEBUG ONLY main component ---------
const PracticeWritingPage: React.FC = () => {
  // STATE: Main persistent configuration (in real app this comes from props/router/context)
  const exam = fakeExam
  const task = fakeTask
  const preview = fakePreview
  const minWords = 250 // Hardcoded or parse from task.words

  // Dev: prefill answer or blank by env flag
  const [answer, setAnswer] = useState(TEST_WRITING_CHECKER_SECTION ? fakeAnswer : '')
  const [suggestions] = useState<string[]>([]) // Could fetch more for real app
  const [remaining] = useState(40 * 60) // 40 min, static for demo
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showChecker, setShowChecker] = useState(false)
  const [clientError, setClientError] = useState<string | null>(null)

  // Word and paragraph count
  const wordCount = getWordCount(answer)
  const isMultiParagraph = answer.trim().split(/\n\s*\n+/).length >= 2

  // Button enabled only if valid
  const canSubmit =
    !loading &&
    !showChecker &&
    wordCount >= minWords &&
    isMultiParagraph &&
    answer.trim().length > 0

  // Handler for submitting the writing
  const handleSubmit = async () => {
    // Client-side validation
    if (wordCount < minWords) {
      setClientError(`Bài làm cần tối thiểu ${minWords} từ (hiện tại: ${wordCount}).`)
      return
    }
    if (!isMultiParagraph) {
      setClientError('Bài làm cần có ít nhất mở bài và thân bài (phân tách đoạn bằng xuống dòng).')
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
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      )
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData?.error?.message || 'Evaluation failed')
      }
      const data = await response.json()
      const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
      const parsedResult = parseEvaluationResult(resultText)
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

  function buildEvaluationPrompt(question: string, answer: string): string {
    return `
You are an expert English writing examiner. Please evaluate the following essay according to the main criteria of IELTS, TOEFL, and VSTEP academic English writing tasks and return the result as a JSON object.

**Prompt:**
${question}

**Student's Answer:**
${answer}

**Evaluation Instructions:**
1. Assign an overall band score (0-9), AND 4 separate band scores (0-9, using .0 or .5 steps) for:
   - Task Response (TR): (how well the answer meets requirements)
   - Coherence & Cohesion (CC): (organization and flow)
   - Lexical Resource (LR): (vocabulary range and accuracy)
   - Grammatical Range & Accuracy (GRA): (grammar and structures)
2. Return these scores as a JSON object under the key "bandScores" with keys: overall, TR, CC, GRA, LR (all must be numbers).
3. Give an overall comment.
4. Provide detailed feedback for each criterion:
   - Task Achievement (How well the answer meets requirements)
   - Coherence & Cohesion (Organization and flow)
   - Lexical Resource (Vocabulary range and accuracy)
   - Grammatical Range & Accuracy (Grammar and structures)
5. List any spelling errors (with corrections/suggestions)
6. List any grammar errors (with explanation and correction)
7. Provide vocabulary suggestions for improvement (synonyms, more academic/formal words)
8. Statistics:
   - Word count
   - Sentence count
   - Lexical diversity (unique words/total words)
   - Grammar complexity (simple, intermediate, advanced)
9. Suggest 3-5 specific tips for overall improvement

**Output format (JSON):**
{
  "score": 8.5,
  "bandScores": {
    "overall": 8.5,
    "TR": 8.0,
    "CC": 8.5,
    "GRA": 8.0,
    "LR": 8.5
  },
  "overallFeedback": "Overall, the essay is clear and well-organized but could use more advanced vocabulary and grammar structures.",
  "criteria": {
    "Task Achievement": "The response fully addresses all parts of the prompt.",
    "Coherence & Cohesion": "Ideas are logically organized and linked.",
    "Lexical Resource": "Appropriate vocabulary, but some repetition.",
    "Grammatical Range & Accuracy": "Generally accurate, with minor errors."
  },
  "spellingErrors": [
    {
      "word": "recieve",
      "suggestions": ["receive"]
    }
  ],
  "grammarErrors": [
    {
      "sentence": "She go to school yesterday.",
      "explanation": "The correct form of 'go' in past tense is 'went'.",
      "correction": "She went to school yesterday."
    }
  ],
  "vocabularySuggestions": [
    {
      "word": "good",
      "suggestions": ["excellent", "outstanding"]
    }
  ],
  "statistics": {
    "wordCount": 250,
    "sentenceCount": 15,
    "lexicalDiversity": 0.65,
    "grammarComplexity": "Intermediate"
  },
  "improvementTips": [
    "Use more advanced and varied vocabulary.",
    "Check verb tenses for accuracy.",
    "Add more complex sentence structures."
  ]
}

**Notes:**
- Only return valid JSON, no extra explanation or formatting
- All feedback must be in English, clear and concise
- The review should be objective and point out both strengths and weaknesses
`
  }

  function getBandScoreValue(bandObj: any, keys: string[], defaultValue = 0): number {
    for (const key of keys) {
      if (bandObj && bandObj[key] != null) {
        const val = bandObj[key]
        return typeof val === 'string' ? parseFloat(val) : Number(val)
      }
      // Support case-insensitive match for robustness
      const foundKey = bandObj
        ? Object.keys(bandObj).find((k) => k.toLowerCase() === key.toLowerCase())
        : undefined
      if (foundKey && bandObj[foundKey] != null) {
        const val = bandObj[foundKey]
        return typeof val === 'string' ? parseFloat(val) : Number(val)
      }
    }
    return defaultValue
  }

  function parseEvaluationResult(text: string): EvaluationResult {
    try {
      const jsonStart = text.indexOf('{')
      const jsonEnd = text.lastIndexOf('}') + 1
      const jsonString = text.substring(jsonStart, jsonEnd)
      const result = JSON.parse(jsonString)
      // DEBUG: Log raw Gemini output for score bug analysis
      console.log('[Gemini DEBUG] RAW result:', result)
      // Flexible parse band scores (handle Gemini output quirks)
      const bandObj = result.bandScores || result.bandScore || result.band_scores || {}

      return {
        score: result.score ?? 0,
        bandScores: {
          // Gemini only provides overall score as "score"
          overall:
            typeof result.score === 'number'
              ? result.score
              : getBandScoreValue(bandObj, ['overall', 'total', 'band']),
          TR:
            bandObj && (typeof bandObj.TR === 'number' || typeof bandObj.TR === 'string')
              ? getBandScoreValue(bandObj, ['TR', 'tr', 'taskResponse', 'task_response'])
              : null,
          CC:
            bandObj && (typeof bandObj.CC === 'number' || typeof bandObj.CC === 'string')
              ? getBandScoreValue(bandObj, ['CC', 'cc', 'coherenceCohesion', 'coherence_cohesion'])
              : null,
          GRA:
            bandObj && (typeof bandObj.GRA === 'number' || typeof bandObj.GRA === 'string')
              ? getBandScoreValue(bandObj, [
                  'GRA',
                  'gra',
                  'grammaticalRangeAccuracy',
                  'grammar',
                  'grammatical'
                ])
              : null,
          LR:
            bandObj && (typeof bandObj.LR === 'number' || typeof bandObj.LR === 'string')
              ? getBandScoreValue(bandObj, ['LR', 'lr', 'lexicalResource', 'lexical_resource'])
              : null
        },
        overallFeedback: result.overallFeedback ?? '',
        errors: result.errors ?? [],
        paragraphOptimizations: result.paragraphOptimizations ?? [],
        vocabularyHighlights: result.vocabularyHighlights ?? [],
        sentenceDiversifications: result.sentenceDiversifications ?? [],
        sampleEssays: result.sampleEssays ?? []
      }
    } catch (error) {
      console.error('Error parsing evaluation result:', error)
      return {
        score: 0,
        bandScores: {
          overall: 0,
          TR: 0,
          CC: 0,
          GRA: 0,
          LR: 0
        },
        overallFeedback: 'Could not parse evaluation result',
        errors: [],
        paragraphOptimizations: [],
        vocabularyHighlights: [],
        sentenceDiversifications: [],
        sampleEssays: []
      }
    }
  }

  // CHECKER: Show result if ready
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

  // DOING: Input mode (default)
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
      {/* Errors: client validate or backend */}
      {clientError && (
        <div className="mt-4 text-red-500 text-base font-semibold">{clientError}</div>
      )}
      {error && <div className="mt-2 text-red-600 text-base">{error}</div>}
      {loading && (
        <div className="mt-4 text-blue-700 font-medium">Evaluating with Gemini, please wait...</div>
      )}
    </div>
  )
}

export default PracticeWritingPage

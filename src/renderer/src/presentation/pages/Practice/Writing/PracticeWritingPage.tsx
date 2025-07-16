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
      ],
      // ADD minParagraphs = 3 for essay
      minParagraphs: 3
    }
  ]
}

const fakeTask = fakeExam.tasks[0]

const fakePreview = {
  text: 'Some people believe that unpaid community service should be a compulsory part of high school programmes. To what extent do you agree or disagree?',
  chart: null
}

const fakeAnswer =
  'In recent years, there has been growing debate about whether unpaid community service—such as volunteering, helping the elderly, or cleaning public areas—should be a mandatory part of high school education. While some argue that it should remain optional, I strongly agree that integrating community service into school programmes offers significant educational and social benefits for students and society as a whole.\n\nTo begin with, mandatory community service equips students with essential life skills that traditional academic subjects often overlook. Participating in volunteer work fosters empathy, teamwork, communication, and a sense of responsibility. For instance, helping at a shelter or organizing local clean-up campaigns exposes students to real-world problems and encourages them to take initiative. These experiences not only make students more well-rounded individuals but also prepare them better for the challenges of adult life.\n\nFurthermore, making community service compulsory can strengthen the connection between schools and their local communities. When young people engage directly with their neighborhoods, they become more aware of social issues and are more likely to become active, responsible citizens in the future. It also helps reduce social inequality, as students from all backgrounds, regardless of their family income, participate equally and contribute meaningfully.\n\nOpponents might argue that forcing students to volunteer could lead to resentment and superficial engagement. However, with proper planning and guidance, schools can design programs that match students’ interests and strengths. For example, a student passionate about animals could volunteer at a rescue center, while another interested in education could help tutor younger children. When students see the value in what they are doing, motivation naturally follows.\n\nIn conclusion, I firmly believe that incorporating unpaid community service into high school programmes brings numerous long-term benefits. It helps develop essential life skills, fosters civic responsibility, and promotes a stronger connection between youth and society. Rather than viewing it as a burden, we should see it as an investment in building a more compassionate and engaged generation.'

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
  // Minimum number of paragraphs required (optional)
  minParagraphs?: number
}

// Patch for mock/fakeTask to allow minParagraphs property
type AnyKeyObj = { [key: string]: any }

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
  // Support for either proper TaskType or fallback to any for demo/mock objects
  const task: TaskType | AnyKeyObj = fakeTask
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
  // Get minimum paragraphs for this task; default 1 if not defined, or 3 for some tasks
  // Lấy minParagraphs từ task, nếu không có thì mặc định là 0 (không cảnh báo)
  const minParagraphs =
    typeof task.minParagraphs === 'number' && task.minParagraphs > 0 ? task.minParagraphs : 0

  // Robust paragraph count: count as a new paragraph each time:
  // 1. There is a non-empty line, and it is the first line or the previous line is empty.
  // This way, user can use either a single empty line or always write in blocks.
  function countParagraphs(text: string): number {
    const lines = text.split('\n').map((line) => line.trim())
    let count = 0
    let inParagraph = false
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].length > 0) {
        if (!inParagraph) {
          count++
          inParagraph = true
        }
      } else {
        inParagraph = false
      }
    }
    return count
  }

  const paragraphCount = countParagraphs(answer)

  // Old: const isMultiParagraph = answer.trim().split(/\n\s*\n+/).length >= 2
  const hasEnoughParagraphs = paragraphCount >= minParagraphs

  // Button enabled only if valid
  const canSubmit =
    !loading &&
    !showChecker &&
    wordCount >= minWords &&
    hasEnoughParagraphs &&
    answer.trim().length > 0

  // Handler for submitting the writing
  const handleSubmit = async () => {
    // Client-side validation
    if (wordCount < minWords) {
      setClientError(`Bài làm cần tối thiểu ${minWords} từ (hiện tại: ${wordCount}).`)
      return
    }
    if (!hasEnoughParagraphs) {
      if (minParagraphs > 1) {
        setClientError(
          `Bài làm cần có ít nhất ${minParagraphs} đoạn văn (được phân tách rõ ràng qua xuống dòng trống).`
        )
      } else {
        setClientError('Bài làm cần có ít nhất một đoạn văn.')
      }
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
      // ---- DEMO MOCK DATA INJECTION FOR UI PREVIEW ----
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
            explanation:
              'Varied sentence structure and introduced more vivid verbs to improve engagement.'
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
      // ---------------------------------------------------
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

10. **PARAGRAPH OPTIMIZATION (Important for this evaluation!):**
   - For each paragraph, return an object with:
     - paragraphIndex (number, e.g. 1 for first paragraph)
     - paragraphType: string, either "introduction", "body", or "conclusion" (identify what kind of paragraph this is)
     - original: the original paragraph text
     - optimized: rewrite the paragraph in improved/optimized English (focus on fluency, structure, and conciseness)
     - explanation: (brief, high-level summary of improvements in this paragraph)
     - errors: a list/array, where for each relevant sentence in the paragraph with issues, include:
         - original: the original sentence (as in the user's writing)
         - suggestion: an improved version of the sentence (if needed)
         - explanation: explain why it needs improvement or what was corrected

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
  ],
  "paragraphOptimizations": [
    {
      "paragraphIndex": 1,
      "paragraphType": "introduction",
      "original": "In recent years, there has been growing debate ...",
      "optimized": "Recently, debate has intensified about whether ...",
      "explanation": "Clarified main idea and improved flow.",
      "errors": [
        {
          "original": "In recent years, there has been growing debate about whether unpaid community service...",
          "suggestion": "Recently, debate has intensified about whether unpaid community service...",
          "explanation": "Use of passive and wordiness can be improved; made wording more direct."
        }
      ]
    }
    // ... other paragraph objects
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
        task={task as TaskType}
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
        task={task as TaskType}
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

      {/* Paragraph warning if not enough */}
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

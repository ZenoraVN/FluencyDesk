import React, { useState, useEffect, useRef } from 'react'
import WritingCreationSection from './sections/WritingCreationSection'
import WritingDoingSection from './sections/WritingDoingSection'
import { GeminiService } from '../../../../service/GeminiService'
import { getWordCount, parseMinWords } from '../../../../utils/wordCount'
import { WritingCheckerSection } from './sections/WritingCheckerSection'

// Removes generic exam instructions, headings, and structure info — returns only the core question
/**
 * Removes ALL generic exam instructions, headings, and structure info — returns ONLY the core question
 */
function stripWritingPromptInstructions(input: string): string {
  // Normalize line breaks and remove empty lines
  const lines = input
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  // Patterns considered instruction/boilerplate (expanded list)
  const instructionPatterns = [
    /^(\*\*[^*]+\*\*)$/, // fully bold heading line
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
    /^#\s+/, // Markdown headings
    // VSTEP-specific patterns
    /You should write at least \d+ words/i,
    /You do not need to include your name or addresses/i,
    /Your response will be evaluated in terms of/i,
    /Task fulfillment, Organization, Vocabulary, and Grammar/i
  ]

  // Remove ALL instruction lines
  const filtered = lines.filter(
    (line) => !instructionPatterns.some((pattern) => pattern.test(line))
  )

  // Remove markdown bold formatting from any remaining lines
  const cleanedLines = filtered.map((line) => line.replace(/^\*\*|\*\*$/g, '').trim())

  // Return only the core question content
  return cleanedLines.join('\n').trim()
}

// Type exports needed by sections
export type ExamTypeKey = 'IELTS' | 'TOEIC' | 'TOEFL' | 'PTE' | 'VSTEP'

// --- place interface here instead of inline in component ---
export interface EvaluationResult {
  score: number
  feedback: string
  detailedAnalysis: {
    [key: string]: string
  }
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

const EXAM_TYPES: MyExamType[] = [
  {
    key: 'IELTS',
    label: 'IELTS',
    info: '2 task types',
    purpose: 'For studying or working in English-speaking countries',
    tasks: [
      {
        key: 'task1',
        name: 'Task 1 (Chart / Letter)',
        description: 'Write a letter or chart report',
        time: '20 minutes',
        words: '~150 words',
        topics: undefined,
        disabled: true
      },
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
  },
  {
    key: 'TOEIC',
    label: 'TOEIC',
    info: '3 task types',
    purpose: 'For workplace English proficiency assessment',
    tasks: [
      {
        key: 'email',
        name: 'Write Email',
        description: 'Write an email related to business/office',
        time: '15 minutes',
        words: '~120 words',
        topics: ['Business', 'Society', 'Culture']
      },
      {
        key: 'essay',
        name: 'Write Essay',
        description: 'Varied topics about life & work',
        time: '30 minutes',
        words: '~150 words',
        topics: ['Business', 'Health', 'Travel', 'Society']
      },
      {
        key: 'letter',
        name: 'Business Letter',
        description: 'Write a letter for work purposes',
        time: '20 minutes',
        words: '~100 words',
        topics: undefined
      }
    ]
  },
  {
    key: 'TOEFL',
    label: 'TOEFL',
    info: '2 task types',
    purpose: 'For academic studies in English-speaking universities',
    tasks: [
      {
        key: 'independent',
        name: 'Independent Writing',
        description: 'Personal/Opinion Essay',
        time: '30 minutes',
        words: '~300 words',
        topics: ['Environment', 'Education', 'Society', 'Travel']
      },
      {
        key: 'integrated',
        name: 'Integrated Writing',
        description: 'Combine listening, reading, writing skills',
        time: '20 minutes',
        words: '~150-225 words',
        topics: undefined,
        disabled: true
      }
    ]
  },
  {
    key: 'PTE',
    label: 'PTE',
    info: '3 task types',
    purpose: 'Computer-based test for study abroad and immigration',
    tasks: [
      {
        key: 'essay',
        name: 'Write Essay',
        description: 'Academic essay on given topic',
        time: '20 minutes',
        words: '200-300 words',
        topics: ['Education', 'Technology', 'Environment', 'Society']
      },
      {
        key: 'summarize',
        name: 'Summarize Text',
        description: 'Summarize academic text in one sentence',
        time: '10 minutes',
        words: '5-75 words',
        topics: undefined
      },
      {
        key: 'describe',
        name: 'Describe Image',
        description: 'Describe visual information',
        time: '25 minutes',
        words: '~150 words',
        topics: undefined,
        disabled: true
      }
    ]
  },
  {
    key: 'VSTEP',
    label: 'VSTEP',
    info: '2 task types',
    purpose: 'Vietnamese standardized test for English proficiency',
    tasks: [
      {
        key: 'letter',
        name: 'Formal Letter/Email',
        description: 'Write a formal letter or email for specific purposes',
        time: '20 minutes',
        words: '~120 words',
        topics: ['Complaint', 'Job Application', 'Information Request', 'Thank You', 'Apology']
      },
      {
        key: 'essay',
        name: 'Essay',
        description: 'Argumentative essay on social issues',
        time: '40 minutes',
        words: '~250 words',
        topics: ['Opinion', 'Argumentative', 'Problem-Solution', 'Advantage-Disadvantage']
      }
    ]
  }
]

type ChartPreview = {
  chartType: string
  chartData: any
  chartOptions?: any
}
export interface WritingPreviewData {
  text: string
  chart?: ChartPreview | null
}

// Main component
const PracticeWritingPage: React.FC = () => {
  // --- Writing Creation State ---
  const [selectedExam, setSelectedExam] = useState<ExamTypeKey>('IELTS')
  const exam = EXAM_TYPES.find((e) => e.key === selectedExam)!
  const [selectedTask, setSelectedTask] = useState(exam.tasks[0].key)
  const [customTopic, setCustomTopic] = useState('')
  const [selectedTopic, setSelectedTopic] = useState('Random')
  const [aiPrompt, setAiPrompt] = useState('')
  const [preview, setPreview] = useState<WritingPreviewData | null>(null)
  const [created, setCreated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // --- NEW: FOR GEMINI EVALUATION ---
  // (removed the erroneous export interface block from here)
  const [evaluationMode, setEvaluationMode] = useState(false)
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null)
  const [evaluating, setEvaluating] = useState(false)
  // -----------------------------------

  useEffect(() => {
    setSelectedTask(EXAM_TYPES.find((e) => e.key === selectedExam)!.tasks[0].key)
  }, [selectedExam])

  useEffect(() => {
    setSelectedTopic('Random')
    setCustomTopic('')
    setAiPrompt('')
    setPreview(null)
    setCreated(false)
    setError(null)
    setLoading(false)
  }, [selectedTask, selectedExam])

  const selectedTaskObj = exam.tasks.find((t) => t.key === selectedTask)
  const topics = selectedTaskObj?.topics || []

  // --- Section Switching State ---
  const [doingMode, setDoingMode] = useState(false)
  // Data frozen at the start of the exam
  const [sessionExam, setSessionExam] = useState<MyExamType | null>(null)
  const [sessionTask, setSessionTask] = useState<TaskType | null>(null)
  const [sessionPreview, setSessionPreview] = useState<WritingPreviewData | null>(null)

  // --- Writing Doing State ---
  const [answer, setAnswer] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [remainingTime, setRemainingTime] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Calculate exam time (parse from sessionTask.time, e.g. "20 minutes")
  const getInitialSeconds = (timeStr?: string) => {
    if (!timeStr) return 20 * 60 // default 20min
    const match = timeStr.match(/(\d+)\s*min/)
    if (match) return parseInt(match[1], 10) * 60
    return 20 * 60
  }

  // Transition: creation -> doing
  const handleStartExam = () => {
    if (!preview || !selectedTaskObj) return
    setDoingMode(true)
    setSessionExam(exam)
    setSessionTask(selectedTaskObj)
    setSessionPreview(preview)
    setAnswer('')
    setSuggestions([]) // Could load hints/guidance here
    const sec = getInitialSeconds(selectedTaskObj.time)
    setRemainingTime(sec)
  }

  // Timer setup/cleanup
  useEffect(() => {
    if (!doingMode) {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      return
    }
    timerRef.current = setInterval(() => {
      setRemainingTime((r) => (r > 0 ? r - 1 : 0))
    }, 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [doingMode])

  // Calculate minWords and word count for answer
  const minWords = doingMode && sessionTask ? parseMinWords(sessionTask.words) : 1
  const wordCount = doingMode && answer ? getWordCount(answer) : 0

  // Helper: can submit if minimum word count met and time > 0
  const canSubmit = doingMode && remainingTime > 0 && wordCount >= minWords

  // ----- GEMINI EVALUATION HANDLER -----
  const handleEvaluateWriting = async () => {
    if (!preview || !answer) return
    setEvaluating(true)
    try {
      const apiKey = await GeminiService.getNextApiKey()
      if (!apiKey) {
        throw new Error('No Gemini API key configured')
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
      setEvaluationResult(parsedResult)
      setEvaluationMode(true)
    } catch (err: any) {
      setError('Evaluation error: ' + (err.message || 'Unknown error'))
    } finally {
      setEvaluating(false)
    }
  }

  // Gemini evaluation prompt builder
  const buildEvaluationPrompt = (question: string, answer: string): string => {
    return `
Bạn là chuyên gia đánh giá bài viết tiếng Anh cho kỳ thi VSTEP. Hãy đánh giá bài viết sau theo các tiêu chí của VSTEP Task 1 (Formal Letter) và trả về kết quả dưới dạng JSON.

**Đề bài:**
${question}

**Bài làm của học viên:**
${answer}

**Yêu cầu đánh giá:**
1. Chấm điểm tổng thể theo thang điểm 10
2. Phân tích chi tiết theo các tiêu chí:
   - Task Achievement (Đáp ứng yêu cầu đề bài)
   - Coherence & Cohesion (Tính mạch lạc và liên kết)
   - Lexical Resource (Từ vựng)
   - Grammatical Range & Accuracy (Ngữ pháp)
3. Đưa ra nhận xét tổng quan
4. Gợi ý cải thiện

**Định dạng đầu ra (JSON):**
{
  "score": 8.5,
  "feedback": "Tổng quan tốt, nhưng cần cải thiện...",
  "detailedAnalysis": {
    "Task Achievement": "Bài viết đáp ứng đủ 3 yêu cầu...",
    "Coherence & Cohesion": "Bố cục rõ ràng...",
    "Lexical Resource": "Từ vựng phù hợp...",
    "Grammatical Range & Accuracy": "Còn một số lỗi ngữ pháp..."
  }
}

**Lưu ý:**
- Chỉ trả về JSON, không có nội dung nào khác
- Sử dụng tiếng Việt cho phản hồi
- Đánh giá khách quan, chỉ ra cả điểm mạnh và điểm yếu
`
  }

  // Gemini evaluation response parser
  function parseEvaluationResult(text: string): EvaluationResult {
    try {
      const jsonStart = text.indexOf('{')
      const jsonEnd = text.lastIndexOf('}') + 1
      const jsonString = text.substring(jsonStart, jsonEnd)
      return JSON.parse(jsonString)
    } catch {
      throw new Error('Invalid evaluation format from Gemini')
    }
  }

  // Handle to restart writing task
  const handleRetry = () => {
    setEvaluationMode(false)
    setEvaluationResult(null)
    setDoingMode(true)
  }

  // --- Old logic, still support normal submit (can keep as fallback/manual)
  const handleSubmit = () => {
    if (!canSubmit) return
    alert('Submitted! Thank you. (Implement actual saving logic here)')
    setDoingMode(false)
    setSessionExam(null)
    setSessionTask(null)
    setSessionPreview(null)
    setAnswer('')
    setSuggestions([])
    setRemainingTime(0)
  }

  // --- Current Creation: Generate Exam logic (in creation mode only) ---
  const buildGeminiPrompt = (mode: 'prompt' | 'random') => {
    let taskText = `Exam: ${exam.label}\nTask: ${selectedTaskObj?.name}\nDescription: ${selectedTaskObj?.description}\nTime: ${selectedTaskObj?.time}\nWords: ${selectedTaskObj?.words}\n`
    let topicText = ''
    if (topics.length) {
      topicText =
        'Topic: ' +
        (selectedTopic === 'Other'
          ? customTopic
            ? customTopic
            : 'Custom (not specified)'
          : selectedTopic)
    }
    let userPrompt = mode === 'prompt' ? aiPrompt.trim() : ''
    const isIeltsTask1 =
      exam.key === 'IELTS' && selectedTaskObj?.name?.toLowerCase()?.includes('task 1')

    let sysPrompt =
      `You're an expert English exam generator. Please generate ONLY the core writing question for a student, without any instructions, headings, or formatting.` +
      `\n${taskText}` +
      (topicText ? `\n${topicText}` : '') +
      (userPrompt ? `\nFocus: ${userPrompt}` : '') +
      // Critical new instruction:
      `\n\nIMPORTANT:
      - DO NOT include any exam instructions (time, word count, etc.)
      - DO NOT include headings like "Task 2" or "Writing Topic"
      - DO NOT include phrases like "Write about the following topic"
      - ONLY provide the core question content
      - For charts: include JSON data but keep question text minimal`

    // Custom instruction for VSTEP Task 1 (Letter)
    if (exam.key === 'VSTEP' && selectedTaskObj?.key === 'letter') {
      sysPrompt += `

CRITICAL:
For VSTEP "Formal Letter/Email" (Task 1), generate only authentic exam-style situations that require FORMAL, FUNCTIONAL, or INFORMATIONAL correspondence. Focus on topics such as making an inquiry, requesting information, complaining, organizing, giving advice, booking/reserving, clarifying, applying, or suggesting solutions.
- ***Each exam prompt must describe a scenario AND require the test taker to address exactly 3 specific content/tasks, presented as bullet points under the phrase: "In your letter:"*** (see examples below).

STRICTLY AVOID using apology, thank-you, lost-and-found or simple personal/social/polite letters unless those are directly relevant to a real formal or semi-formal writing test scenario. Do not produce exam prompts that are mainly about saying sorry, expressing thanks, or returning personal items.

Use these as exam-style examples:
Example 1:
You are planning to organize a workshop and need to contact a venue to make arrangements. Write a letter to the manager of the venue. In your letter:
• Describe what the workshop will be about.
• Ask for information about the facilities available at the venue.
• Mention the dates you are considering for the workshop.

Example 2:
You are planning to buy something online and have contacted the seller for more information.
Write a letter to the seller. In your letter:
• Describe the item you want to buy.
• Ask for more details about the item (e.g., size, color, condition).
• Inquire about the delivery process and any additional costs involved.

Example 3:
Jo wants to join a hockey club, but they exceed the required weight limit. Jo is asking for advice on what to do. Write a letter to Jo with your suggestions. In your letter:
• Give advice on whether Jo should join a fitness program.
• Recommend a suitable diet for Jo.
• Encourage Jo on how to achieve their goal.

Example 4:
You recently purchased an appliance that does not work properly. Write a letter to the store manager. In your letter:
• Describe the problem with the appliance.
• Explain what you have already done to fix it.
• State what action you would like the store to take.

The format must include a scenario and then "In your letter:" followed by 3 clear bullet points. Prioritize real-life formal, academic, workplace, or public situations and practical uses for English.`
    }

    // Custom instruction for VSTEP Task 2 (Essay)
    if (exam.key === 'VSTEP' && selectedTaskObj?.key === 'essay') {
      sysPrompt += `

CRITICAL:
When generating a VSTEP Task 2 (Essay) question, your output MUST:
- Begin with a topic framing statement, short introduction, or quote (1-3 sentences) to provide background or context, as in authentic exam questions.
- THEN add a new line and clearly prompt the student with a mandate, e.g., 'Write an essay to an educated reader to discuss...', OR ask to discuss both views and give your opinion, argue, give advantages/disadvantages, present causes/effects, suggest solutions, etc.
- You may use phrases like: 'Include reasons and any relevant examples to support your answer', or 'Discuss both sides and state your opinion.'

Use these as structure and style templates:
Example 1:
Online learning is a great, revolutionary alternative to traditional training.
Online learning is a form of distance learning that takes place over the Internet including online courses, exams, gamified quizzes, and certification training.
Some people believe that e-learning will replace traditional classes in the future.
Write an essay to an educated reader to discuss the advantages and disadvantages of online learning. Include reasons and any relevant examples to support your answer.

Example 2:
The increasing reliance on technology has eroded essential social skills. To what extent do you agree or disagree?

Example 3:
Several studies indicate that brain drain phenomenon has become a common trend in developing countries. It means that many developing countries continually lose a significant number of high-level educated workers, especially scientists, engineers, academics, and physicians, who decide to move and stay abroad in more developed countries in search of higher income and a better standard of living. It is believed that this phenomenon causes a huge financial loss to the home countries. Thus, it is important to the home countries to find the solution to overcome this problem immediately.
Write an essay to an educated reader to discuss the causes of brain drain and suggest several solutions to solve the problem.

Always provide at least one or two sentences of background/context. Avoid generating short, single-line prompts.`
    }

    if (isIeltsTask1) {
      sysPrompt += `
If the question is about CHART/GRAPH, CREATE and PROVIDE a suitable hypothetical chart for the task.
After generating the exam question, return the chart data as a JSON object for react-chartjs-2 (for example: {"chartType": "bar"|"pie"|"line", "chartData": {...}, "chartOptions": {...}}).
Write ONLY the main exam question for students first, then add the chart JSON in a Markdown code block (for example: \`\`\`json ... \`\`\`). If not a chart/graph, just give the question.`
    }
    return sysPrompt
  }

  function extractPreviewAndChart(raw: string): WritingPreviewData {
    const codeRegex = /```json\s*([\s\S]+?)```/i
    const match = raw.match(codeRegex)
    if (!match) {
      return { text: raw, chart: null }
    }
    let chart: ChartPreview | null = null
    try {
      chart = JSON.parse(match[1].trim())
    } catch (e) {
      chart = null
    }
    let text = raw.replace(codeRegex, '').trim()
    text = stripWritingPromptInstructions(text)
    return { text, chart }
  }

  const handleCreateExam = async (mode: 'prompt' | 'random') => {
    if (selectedTaskObj?.disabled) {
      setError('This task type is temporarily unavailable.')
      setCreated(false)
      setPreview(null)
      setLoading(false)
      return
    }
    setCreated(false)
    setLoading(true)
    setPreview(null)
    setError(null)
    try {
      const prompt = buildGeminiPrompt(mode)
      const apiKey = await GeminiService.getNextApiKey()
      if (!apiKey) {
        setError('No Gemini API key is configured. Please set it in the settings.')
        setLoading(false)
        return
      }
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }]
              }
            ]
          })
        }
      )
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData?.error?.message || `API error: ${response.status}`)
      }
      const data = await response.json()
      const message =
        data?.candidates?.[0]?.content?.parts?.map((p: { text: string }) => p.text).join('\n') ||
        data?.candidates?.[0]?.content?.text ||
        '(No response)'
      setPreview(extractPreviewAndChart(message))
      setCreated(true)
    } catch (err: any) {
      setError(
        'Failed to generate exam with Gemini API: ' +
          (err?.message || 'Unknown error, check your settings and network.')
      )
    } finally {
      setLoading(false)
    }
  }

  // --- Render ---
  if (evaluationMode && evaluationResult) {
    return (
      <WritingCheckerSection
        exam={sessionExam!}
        task={sessionTask!}
        preview={sessionPreview!}
        answer={answer}
        evaluation={evaluationResult}
        onRetry={handleRetry}
      />
    )
  }

  return doingMode && sessionExam && sessionTask && sessionPreview ? (
    <WritingDoingSection
      exam={sessionExam}
      task={sessionTask}
      preview={sessionPreview}
      onSubmit={handleEvaluateWriting}
      remaining={remainingTime}
      answer={answer}
      onChangeAnswer={setAnswer}
      canSubmit={canSubmit}
      suggestions={suggestions}
      wordCount={wordCount}
      minWords={minWords}
      evaluating={evaluating}
    />
  ) : (
    <WritingCreationSection
      examTypes={EXAM_TYPES}
      selectedExam={selectedExam}
      setSelectedExam={setSelectedExam}
      exam={exam}
      selectedTask={selectedTask}
      setSelectedTask={setSelectedTask}
      customTopic={customTopic}
      setCustomTopic={setCustomTopic}
      selectedTopic={selectedTopic}
      setSelectedTopic={setSelectedTopic}
      aiPrompt={aiPrompt}
      setAiPrompt={setAiPrompt}
      preview={preview}
      created={created}
      loading={loading}
      error={error}
      onCreateByPrompt={() => handleCreateExam('prompt')}
      onCreateRandom={() => handleCreateExam('random')}
      disableCreateByPrompt={!aiPrompt.trim() || loading}
      selectedTaskObj={selectedTaskObj}
      topics={topics}
      onClickStartExam={handleStartExam}
    />
  )
}

export default PracticeWritingPage

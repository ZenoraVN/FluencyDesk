import React, { useState } from 'react'
import WritingHistory from './components/WritingHistory'
import ExamAndTaskZone from './components/ExamAndTaskZone'
import TopicSelector from './components/TopicSelector'
import AiPromptInput from './components/AiPromptInput'
import ExamPreviewAndAction from './components/ExamPreviewAndAction'
import { GeminiService } from '../../../../service/GeminiService'

type ExamTypeKey = 'IELTS' | 'TOEIC' | 'TOEFL' | 'CEFR'

interface TaskType {
  key: string
  name: string
  description: string
  time: string
  words: string
  topics?: string[]
  disabled?: boolean
}

interface MyExamType {
  key: ExamTypeKey
  label: string
  info: string
  tasks: TaskType[]
}

const EXAM_TYPES: MyExamType[] = [
  {
    key: 'IELTS',
    label: 'IELTS',
    info: '2 task types',
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
    key: 'CEFR',
    label: 'CEFR',
    info: '3 task types',
    tasks: [
      {
        key: 'letter',
        name: 'Letter',
        description: 'Write a personal/work letter',
        time: '15 minutes',
        words: '~80 words',
        topics: undefined
      },
      {
        key: 'essay',
        name: 'Essay',
        description: 'Opinion essay on social topics',
        time: '25 minutes',
        words: '~150 words',
        topics: ['Environment', 'Culture', 'Business', 'Society']
      },
      {
        key: 'article',
        name: 'Article',
        description: 'Write an article for a newspaper or magazine',
        time: '25 minutes',
        words: '~150 words',
        topics: ['Technology', 'Culture', 'Health']
      }
    ]
  }
]

const PracticeWritingPage: React.FC = () => {
  const [selectedExam, setSelectedExam] = useState<ExamTypeKey>('IELTS')
  const exam = EXAM_TYPES.find((e) => e.key === selectedExam)!
  const [selectedTask, setSelectedTask] = useState(exam.tasks[0].key)
  const [customTopic, setCustomTopic] = useState('')
  const [selectedTopic, setSelectedTopic] = useState('Random')
  const [aiPrompt, setAiPrompt] = useState('')
  // CHART PREVIEW TYPES
  type ChartPreview = {
    chartType: string
    chartData: any
    chartOptions?: any
  }
  interface WritingPreviewData {
    text: string
    chart?: ChartPreview | null
  }
  // preview now stores question and chart (if any)
  const [preview, setPreview] = useState<WritingPreviewData | null>(null)
  const [created, setCreated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  React.useEffect(() => {
    setSelectedTask(EXAM_TYPES.find((e) => e.key === selectedExam)!.tasks[0].key)
  }, [selectedExam])

  React.useEffect(() => {
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

  // Enhanced Gemini Prompt for IELTS Task 1 with Chart JSON
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
      `You're an expert English exam generator. Please generate a practice writing task for a student, with realistic context and clear requirements.` +
      `\n${taskText}` +
      (topicText ? `\n${topicText}` : '') +
      (userPrompt ? `\nFocus: ${userPrompt}` : '')
    if (isIeltsTask1) {
      sysPrompt += `
If the question is about CHART/GRAPH, CREATE and PROVIDE a suitable hypothetical chart for the task.
After generating the exam question, return the chart data as a JSON object for react-chartjs-2 (for example Bar, Pie or Line chart: { "chartType": "bar"|"pie"|"line", "chartData": { "labels": [...], "datasets": [...] }, "chartOptions": {}}).
Write ONLY the exam question for students first, then add the chart JSON in a Markdown code block (for example: \`\`\`json ... \`\`\`). If not a chart/graph, just give the question.`
    }
    sysPrompt += `\nReturn ONLY the generated writing question as you would present it to a student.`
    return sysPrompt
  }

  // Helper: Extract preview and chart (if any) from Gemini response
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
    const text = raw.replace(codeRegex, '').trim()
    return { text, chart }
  }

  const handleCreateExam = async (mode: 'prompt' | 'random') => {
    // Prevent creation for disabled tasks
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
      // Use chart-aware extract helper
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

  return (
    <div className="flex flex-row h-screen gap-6 px-4 pt-4 pb-8 w-full max-w-full min-w-0 overflow-x-hidden">
      {/* Panel trái: scroll độc lập */}
      <div className="w-1/4 flex flex-col h-full overflow-y-auto overflow-x-hidden bg-background border-r pr-4 min-w-0 max-w-full">
        <WritingHistory />
        <div className="flex-1 mt-8 bg-background border rounded-xl flex items-center justify-center text-gray-400 text-md">
          (Statistics coming soon)
        </div>
      </div>
      {/* Panel phải: scroll độc lập */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto w-20">
        <div className="min-w-0 max-w-full">
          <ExamAndTaskZone
            examTypes={EXAM_TYPES}
            selectedExam={selectedExam}
            onSelectExam={setSelectedExam}
            tasks={exam.tasks}
            selectedTask={selectedTask}
            onSelectTask={setSelectedTask}
            selectedTaskObj={selectedTaskObj}
          />
        </div>
        {/* Chủ đề - chỉ hiện nếu task có topics */}
        {topics.length > 0 && (
          <TopicSelector
            topics={topics}
            selectedTopic={selectedTopic}
            onSelect={setSelectedTopic}
            customTopic={customTopic}
            setCustomTopic={setCustomTopic}
          />
        )}
        <AiPromptInput
          value={aiPrompt}
          onChange={setAiPrompt}
          onCreateByPrompt={() => handleCreateExam('prompt')}
          onCreateRandom={() => handleCreateExam('random')}
          disableCreateByPrompt={!aiPrompt.trim() || loading}
        />
        <div className="min-w-0 max-w-full">
          {loading && (
            <div className="flex items-center gap-2 mb-2 text-yellow-700 animate-pulse">
              <span className="animate-spin text-2xl">⏳</span>
              Generating exam with Gemini...
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-6 py-3 mb-4">
              {error}
            </div>
          )}
        </div>
        <ExamPreviewAndAction preview={preview} enabled={created && !loading && !error} />
      </div>
    </div>
  )
}

export default PracticeWritingPage

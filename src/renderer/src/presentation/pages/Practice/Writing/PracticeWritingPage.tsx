import React, { useState } from 'react'
import WritingHistory from './components/WritingHistory'
import ExamAndTaskZone from './components/ExamAndTaskZone'
import TopicSelector from './components/TopicSelector'
import AiPromptInput from './components/AiPromptInput'
import ExamPreviewAndAction from './components/ExamPreviewAndAction'

type ExamTypeKey = 'IELTS' | 'TOEIC' | 'TOEFL' | 'CEFR'

interface TaskType {
  key: string
  name: string
  description: string
  time: string
  words: string
  topics?: string[]
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
    info: '2 dạng bài',
    tasks: [
      {
        key: 'task1',
        name: 'Task 1 (Biểu đồ / Thư)',
        description: 'Viết thư hoặc báo cáo biểu đồ',
        time: '20 phút',
        words: '~150 từ',
        topics: undefined
      },
      {
        key: 'task2',
        name: 'Task 2 (Essay)',
        description: 'Essay argumentative/opinion',
        time: '40 phút',
        words: '~250 từ',
        topics: [
          'Môi trường',
          'Công nghệ',
          'Giáo dục',
          'Sức khỏe',
          'Xã hội',
          'Kinh doanh',
          'Du lịch',
          'Văn hóa'
        ]
      }
    ]
  },
  {
    key: 'TOEIC',
    label: 'TOEIC',
    info: '3 dạng bài',
    tasks: [
      {
        key: 'email',
        name: 'Viết Email',
        description: 'Viết email liên quan business/office',
        time: '15 phút',
        words: '~120 từ',
        topics: ['Kinh doanh', 'Xã hội', 'Văn hóa']
      },
      {
        key: 'essay',
        name: 'Viết Essay',
        description: 'Topic đa dạng về cuộc sống & công việc',
        time: '30 phút',
        words: '~150 từ',
        topics: ['Kinh doanh', 'Sức khỏe', 'Du lịch', 'Xã hội']
      },
      {
        key: 'letter',
        name: 'Thư thương mại',
        description: 'Soạn thư cho mục tiêu công việc',
        time: '20 phút',
        words: '~100 từ',
        topics: undefined
      }
    ]
  },
  {
    key: 'TOEFL',
    label: 'TOEFL',
    info: '2 dạng bài',
    tasks: [
      {
        key: 'independent',
        name: 'Independent Writing',
        description: 'Personal/Opinion Essay',
        time: '30 phút',
        words: '~300 từ',
        topics: ['Môi trường', 'Giáo dục', 'Xã hội', 'Du lịch']
      },
      {
        key: 'integrated',
        name: 'Integrated Writing',
        description: 'Kết hợp listening, reading, writing',
        time: '20 phút',
        words: '~150-225 từ',
        topics: undefined
      }
    ]
  },
  {
    key: 'CEFR',
    label: 'CEFR',
    info: '3 dạng bài',
    tasks: [
      {
        key: 'letter',
        name: 'Letter',
        description: 'Viết thư cá nhân/ công việc',
        time: '15 phút',
        words: '~80 từ',
        topics: undefined
      },
      {
        key: 'essay',
        name: 'Essay',
        description: 'Opinion essay các chủ đề xã hội',
        time: '25 phút',
        words: '~150 từ',
        topics: ['Môi trường', 'Văn hóa', 'Kinh doanh', 'Xã hội']
      },
      {
        key: 'article',
        name: 'Article',
        description: 'Viết bài cho báo hoặc tạp chí',
        time: '25 phút',
        words: '~150 từ',
        topics: ['Công nghệ', 'Văn hóa', 'Sức khỏe']
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
  const [preview, setPreview] = useState<string | null>(null)
  const [created, setCreated] = useState(false)

  React.useEffect(() => {
    setSelectedTask(EXAM_TYPES.find((e) => e.key === selectedExam)!.tasks[0].key)
  }, [selectedExam])

  React.useEffect(() => {
    setSelectedTopic('Random')
    setCustomTopic('')
    setAiPrompt('')
    setPreview(null)
    setCreated(false)
  }, [selectedTask, selectedExam])

  const selectedTaskObj = exam.tasks.find((t) => t.key === selectedTask)
  const topics = selectedTaskObj?.topics || []

  // Tạo đề
  const handleCreateExam = (mode: 'prompt' | 'random') => {
    setCreated(true)
    setPreview(
      mode === 'prompt'
        ? `Đề thi được tạo bằng AI theo yêu cầu: "${aiPrompt.trim()}".\n\n(Đây là bản xem trước đề. Nội dung sẽ tuỳ theo cấu hình thật.)`
        : `Đề thi ngẫu nhiên được tạo cho dạng "${selectedTaskObj?.name}" và chủ đề "${selectedTopic === 'Other' ? customTopic || '...' : selectedTopic}".\n\n(Đây là bản xem trước đề. Nội dung sẽ tuỳ theo cấu hình thật.)`
    )
  }

  return (
    <div className="flex flex-row h-screen gap-6 px-4">
      {/* Panel trái: scroll độc lập */}
      <div className="w-1/3 flex flex-col h-full overflow-y-auto bg-background border-r pr-4">
        <WritingHistory />
        <div className="flex-1 mt-8 bg-background border rounded-xl flex items-center justify-center text-gray-400 text-md">
          (Statistics coming soon)
        </div>
      </div>
      {/* Panel phải: scroll độc lập */}
      <div className="w-2/3 flex flex-col h-full overflow-y-auto">
        <div>
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
          <div className="bg-card border rounded-xl p-8 mb-4">
            <TopicSelector
              topics={topics}
              selectedTopic={selectedTopic}
              onSelect={setSelectedTopic}
              customTopic={customTopic}
              setCustomTopic={setCustomTopic}
            />
          </div>
        )}
        <AiPromptInput
          value={aiPrompt}
          onChange={setAiPrompt}
          onCreateByPrompt={() => handleCreateExam('prompt')}
          onCreateRandom={() => handleCreateExam('random')}
          disableCreateByPrompt={!aiPrompt.trim()}
        />
        <ExamPreviewAndAction preview={preview} enabled={created} />
      </div>
    </div>
  )
}

export default PracticeWritingPage

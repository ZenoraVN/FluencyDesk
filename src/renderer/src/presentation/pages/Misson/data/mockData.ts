export interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  status: 'notStarted' | 'inProgress' | 'completed' | 'cancelled'
  priority: 'high' | 'medium' | 'low'
  type: 'vocabulary' | 'grammar' | 'speaking' | 'writing' | 'listening' | 'reading'
  points: number
  streak?: number
}

export const tasks: Task[] = [
  // Past tasks
  {
    id: '1',
    title: 'Học 50 từ vựng chủ đề Business',
    description: 'Hoàn thành bài tập từ vựng về chủ đề kinh doanh',
    dueDate: '2025-04-25T15:00:00Z',
    status: 'notStarted',
    priority: 'high',
    type: 'vocabulary',
    points: 100
  },
  {
    id: '2',
    title: 'Luyện phát âm âm /θ/',
    description: 'Thực hành phát âm với 20 từ chứa âm /θ/',
    dueDate: '2025-04-22T10:00:00Z',
    status: 'completed',
    priority: 'medium',
    type: 'speaking',
    points: 75
  },
  {
    id: '3',
    title: 'Viết essay về Environmental Issues',
    description: 'Viết một bài luận 250 từ về vấn đề môi trường',
    dueDate: '2025-04-22T18:00:00Z',
    status: 'inProgress',
    priority: 'high',
    type: 'writing',
    points: 150
  },
  {
    id: '4',
    title: 'Grammar Quiz: Past Tenses',
    description: 'Làm bài kiểm tra về thì quá khứ',
    dueDate: '2025-04-22T14:00:00Z',
    status: 'cancelled',
    priority: 'medium',
    type: 'grammar',
    points: 80
  },
  // Today's tasks
  {
    id: '5',
    title: 'IELTS Listening Practice Test',
    description: 'Hoàn thành bài test Listening section 1 & 2',
    dueDate: '2025-04-23T14:00:00Z',
    status: 'notStarted',
    priority: 'high',
    type: 'listening',
    points: 100
  },
  {
    id: '6',
    title: 'Grammar Review: Conditionals',
    description: 'Ôn tập và làm bài tập về câu điều kiện',
    dueDate: '2025-04-23T16:00:00Z',
    status: 'inProgress',
    priority: 'medium',
    type: 'grammar',
    points: 80
  },
  {
    id: '7',
    title: 'Vocabulary: Technology Terms',
    description: 'Học từ vựng về công nghệ',
    dueDate: '2025-04-23T11:00:00Z',
    status: 'completed',
    priority: 'medium',
    type: 'vocabulary',
    points: 90
  },
  // Future tasks
  {
    id: '8',
    title: 'Reading Comprehension',
    description: 'Đọc và trả lời câu hỏi về bài đọc Academic',
    dueDate: '2025-04-24T09:00:00Z',
    status: 'notStarted',
    priority: 'high',
    type: 'reading',
    points: 120
  },
  {
    id: '9',
    title: 'Speaking Practice: Part 2',
    description: 'Luyện tập IELTS Speaking Part 2',
    dueDate: '2025-04-24T15:00:00Z',
    status: 'notStarted',
    priority: 'high',
    type: 'speaking',
    points: 100
  },
  {
    id: '10',
    title: 'Writing Task 1: Graph Description',
    description: 'Viết bài mô tả biểu đồ',
    dueDate: '2025-04-24T13:00:00Z',
    status: 'notStarted',
    priority: 'medium',
    type: 'writing',
    points: 90
  },
  {
    id: '11',
    title: 'Vocabulary: Academic Words',
    description: 'Học từ vựng học thuật',
    dueDate: '2025-04-25T10:00:00Z',
    status: 'notStarted',
    priority: 'medium',
    type: 'vocabulary',
    points: 85
  },
  {
    id: '12',
    title: 'Listening: Note Completion',
    description: 'Luyện tập kỹ năng ghi chú khi nghe',
    dueDate: '2025-04-25T14:00:00Z',
    status: 'notStarted',
    priority: 'high',
    type: 'listening',
    points: 110
  },
  {
    id: '13',
    title: 'Grammar: Reported Speech',
    description: 'Học và thực hành câu tường thuật',
    dueDate: '2025-04-25T16:00:00Z',
    status: 'notStarted',
    priority: 'medium',
    type: 'grammar',
    points: 95
  },
  {
    id: '14',
    title: 'Reading: Skimming & Scanning',
    description: 'Luyện kỹ năng đọc lướt và đọc quét',
    dueDate: '2025-04-26T11:00:00Z',
    status: 'notStarted',
    priority: 'high',
    type: 'reading',
    points: 100
  },
  {
    id: '15',
    title: 'Speaking: Pronunciation Focus',
    description: 'Tập trung vào phát âm các âm khó',
    dueDate: '2025-04-26T15:00:00Z',
    status: 'notStarted',
    priority: 'medium',
    type: 'speaking',
    points: 85
  },
  {
    id: '16',
    title: 'Writing: Essay Structure',
    description: 'Học cách cấu trúc bài luận',
    dueDate: '2025-04-26T13:00:00Z',
    status: 'notStarted',
    priority: 'high',
    type: 'writing',
    points: 120
  },
  {
    id: '17',
    title: 'Vocabulary: Collocations',
    description: 'Học các cụm từ thường gặp',
    dueDate: '2025-04-27T10:00:00Z',
    status: 'notStarted',
    priority: 'medium',
    type: 'vocabulary',
    points: 90
  },
  {
    id: '18',
    title: 'Listening: Multiple Choice',
    description: 'Luyện tập phần nghe trắc nghiệm',
    dueDate: '2025-04-27T14:00:00Z',
    status: 'notStarted',
    priority: 'high',
    type: 'listening',
    points: 100
  },
  {
    id: '19',
    title: 'Grammar: Advanced Tenses',
    description: 'Ôn tập các thì nâng cao',
    dueDate: '2025-04-27T16:00:00Z',
    status: 'notStarted',
    priority: 'medium',
    type: 'grammar',
    points: 110
  },
  {
    id: '20',
    title: 'Mock Test: Full IELTS',
    description: 'Làm bài thi thử IELTS hoàn chỉnh',
    dueDate: '2025-04-28T09:00:00Z',
    status: 'notStarted',
    priority: 'high',
    type: 'reading',
    points: 200
  }
]

export const achievements = [
  {
    id: '1',
    title: 'Chuỗi học tập',
    current: 7,
    target: 10,
    reward: 'Huy hiệu Siêng năng',
    points: 200
  },
  {
    id: '2',
    title: 'Từ vựng thông thạo',
    current: 450,
    target: 500,
    reward: 'Huy hiệu Từ điển sống',
    points: 300
  },
  {
    id: '3',
    title: 'Phát âm chuẩn',
    current: 85,
    target: 100,
    reward: 'Huy hiệu Phát âm chuẩn',
    points: 250
  }
]

export const dailyGoals = [
  {
    id: '1',
    title: 'Học từ vựng mới',
    current: 15,
    target: 20,
    points: 50,
    streak: 5
  },
  {
    id: '2',
    title: 'Luyện nghe',
    current: 2,
    target: 3,
    points: 30,
    streak: 3
  },
  {
    id: '3',
    title: 'Luyện nói',
    current: 1,
    target: 2,
    points: 40,
    streak: 2
  }
]

export const weeklyStats = {
  totalTasks: 15,
  completedTasks: 12,
  totalPoints: 850,
  averageAccuracy: 85,
  studyTime: '14h 30m',
  topSkill: 'Vocabulary'
}
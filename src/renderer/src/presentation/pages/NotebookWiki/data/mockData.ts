export interface Wiki {
  id: string
  term: string
  definition: string
  example: string
  pronunciation: string
  type: string
  level: 'new' | 'learning' | 'mastered'
  lastReviewed: string | null
  createdAt: string
  tags: string[]
}

export const notebookWikis: Wiki[] = [
  {
    id: 'w1',
    term: 'endeavor',
    definition: 'Try hard to do or achieve something',
    example: 'He endeavored to find a solution to the problem',
    pronunciation: '/ɪnˈdevər/',
    type: 'verb',
    level: 'learning',
    lastReviewed: '2024-04-22T15:30:00Z',
    createdAt: '2024-04-15T10:00:00Z',
    tags: ['Business', 'Formal']
  },
  {
    id: 'w2',
    term: 'meticulous',
    definition: 'Very careful and precise',
    example: 'She is meticulous in her work',
    pronunciation: '/məˈtɪkjələs/',
    type: 'adjective',
    level: 'mastered',
    lastReviewed: '2024-04-21T09:15:00Z',
    createdAt: '2024-04-14T14:30:00Z',
    tags: ['Academic', 'Character']
  },
  {
    id: 'w3',
    term: 'ubiquitous',
    definition: 'Present, appearing, or found everywhere',
    example: 'Mobile phones are ubiquitous in modern life',
    pronunciation: '/juːˈbɪkwɪtəs/',
    type: 'adjective',
    level: 'new',
    lastReviewed: null,
    createdAt: '2024-04-22T08:00:00Z',
    tags: ['Academic', 'Technology']
  }
]

export const wikiStats = {
  total: 156,
  new: 45,
  learning: 68,
  mastered: 43,
  lastStudied: '2024-04-22T20:00:00Z',
  studyStreak: 7,
  reviewAccuracy: 85
}

export const learningOptions = [
  {
    id: 'flashcards',
    title: 'Flashcards',
    description: 'Học với thẻ ghi nhớ',
    icon: 'LayersIcon',
    count: 15,
    duration: '10 phút'
  },
  {
    id: 'quiz',
    title: 'Quiz',
    description: 'Kiểm tra kiến thức',
    icon: 'BrainIcon',
    count: 20,
    duration: '15 phút'
  },
  {
    id: 'matching',
    title: 'Matching',
    description: 'Ghép từ với định nghĩa',
    icon: 'SplitSquareHorizontalIcon',
    count: 10,
    duration: '8 phút'
  },
  {
    id: 'writing',
    title: 'Writing',
    description: 'Luyện viết từ vựng',
    icon: 'PencilIcon',
    count: 12,
    duration: '12 phút'
  }
]

export const filterOptions = [
  { value: 'all', label: 'Tất cả' },
  { value: 'new', label: 'Chưa học' },
  { value: 'learning', label: 'Đang học' },
  { value: 'mastered', label: 'Đã thuộc' }
]

export const sortOptions = [
  { value: 'recent', label: 'Gần đây nhất' },
  { value: 'oldest', label: 'Cũ nhất' },
  { value: 'alphabetical', label: 'A-Z' },
  { value: 'level', label: 'Theo trình độ' }
]

export const tagSuggestions = [
  'Business',
  'Academic',
  'Technology',
  'Daily Life',
  'Formal',
  'Informal',
  'Idioms',
  'Phrasal Verbs'
]
export interface Notebook {
  id: string
  title: string
  description: string
  totalNotes: number
  lastUpdated: string
  color: string
  isShared?: boolean
}

export const myNotebooks: Notebook[] = [
  {
    id: '1',
    title: 'Business English',
    description: 'Vocabulary and phrases for business meetings and emails',
    totalNotes: 24,
    lastUpdated: '2 giờ trước',
    color: '#4A90E2'
  },
  {
    id: '2',
    title: 'IELTS Preparation',
    description: 'Important vocabulary and grammar for IELTS exam',
    totalNotes: 45,
    lastUpdated: '1 ngày trước',
    color: '#FF69B4'
  },
  {
    id: '3',
    title: 'Daily Conversations',
    description: 'Common phrases used in daily life',
    totalNotes: 18,
    lastUpdated: '3 ngày trước',
    color: '#3CB371'
  }
]

export const sharedNotebooks: Notebook[] = [
  {
    id: '4',
    title: 'TOEIC Grammar',
    description: 'Shared by Teacher John - Grammar rules and examples',
    totalNotes: 32,
    lastUpdated: '1 tuần trước',
    color: '#9370DB',
    isShared: true
  },
  {
    id: '5',
    title: 'Academic Writing',
    description: 'Shared by Anna - Essay structures and academic phrases',
    totalNotes: 28,
    lastUpdated: '2 tuần trước',
    color: '#FF7F50',
    isShared: true
  }
]
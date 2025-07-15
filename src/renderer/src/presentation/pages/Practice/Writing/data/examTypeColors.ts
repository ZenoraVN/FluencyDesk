// Centralized exam type color/icon mapping

export type ExamTypeKey = 'IELTS' | 'TOEIC' | 'TOEFL' | 'PTE' | 'VSTEP'

export const examTypeBorderColor: Record<ExamTypeKey, string> = {
  IELTS: '#1fa6e5', // blue
  TOEIC: '#e5a11f', // yellow/orange
  TOEFL: '#34b271', // green
  PTE: '#a855f7', // violet
  VSTEP: '#ff6363' // red/orange (adjust as fit)
}

export const examTypeIcon: Record<ExamTypeKey, string> = {
  IELTS: '🎓',
  TOEIC: '📊',
  TOEFL: '🎤',
  PTE: '🖥️',
  VSTEP: '🇻🇳'
}

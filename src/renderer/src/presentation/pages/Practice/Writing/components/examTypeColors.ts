// Centralized exam type color/icon mapping

export type ExamTypeKey = 'IELTS' | 'TOEIC' | 'TOEFL' | 'CEFR'

export const examTypeBorderColor: Record<ExamTypeKey, string> = {
  IELTS: '#1fa6e5', // blue
  TOEIC: '#e5a11f', // yellow/orange
  TOEFL: '#34b271', // green
  CEFR: '#9c3dff' // purple
}

export const examTypeIcon: Record<ExamTypeKey, string> = {
  IELTS: '🎓',
  TOEIC: '📊',
  TOEFL: '🎤',
  CEFR: '🏅'
}

export interface Notification {
  id: string
  type: 'system' | 'learning' | 'calendar' | 'personal' | 'task'
  title: string
  message: string
  time: string
  priority: 'high' | 'medium' | 'low'
  read: boolean
}

export interface Event {
  id: string
  title: string
  time: string
  date: string
  type: 'lesson' | 'test' | 'study'
}

export interface Task {
  id: string
  title: string
  deadline: string
  status: 'pending' | 'completed'
  priority: 'high' | 'medium' | 'low'
}

export const notifications: Notification[] = [
  {
    id: '1',
    type: 'system',
    title: 'Cập nhật ứng dụng mới',
    message: 'Phiên bản 2.0 đã sẵn sàng để cập nhật với nhiều tính năng mới',
    time: '5 phút trước',
    priority: 'high',
    read: false,
  },
  {
    id: '2',
    type: 'learning',
    title: 'Nhắc nhở học tập',
    message: 'Đã đến giờ luyện tập phát âm theo lịch của bạn',
    time: '10 phút trước',
    priority: 'medium',
    read: false,
  },
  {
    id: '3',
    type: 'calendar',
    title: 'Lịch học sắp tới',
    message: 'Buổi học Speaking với giáo viên Anna vào 15:00 hôm nay',
    time: '30 phút trước',
    priority: 'high',
    read: true,
  },
  {
    id: '4',
    type: 'personal',
    title: 'Tin nhắn mới',
    message: 'John đã gửi cho bạn một tin nhắn',
    time: '1 giờ trước',
    priority: 'low',
    read: false,
  },
  {
    id: '5',
    type: 'task',
    title: 'Deadline bài tập',
    message: 'Bài tập Writing Task 2 cần nộp trong vòng 2 giờ nữa',
    time: '2 giờ trước',
    priority: 'high',
    read: true,
  },
]

export const upcomingEvents: Event[] = [
  {
    id: '1',
    title: 'Speaking Practice',
    time: '15:00 - 16:00',
    date: 'Hôm nay',
    type: 'lesson',
  },
  {
    id: '2',
    title: 'IELTS Mock Test',
    time: '09:00 - 12:00',
    date: 'Ngày mai',
    type: 'test',
  },
  {
    id: '3',
    title: 'Grammar Review',
    time: '14:00 - 15:00',
    date: '25/04/2024',
    type: 'study',
  },
]

export const tasks: Task[] = [
  {
    id: '1',
    title: 'Writing Task 2',
    deadline: 'Hôm nay, 23:59',
    status: 'pending',
    priority: 'high',
  },
  {
    id: '2',
    title: 'Vocabulary Quiz',
    deadline: 'Ngày mai, 12:00',
    status: 'pending',
    priority: 'medium',
  },
  {
    id: '3',
    title: 'Reading Practice',
    deadline: '25/04/2024',
    status: 'completed',
    priority: 'low',
  },
]
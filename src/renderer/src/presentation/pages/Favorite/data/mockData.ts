import { courses } from '../../Home/data'

export const favoriteStats = {
  totalCompleted: 5,
  inProgress: 3,
  totalHours: 45,
  lastStudied: '2024-04-22T15:30:00Z'
}

// Simulate favorite courses with additional metadata
export const favoriteCourses = courses.slice(0, 3).map(course => ({
  ...course,
  progress: Math.floor(Math.random() * 100),
  lastAccessed: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
  notes: [
    'Remember to review lesson 3',
    'Practice speaking exercises',
    'Complete writing assignment'
  ],
  nextMilestone: {
    type: 'quiz',
    name: 'Unit 2 Assessment',
    dueDate: '2024-04-25T00:00:00Z'
  }
}))

export const recentActivities = [
  {
    id: 'act1',
    type: 'completion',
    courseId: favoriteCourses[0].id,
    courseName: favoriteCourses[0].title,
    detail: 'Completed Lesson 5: Business Communication',
    date: '2024-04-22T10:30:00Z'
  },
  {
    id: 'act2',
    type: 'achievement',
    courseId: favoriteCourses[1].id,
    courseName: favoriteCourses[1].title,
    detail: 'Earned "Speaking Pro" badge',
    date: '2024-04-21T15:45:00Z'
  },
  {
    id: 'act3',
    type: 'note',
    courseId: favoriteCourses[2].id,
    courseName: favoriteCourses[2].title,
    detail: 'Added new study note',
    date: '2024-04-20T09:15:00Z'
  }
]
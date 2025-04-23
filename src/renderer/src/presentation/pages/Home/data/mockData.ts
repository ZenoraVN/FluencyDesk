export const currentCoursesData = [
  {
    id: 'c1',
    title: 'Business English Communication',
    progress: 65,
    nextLesson: 'Email Writing Essentials',
    lastStudied: '2 hours ago',
    image: 'https://example.com/business-english.jpg'
  },
  {
    id: 'c2',
    title: 'IELTS Speaking Mastery',
    progress: 40,
    nextLesson: 'Part 2: Describing Experiences',
    lastStudied: '1 day ago',
    image: 'https://example.com/ielts-speaking.jpg'
  }
]

export const learningStatsData = {
  weeklyStudyTime: [
    { day: 'Mon', minutes: 45 },
    { day: 'Tue', minutes: 60 },
    { day: 'Wed', minutes: 30 },
    { day: 'Thu', minutes: 90 },
    { day: 'Fri', minutes: 45 },
    { day: 'Sat', minutes: 120 },
    { day: 'Sun', minutes: 60 }
  ],
  streak: 7,
  weeklyTotal: '7.5 hours',
  weeklyGoals: {
    completed: 5,
    total: 7
  }
}

export const dailyLearningData = [
  {
    id: 'd1',
    activity: 'Vocabulary Practice',
    timeEstimate: '15 mins',
    skill: 'Vocabulary',
    description: 'Review business terms and phrasal verbs'
  },
  {
    id: 'd2',
    activity: 'Listening Exercise',
    timeEstimate: '20 mins',
    skill: 'Listening',
    description: 'Practice with TED talk recordings'
  },
  {
    id: 'd3',
    activity: 'Speaking Challenge',
    timeEstimate: '10 mins',
    skill: 'Speaking',
    description: 'Daily pronunciation drills'
  }
]

export const newsUpdatesData = [
  {
    id: 'n1',
    type: 'feature',
    title: 'New AI Speaking Partner',
    description: 'Practice conversations with our new AI language partner',
    date: '2024-04-22'
  },
  {
    id: 'n2',
    type: 'course',
    title: 'Advanced Writing Course',
    description: 'New course on academic writing now available',
    date: '2024-04-21'
  },
  {
    id: 'n3',
    type: 'event',
    title: 'Weekend Speaking Club',
    description: 'Join our online speaking club this weekend',
    date: '2024-04-25'
  }
]

export const userProgressData = {
  todayLearned: 45, // minutes
  streakDays: 7,
  lastAchievement: 'Vocabulary Master',
  currentLevel: 'Intermediate'
}
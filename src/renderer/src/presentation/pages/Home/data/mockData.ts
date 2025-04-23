export const currentCoursesData = [
  {
    id: 'c1',
    title: 'Business English Communication',
    progress: 65,
    nextLesson: 'Email Writing Essentials',
    lastStudied: '2 hours ago',
    image: 'https://firebasestorage.googleapis.com/v0/b/saleso-426923.appspot.com/o/images%2Fecd281d7-432a-401a-8497-c05ae89418e2?alt=media&token=91e727e8-6fe3-44a9-ba8f-d81839e4c344'
  },
  {
    id: 'c2',
    title: 'IELTS Speaking Mastery',
    progress: 40,
    nextLesson: 'Part 2: Describing Experiences',
    lastStudied: '1 day ago',
    image: 'https://firebasestorage.googleapis.com/v0/b/saleso-426923.appspot.com/o/images%2Fecd281d7-432a-401a-8497-c05ae89418e2?alt=media&token=91e727e8-6fe3-44a9-ba8f-d81839e4c344'
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
  todayLearned: 45,
  streakDays: 7,
  currentLevel: 'Intermediate',
  totalVocabulary: 520,
  currentLesson: {
    id: 'l1',
    title: 'Email Writing Essentials',
    overview: 'Learn how to write professional business emails, including proper formatting, common phrases, and email etiquette.',
    duration: 30,
    course: 'Business English Communication',
    progress: 65,
    skills: ['Writing', 'Vocabulary', 'Grammar'],
    lastStudied: '2 hours ago',
    nextMilestone: 'Complete Practice Exercise 2',
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/saleso-426923.appspot.com/o/images%2Fecd281d7-432a-401a-8497-c05ae89418e2?alt=media&token=91e727e8-6fe3-44a9-ba8f-d81839e4c344'
  }
}
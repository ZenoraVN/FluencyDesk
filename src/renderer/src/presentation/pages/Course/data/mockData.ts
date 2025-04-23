export const courseDetail = {
  id: 'f4419c32-7e78-4e46-a889-348abefb0008',
  title: 'Business English Communication',
  overview: 'Master professional English communication skills for the modern workplace',
  band: 'Intermediate',
  image_urls: ['https://firebasestorage.googleapis.com/v0/b/saleso-426923.appspot.com/o/images%2F8928da7d-92ae-471b-ae2e-14ec589f6f01?alt=media&token=05920d15-4c9e-4c9b-96fe-fd5da5a33a84'],
  skills: ['Speaking', 'Writing', 'Listening', 'Grammar', 'Vocabulary'],
  progress: {
    completion: 0,
    lessonsCompleted: 0,
    questionsAnswered: 0,
    timeSpent: 0,
    lastAccessed: new Date().toISOString()
  },
  lessons: [
    {
      id: 'lesson-1',
      sequence: 1,
      title: 'Email Writing Essentials',
      overview: 'Learn to write clear and effective business emails',
      duration: 45,
      type: 'writing',
      questions: [
        {
          id: 'q1',
          type: 'multiple-choice',
          points: 10
        },
        {
          id: 'q2',
          type: 'writing',
          points: 20
        }
      ],
      resources: [
        {
          id: 'r1',
          type: 'pdf',
          title: 'Email Templates',
          url: 'https://example.com/templates.pdf'
        },
        {
          id: 'r2',
          type: 'video',
          title: 'Common Email Mistakes',
          duration: '10:30'
        }
      ]
    },
    {
      id: 'lesson-2',
      sequence: 2,
      title: 'Meeting Participation',
      overview: 'Develop skills for effective participation in business meetings',
      duration: 60,
      type: 'speaking',
      questions: [
        {
          id: 'q3',
          type: 'speaking',
          points: 30
        }
      ],
      resources: [
        {
          id: 'r3',
          type: 'audio',
          title: 'Meeting Phrases',
          duration: '15:00'
        }
      ]
    },
    {
      id: 'lesson-3',
      sequence: 3,
      title: 'Presentation Skills',
      overview: 'Learn to deliver impactful business presentations',
      duration: 90,
      type: 'speaking',
      questions: [
        {
          id: 'q4',
          type: 'recording',
          points: 40
        },
        {
          id: 'q5',
          type: 'multiple-choice',
          points: 10
        }
      ],
      resources: [
        {
          id: 'r4',
          type: 'video',
          title: 'Presentation Examples',
          duration: '20:00'
        },
        {
          id: 'r5',
          type: 'pdf',
          title: 'Slide Design Guide',
          url: 'https://example.com/slides.pdf'
        }
      ]
    }
  ],
  requirements: [
    'Basic English proficiency (A2 level or higher)',
    'Computer with microphone for speaking exercises',
    'Minimum 4-5 hours per week for study'
  ],
  objectives: [
    'Write professional business emails',
    'Participate confidently in meetings',
    'Deliver effective presentations',
    'Improve business vocabulary',
    'Enhance professional communication skills'
  ]
}
export const notebookStats = {
  totalNotebooks: 8,
  totalNotes: 245,
  lastCreated: '2024-04-22T10:30:00Z',
  lastStudied: '2024-04-23T08:15:00Z',
  studyStreak: 7,
  reviewAccuracy: 85
}

export const myNotebooks = [
  {
    id: 'n1',
    title: 'Business Vocabulary',
    description: 'Essential business terms, phrases, and expressions for professional communication',
    totalNotes: 85,
    color: '#4A90E2',
    lastUpdated: '2 giờ trước',
    isShared: true,
    stats: {
      mastered: 45,
      learning: 30,
      toReview: 10,
      accuracy: 88
    },
    categories: ['Business', 'Professional', 'Communication'],
    recentNotes: [
      {
        id: 'note1',
        term: 'market share',
        definition: 'The portion of a market controlled by a particular company or product',
        example: 'Our market share has increased by 15% this quarter'
      },
      {
        id: 'note2',
        term: 'stakeholder',
        definition: 'A person with an interest or concern in a business',
        example: 'We need to consider all stakeholders in this decision'
      }
    ]
  },
  {
    id: 'n2',
    title: 'IELTS Writing Phrases',
    description: 'Academic writing expressions and transition words for IELTS essays',
    totalNotes: 64,
    color: '#FF69B4',
    lastUpdated: '1 ngày trước',
    isShared: false,
    stats: {
      mastered: 40,
      learning: 20,
      toReview: 4,
      accuracy: 92
    },
    categories: ['Academic', 'IELTS', 'Writing'],
    recentNotes: [
      {
        id: 'note3',
        term: 'furthermore',
        definition: 'Used to add additional information or evidence',
        example: 'Furthermore, research shows that...'
      }
    ]
  },
  {
    id: 'n3',
    title: 'Phrasal Verbs',
    description: 'Common phrasal verbs used in daily conversations and business settings',
    totalNotes: 96,
    color: '#3CB371',
    lastUpdated: '3 ngày trước',
    isShared: true,
    stats: {
      mastered: 50,
      learning: 35,
      toReview: 11,
      accuracy: 85
    },
    categories: ['Grammar', 'Speaking', 'Daily Use'],
    recentNotes: [
      {
        id: 'note4',
        term: 'carry out',
        definition: 'To perform or conduct (a task)',
        example: 'We need to carry out more research'
      }
    ]
  }
]

export const sharedNotebooks = [
  {
    id: 'sn1',
    title: 'TOEIC Vocabulary',
    description: 'Essential vocabulary for TOEIC exam preparation',
    totalNotes: 120,
    color: '#9370DB',
    lastUpdated: '5 giờ trước',
    isShared: true,
    sharedBy: 'David Chen',
    stats: {
      mastered: 60,
      learning: 45,
      toReview: 15,
      accuracy: 82
    },
    categories: ['TOEIC', 'Exam Prep', 'Vocabulary'],
    recentNotes: [
      {
        id: 'note5',
        term: 'implement',
        definition: 'To put into effect; execute',
        example: 'The company will implement new policies next month'
      }
    ]
  }
]

export const studyReminders = [
  {
    id: 'r1',
    notebookId: 'n1',
    notebookTitle: 'Business Vocabulary',
    type: 'review',
    dueDate: '2024-04-24T10:00:00Z',
    totalTerms: 15
  },
  {
    id: 'r2',
    notebookId: 'n2',
    notebookTitle: 'IELTS Writing Phrases',
    type: 'practice',
    dueDate: '2024-04-23T15:00:00Z',
    totalTerms: 10
  }
]

export const recentActivities = [
  {
    id: 'a1',
    type: 'note_added',
    notebookId: 'n1',
    notebookTitle: 'Business Vocabulary',
    detail: 'Added 5 new terms',
    date: '2024-04-22T14:30:00Z'
  },
  {
    id: 'a2',
    type: 'review_completed',
    notebookId: 'n2',
    notebookTitle: 'IELTS Writing Phrases',
    detail: 'Completed review with 95% accuracy',
    date: '2024-04-22T10:15:00Z'
  },
  {
    id: 'a3',
    type: 'notebook_shared',
    notebookId: 'n3',
    notebookTitle: 'Phrasal Verbs',
    detail: 'Shared with study group',
    date: '2024-04-21T16:45:00Z'
  }
]
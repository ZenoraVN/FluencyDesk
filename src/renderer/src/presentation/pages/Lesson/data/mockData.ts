// Choice One Question Type
export interface ChoiceOneQuestion {
  id: string
  question: string
  explain: string
  options: {
    id: string
    isCorrect: boolean
    text: string
  }[]
}

// Fill in the Blank Question Type
export interface FillInTheBlankQuestion {
  id: string
  question: string
  answers: {
    id: string
    answer: string
    explain: string
  }[]
}

// Union type for all question types
export type Question = {
  type: 'choice_one'
  data: ChoiceOneQuestion
} | {
  type: 'fill_in_the_blank'
  data: FillInTheBlankQuestion
}

export const mockLesson = {
  id: 'lesson-1',
  title: 'Basic Grammar - Lesson 1',
  subtitle: 'Present Simple Tense',
  progress: 60,
  currentQuestionIndex: 0,
  questions: [
    {
      type: 'choice_one' as const,
      data: {
        id: 'q1',
        question: 'Which sentence correctly uses the Present Simple tense?',
        explain: 'The Present Simple is used for regular actions and general truths.',
        options: [
          {
            id: 'opt1',
            isCorrect: true,
            text: 'She works in a bank.'
          },
          {
            id: 'opt2',
            isCorrect: false,
            text: 'She working in a bank.'
          },
          {
            id: 'opt3',
            isCorrect: false,
            text: 'She is works in a bank.'
          },
          {
            id: 'opt4',
            isCorrect: false,
            text: 'She work in a bank.'
          }
        ]
      }
    },
    {
      type: 'fill_in_the_blank' as const,
      data: {
        id: 'q2',
        question: 'Complete the sentence: The sun ____ in the east.',
        answers: [
          {
            id: 'ans1',
            answer: 'rises',
            explain: 'We use "rises" because it\'s a general truth in Present Simple.'
          }
        ]
      }
    },
    {
      type: 'choice_one' as const,
      data: {
        id: 'q3',
        question: 'When do we use the Present Simple tense?',
        explain: 'Present Simple is used for habits, routines, and facts.',
        options: [
          {
            id: 'opt1',
            isCorrect: true,
            text: 'For regular actions and general truths'
          },
          {
            id: 'opt2',
            isCorrect: false,
            text: 'Only for actions happening now'
          },
          {
            id: 'opt3',
            isCorrect: false,
            text: 'For past events'
          },
          {
            id: 'opt4',
            isCorrect: false,
            text: 'Only for future plans'
          }
        ]
      }
    }
  ] as Question[],
  content: {
    introduction: `The present simple tense is used to talk about regular actions, facts, habits, and general truths.`,
    examples: [
      'I play tennis every weekend.',
      'She works in a bank.',
      'The sun rises in the east.'
    ],
    keyPoints: [
      'Used for regular actions and habits',
      'Used for general truths and facts',
      'Used for schedules and timetables',
      'Third person singular adds -s/-es'
    ]
  }
}
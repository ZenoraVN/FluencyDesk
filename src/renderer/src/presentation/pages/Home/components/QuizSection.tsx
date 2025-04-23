import { useState } from 'react'

interface Option {
  id: string
  text: string
  isCorrect: boolean
  explanation: string
}

interface MultipleChoiceQuestion {
  id: string
  type: 'multiple-choice'
  question: string
  options: Option[]
}

interface FillInBlankQuestion {
  id: string
  type: 'fill-in-blank'
  question: string
  blanks: {
    id: string
    answer: string
    explanation: string
  }[]
}

type Question = MultipleChoiceQuestion | FillInBlankQuestion

// Mock data - Replace with actual API data later
const mockQuestions: Question[] = [
  {
    id: '1',
    type: 'multiple-choice',
    question: 'Which word means "to make something better"?',
    options: [
      {
        id: 'a',
        text: 'Improve',
        isCorrect: true,
        explanation: '"Improve" means to make something better or enhance its quality.'
      },
      {
        id: 'b',
        text: 'Decline',
        isCorrect: false,
        explanation: '"Decline" means to decrease or become worse.'
      },
      {
        id: 'c',
        text: 'Maintain',
        isCorrect: false,
        explanation: '"Maintain" means to keep something in its current state.'
      },
      {
        id: 'd',
        text: 'Ignore',
        isCorrect: false,
        explanation: '"Ignore" means to pay no attention to something.'
      }
    ]
  },
  {
    id: '2',
    type: 'fill-in-blank',
    question: 'Complete the sentence: "She _____ to the store yesterday."',
    blanks: [
      {
        id: 'blank1',
        answer: 'went',
        explanation: 'The past tense of "go" is "went".'
      }
    ]
  }
]

const QuizSection = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [blankAnswer, setBlankAnswer] = useState('')

  const currentQuestion = mockQuestions[currentQuestionIndex]

  const handleOptionClick = (optionId: string) => {
    setSelectedOption(optionId)
    setShowExplanation(true)
  }

  const handleBlankSubmit = () => {
    setSelectedOption(blankAnswer.toLowerCase().trim())
    setShowExplanation(true)
  }

  const handleNextQuestion = () => {
    setSelectedOption(null)
    setShowExplanation(false)
    setBlankAnswer('')
    setCurrentQuestionIndex((prev) => 
      prev < mockQuestions.length - 1 ? prev + 1 : 0
    )
  }

  const getOptionStyle = (option: Option) => {
    if (!selectedOption) return ''
    if (option.id === selectedOption) {
      return option.isCorrect ? 'border-b-2 border-green-500' : 'border-b-2 border-red-500'
    }
    if (option.isCorrect) return 'border-b-2 border-green-500'
    return ''
  }

  const renderMultipleChoice = (question: MultipleChoiceQuestion) => (
    <div className="space-y-3">
      {question.options.map((option) => (
        <button
          key={option.id}
          onClick={() => handleOptionClick(option.id)}
          disabled={!!selectedOption}
          className={`w-full py-2 px-3 text-left transition-all duration-200 
            ${getOptionStyle(option)}
            ${!selectedOption && 'hover:border-b-2 hover:border-[#52aaa5]'}
            ${selectedOption ? 'cursor-default' : 'cursor-pointer'}
          `}
        >
          <span className="font-medium text-gray-800">{option.text}</span>
        </button>
      ))}
    </div>
  )

  const renderFillInBlank = (question: FillInBlankQuestion) => (
    <div className="space-y-3">
      <input
        type="text"
        value={blankAnswer}
        onChange={(e) => setBlankAnswer(e.target.value)}
        disabled={!!selectedOption}
        placeholder="Type your answer..."
        className={`w-full border-b py-2 px-3 outline-none transition-all duration-200
          ${selectedOption === question.blanks[0].answer.toLowerCase() ? 'border-b-2 border-green-500' : ''}
          ${selectedOption && selectedOption !== question.blanks[0].answer.toLowerCase() ? 'border-b-2 border-red-500' : ''}
          ${!selectedOption ? 'border-gray-200 focus:border-b-2 focus:border-[#52aaa5]' : ''}
        `}
      />
      {!selectedOption && (
        <button
          onClick={handleBlankSubmit}
          className="w-full border-b-2 border-[#52aaa5] py-1.5 px-3 font-medium text-[#52aaa5] transition-all duration-200 hover:bg-[#52aaa5] hover:text-white"
        >
          Check Answer
        </button>
      )}
    </div>
  )

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold text-[#2D3748]">Quick Quiz</h2>
      
      <div className="border rounded-lg p-4">
        <p className="text-lg text-gray-700 mb-4">{currentQuestion.question}</p>
        
        {currentQuestion.type === 'multiple-choice' 
          ? renderMultipleChoice(currentQuestion)
          : renderFillInBlank(currentQuestion)
        }

        {showExplanation && (
          <div className="mt-3 text-sm text-gray-600">
            <p className="font-medium text-gray-800">Explanation:</p>
            <p>
              {currentQuestion.type === 'multiple-choice'
                ? currentQuestion.options.find(opt => opt.id === selectedOption)?.explanation
                : currentQuestion.blanks[0].explanation
              }
            </p>
          </div>
        )}

        {selectedOption && (
          <button
            onClick={handleNextQuestion}
            className="mt-3 w-full px-3 py-1.5 font-medium text-[#52aaa5] transition-all duration-200 border-b-2 border-[#52aaa5] hover:text-white hover:bg-[#52aaa5]"
          >
            Next Question
          </button>
        )}
      </div>
    </div>
  )
}

export default QuizSection
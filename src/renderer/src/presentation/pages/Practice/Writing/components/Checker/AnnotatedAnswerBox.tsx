import React from 'react'
import { WritingError } from '../../PracticeWritingPage'

/**
 * ERR wrapper component to represent an error marker with id and type.
 * This component simply renders its children and allows JSX intrinsic typing.
 */
const ERR: React.FC<{ id: number; type: string; children: React.ReactNode }> = ({ children }) => (
  <>{children}</>
)

interface AnnotatedAnswerBoxProps {
  answer: string
  errors: WritingError[]
  activeErrorId: number | null
  onErrorClick: (errorId: number) => void
}

const getErrorColor = (type: string): string => {
  switch (type) {
    case 'spelling':
      return '#ef4444'
    case 'grammar':
      return '#f97316'
    case 'vocabulary':
      return '#0ea5e9'
    case 'sentence':
      return '#8b5cf6'
    default:
      return '#64748b'
  }
}

export const AnnotatedAnswerBox: React.FC<AnnotatedAnswerBoxProps> = ({
  answer,
  errors,
  activeErrorId,
  onErrorClick
}) => {
  const renderAnnotatedText = (): React.ReactNode[] => {
    if (!answer) {
      return [
        <span key="no-answer" className="text-gray-500 italic">
          No answer to display.
        </span>
      ]
    }

    const sortedErrors = [...errors].sort((a, b) => a.startPos - b.startPos)
    const parts: React.ReactNode[] = []
    let lastIndex = 0

    sortedErrors.forEach((error) => {
      if (error.startPos > lastIndex) {
        parts.push(
          <span key={`pre-${error.id}`}>{answer.substring(lastIndex, error.startPos)}</span>
        )
      }

      parts.push(
        <ERR id={error.id} type={error.type} key={`err-${error.id}`}>
          <span
            className={`inline-block relative cursor-pointer border-b-2 hover:border-b-4 ${
              activeErrorId === error.id ? 'ring-2 ring-offset-1' : ''
            }`}
            style={{
              borderColor: getErrorColor(error.type),
              borderBottomStyle: 'dashed'
            }}
            onClick={() => onErrorClick(error.id)}
            title={`${error.type} error - Click for details`}
          >
            {answer.substring(error.startPos, error.endPos)}
            <span
              className="absolute -top-2 -right-2 w-4 h-4 rounded-full text-xs flex items-center justify-center text-white"
              style={{ backgroundColor: getErrorColor(error.type) }}
            >
              {error.type.charAt(0).toUpperCase()}
            </span>
          </span>
        </ERR>
      )

      lastIndex = error.endPos
    })

    if (lastIndex < answer.length) {
      parts.push(<span key="last-part">{answer.substring(lastIndex)}</span>)
    }

    return parts
  }

  return (
    <div>
      <h3 className="font-semibold text-lg mb-2 flex items-center">
        <span className="text-blue-600 mr-2">&#9998;</span>
        Your Answer with AI Corrections
      </h3>
      <div className="whitespace-pre-line leading-relaxed break-words text-gray-900">
        {renderAnnotatedText()}
      </div>
    </div>
  )
}

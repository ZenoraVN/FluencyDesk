import React from 'react'
import type { WritingError } from '../../types'

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

    // Dynamically compute error positions in the answer text
    const displayErrors: WritingError[] = errors

    const parts: React.ReactNode[] = []
    let lastIndex = 0
    displayErrors.forEach((error) => {
      const { id, type, original } = error
      // find the next occurrence of this error text
      const startPos = answer.indexOf(original, lastIndex)
      if (startPos === -1) return
      const endPos = startPos + original.length
      const fragment = original

      if (startPos > lastIndex) {
        parts.push(<span key={`pre-${id}`}>{answer.slice(lastIndex, startPos)}</span>)
      }

      parts.push(
        <span
          key={`err-${id}`}
          className="inline-block cursor-pointer border-b-2 border-solid"
          style={{
            borderColor: getErrorColor(type),
            borderBottomStyle: 'solid'
          }}
          onClick={() => onErrorClick(id)}
          title={`${type} error - Click for details`}
        >
          {fragment}
        </span>
      )
      lastIndex = endPos
    })

    if (lastIndex < answer.length) {
      parts.push(<span key="last-part">{answer.slice(lastIndex)}</span>)
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

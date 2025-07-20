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
// Normalize types like "word-level spelling" to "spelling"
const normalizeType = (type: string): string =>
  type.startsWith('word-level ') ? type.replace('word-level ', '') : type

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

    // Use start/end positions provided by the evaluation result
    const displayErrors = errors.filter(
      (e) => e.startPos != null && e.endPos != null && e.startPos >= 0
    )

    // Group errors by position to prevent overlapping highlights
    const errorGroups: Map<string, WritingError[]> = new Map()
    displayErrors.forEach((error) => {
      const key = `${error.startPos}-${error.endPos}`
      if (!errorGroups.has(key)) {
        errorGroups.set(key, [])
      }
      errorGroups.get(key)!.push(error)
    })

    const parts: React.ReactNode[] = []
    let lastIndex = 0

    // Convert to array and sort by start position
    const sortedGroups = Array.from(errorGroups.entries())
      .map(([key, errors]) => ({
        startPos: parseInt(key.split('-')[0], 10),
        endPos: parseInt(key.split('-')[1], 10),
        errors
      }))
      .sort((a, b) => a.startPos - b.startPos)

    sortedGroups.forEach((group) => {
      const { startPos, endPos, errors } = group

      if (startPos > lastIndex) {
        parts.push(<span key={`pre-${startPos}`}>{answer.slice(lastIndex, startPos)}</span>)
      }

      // Determine the most severe error type for styling
      const primaryError = errors.reduce((prev, current) =>
        ['sentence', 'vocabulary', 'grammar', 'spelling'].indexOf(current.type) <
        ['sentence', 'vocabulary', 'grammar', 'spelling'].indexOf(prev.type)
          ? current
          : prev
      )

      const isActive = errors.some((e) => e.id === activeErrorId)

      // Normalize error type string for coloring/mapping
      const cleanType = normalizeType(primaryError.type)

      parts.push(
        <span
          key={`err-${startPos}`}
          className="inline-block cursor-pointer border-b-2 border-solid"
          style={{
            borderColor: getErrorColor(cleanType),
            backgroundColor: isActive ? `${getErrorColor(cleanType)}33` : 'transparent'
          }}
          onClick={() => onErrorClick(primaryError.id)}
          title={`${
            errors.length > 1 ? 'Multiple errors' : primaryError.type
          } error - Click for details`}
        >
          {answer.slice(startPos, endPos)}
          {isActive &&
            errors.map((error) => (
              <span
                key={`corr-${error.id}`}
                className="bg-green-100 text-green-800 px-1 ml-1 rounded"
              >
                {error.corrected}
              </span>
            ))}
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

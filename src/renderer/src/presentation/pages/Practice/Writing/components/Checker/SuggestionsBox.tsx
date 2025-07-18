import React, { useState } from 'react'
import { WritingError } from '../../PracticeWritingPage'

// Helper to get color for error type
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

interface SuggestionsBoxProps {
  errors: WritingError[]
  activeErrorId: number | null
  onSuggestionClick: (errorId: number) => void
}

export const SuggestionsBox: React.FC<SuggestionsBoxProps> = ({
  errors,
  activeErrorId,
  onSuggestionClick
}) => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-1">
        <h3 className="font-semibold text-lg">Suggestions</h3>
        <button
          onClick={() => setIsOpen((o) => !o)}
          className="ml-2 text-gray-500 hover:text-gray-800 transition-colors p-1 rounded"
          type="button"
          aria-label={isOpen ? 'Hide suggestions' : 'Show suggestions'}
        >
          <svg
            className={`w-5 h-5 duration-200 transition-transform ${isOpen ? 'rotate-90' : 'rotate-0'}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      {isOpen && (
        <div className="space-y-4 mt-2 max-h-[400px] overflow-y-auto">
          {errors.length > 0 ? (
            errors.map((e) => (
              <div
                id={`suggestion-${e.id}`}
                key={e.id}
                className={`border-t pt-2 cursor-pointer transition-all ${
                  activeErrorId === e.id
                    ? 'bg-blue-50 border-l-4 border-blue-500 pl-3'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => onSuggestionClick(e.id)}
              >
                <div className="flex items-start">
                  <span
                    className="w-6 h-6 rounded-full text-xs flex items-center justify-center text-white mr-2 mt-1"
                    style={{ backgroundColor: getErrorColor(e.type) }}
                  >
                    {e.type.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <div>
                      <span className="font-medium">Original:</span>{' '}
                      <span className="italic">{e.original}</span>
                    </div>
                    {e.original !== e.corrected && (
                      <div>
                        <span className="font-medium text-green-800">Suggestion:</span>{' '}
                        <span className="italic">{e.corrected}</span>
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Explanation:</span>{' '}
                      <span className="text-gray-600">{e.explanation}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500">No suggestions available.</div>
          )}
        </div>
      )}
    </div>
  )
}

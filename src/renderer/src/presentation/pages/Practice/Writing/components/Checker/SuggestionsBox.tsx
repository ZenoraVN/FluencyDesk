import React, { useState } from 'react'
import type { WritingError } from '../../types'
import { SpellCheck, AlertCircle, BookOpen, FileText } from 'lucide-react'

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
          {Array.isArray(errors) && errors.length > 0 ? (
            errors.map((e) => {
              const isActive = activeErrorId === e.id
              return (
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
                    <div className="flex items-start space-x-3">
                      <div
                        className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded bg-opacity-20"
                        style={{ backgroundColor: `${getErrorColor(e.type)}33` }}
                      >
                        {{
                          spelling: <SpellCheck color={getErrorColor(e.type)} />,
                          grammar: <AlertCircle color={getErrorColor(e.type)} />,
                          vocabulary: <BookOpen color={getErrorColor(e.type)} />,
                          sentence: <FileText color={getErrorColor(e.type)} />
                        }[e.type] || <AlertCircle color={getErrorColor(e.type)} />}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-500 text-sm capitalize">{e.type} error</p>
                        <p className="font-medium italic">{e.original}</p>
                        {e.original !== e.corrected && (
                          <p className="mt-1 text-green-800 italic">{e.corrected}</p>
                        )}
                        {isActive &&
                          errors
                            .filter((err) => err.original === e.original)
                            .map((err) => (
                              <div key={`detail-${err.id}`} className="mt-1">
                                <div className="font-medium text-sm capitalize">
                                  {err.type} error
                                </div>
                                <div className="mt-1 p-2 bg-blue-100 rounded-md">
                                  <span className="font-medium">Reason:</span>{' '}
                                  <span className="text-gray-700">{err.explanation}</span>
                                </div>
                              </div>
                            ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-gray-500">No suggestions available.</div>
          )}
        </div>
      )}
    </div>
  )
}

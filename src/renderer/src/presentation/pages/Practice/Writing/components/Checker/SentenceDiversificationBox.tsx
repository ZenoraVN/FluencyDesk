import React, { useState } from 'react'
import { SentenceDiversification } from '../../PracticeWritingPage'

interface SentenceDiversificationBoxProps {
  diversifications: SentenceDiversification[]
}

/**
 * Displays AI's sentence diversification suggestions. Expand/collapse supported.
 */
export const SentenceDiversificationBox: React.FC<SentenceDiversificationBoxProps> = ({
  diversifications
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-1">
        <h3 className="font-semibold text-lg">Sentence Diversification</h3>
        <button
          onClick={() => setIsOpen((o) => !o)}
          aria-label={isOpen ? 'Hide suggestions' : 'Show suggestions'}
          className="ml-2 text-gray-500 hover:text-gray-800 transition-colors p-1 rounded"
          type="button"
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
        <>
          <div className="mt-2" />
          {(diversifications?.length === 0 || !diversifications) && (
            <div className="text-gray-500">No alternate sentences suggested.</div>
          )}
          <div className="space-y-3">
            {diversifications.map((s, idx) => (
              <div key={idx} className="p-2 rounded bg-purple-50 mb-1">
                <div className="font-medium">Original:</div>
                <div className="text-gray-700 text-sm mb-1">{s.original}</div>
                <div className="font-medium mt-1">Improved:</div>
                <div className="text-green-700 text-sm mb-1">{s.improved}</div>
                <div className="text-xs text-gray-500 italic">{s.explanation}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

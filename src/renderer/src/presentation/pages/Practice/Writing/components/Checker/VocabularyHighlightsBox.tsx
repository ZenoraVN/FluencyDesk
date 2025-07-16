import React, { useState } from 'react'
import { VocabularyHighlight } from '../../PracticeWritingPage'

interface VocabularyHighlightsBoxProps {
  vocabulary: VocabularyHighlight[]
}

/**
 * Shows a table/card list of AI picked vocabulary highlights, with expand/collapse.
 */
export const VocabularyHighlightsBox: React.FC<VocabularyHighlightsBoxProps> = ({ vocabulary }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-1">
        <h3 className="font-semibold text-lg">Vocabulary Highlights</h3>
        <button
          onClick={() => setIsOpen((o) => !o)}
          aria-label={isOpen ? 'Hide highlights' : 'Show highlights'}
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
          {(vocabulary?.length === 0 || !vocabulary) && (
            <div className="text-gray-500">No highlighted vocabulary.</div>
          )}
          <div className="space-y-3">
            {vocabulary.map((v, idx) => (
              <div key={idx} className="p-2 rounded bg-blue-50 mb-1">
                <div className="font-semibold text-blue-600">{v.word}</div>
                <div className="text-gray-700 text-sm mb-1">
                  <span className="font-medium">Meaning:</span> {v.meaning}
                </div>
                <div className="text-xs text-gray-500 italic">Example: {v.example}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

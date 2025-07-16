import React, { useState } from 'react'
import { SampleEssay } from '../../PracticeWritingPage'

interface SampleEssaysBoxProps {
  samples: SampleEssay[]
}

/**
 * Provides model essays at "intermediate" and "advanced" levels, with collapse/expand toggle.
 */
export const SampleEssaysBox: React.FC<SampleEssaysBoxProps> = ({ samples }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-1">
        <h3 className="font-semibold text-lg">Sample Essays</h3>
        <button
          onClick={() => setIsOpen((o) => !o)}
          aria-label={isOpen ? 'Hide samples' : 'Show samples'}
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
          {(samples?.length === 0 || !samples) && (
            <div className="text-gray-500">No samples available.</div>
          )}
          <div className="space-y-4">
            {samples.map((s, idx) => (
              <div key={idx} className="mb-2">
                <div className="flex items-center mb-1">
                  <span
                    className={`font-semibold px-2 py-0.5 rounded text-xs
                  ${s.level === 'advanced' ? 'bg-green-600 text-white' : 'bg-yellow-500 text-black'}`}
                  >
                    {s.level.charAt(0).toUpperCase() + s.level.slice(1)}
                  </span>
                  <span className="ml-2 text-gray-600 text-sm">Model Essay</span>
                </div>
                <div className="bg-gray-50 p-2 rounded shadow-inner whitespace-pre-line text-gray-900 text-[14px]">
                  {s.content}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

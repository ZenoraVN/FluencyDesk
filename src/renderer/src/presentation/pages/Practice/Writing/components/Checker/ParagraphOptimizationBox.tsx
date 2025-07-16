import React, { useState } from 'react'
import { ParagraphOptimization } from '../../PracticeWritingPage'

interface ParagraphOptimizationBoxProps {
  optimizations: ParagraphOptimization[]
}

/**
 * Shows AI's paragraph-by-paragraph feedback and optimization.
 * Now with expand/collapse (default collapsed), toggle icon top right.
 */
export const ParagraphOptimizationBox: React.FC<ParagraphOptimizationBoxProps> = ({
  optimizations
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-1">
        <h3 className="font-semibold text-lg">Paragraph Optimization</h3>
        <button
          onClick={() => setIsOpen((o) => !o)}
          aria-label={isOpen ? 'Hide details' : 'Show details'}
          className="ml-2 text-gray-500 hover:text-gray-800 transition-colors p-1 rounded"
          type="button"
        >
          {/* Chevron icon: rotates if open */}
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
          {(optimizations?.length === 0 || !optimizations) && (
            <div className="text-gray-500">No specific suggestions available.</div>
          )}
          <div className="space-y-4">
            {optimizations.map((opt, idx) => (
              <div key={idx} className="border-b pb-3 last:border-b-0 last:pb-0">
                <div className="flex items-center font-medium mb-1 gap-2">
                  <span>Paragraph {opt.paragraphIndex}</span>
                  {opt.paragraphType && (
                    <span
                      className={
                        'inline-block px-2 py-0.5 rounded text-xs font-semibold bg-opacity-20 ' +
                        (opt.paragraphType === 'introduction'
                          ? 'bg-blue-400 text-blue-700'
                          : opt.paragraphType === 'body'
                            ? 'bg-teal-400 text-teal-700'
                            : 'bg-violet-400 text-violet-700')
                      }
                    >
                      {opt.paragraphType.charAt(0).toUpperCase() + opt.paragraphType.slice(1)}
                    </span>
                  )}
                </div>
                <div className="text-sm bg-yellow-50 p-2 rounded mb-2">
                  <div className="font-medium">Original:</div>
                  <p>{opt.original}</p>
                </div>
                <div className="text-sm bg-green-50 p-2 rounded mb-2">
                  <div className="font-medium">Optimized:</div>
                  <p>{opt.optimized}</p>
                </div>
                <div className="text-xs text-gray-600 mb-1">{opt.explanation}</div>
                {opt.errors && opt.errors.length > 0 && (
                  <div className="mt-2">
                    <div className="font-semibold text-xs text-rose-700 mb-1">
                      Problems & Suggestions:
                    </div>
                    <ul className="space-y-2 pl-2">
                      {opt.errors.map((err, i) => (
                        <li key={i} className="bg-rose-50 p-2 rounded text-xs">
                          <div>
                            <span className="font-medium text-red-800">Original:</span>{' '}
                            <span className="italic">{err.original}</span>
                          </div>
                          {err.original !== err.suggestion && (
                            <div>
                              <span className="font-medium text-green-800">Suggestion:</span>{' '}
                              <span className="italic">{err.suggestion}</span>
                            </div>
                          )}
                          <div className="text-gray-600">{err.explanation}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

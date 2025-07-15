import React from 'react'
import { SampleEssay } from '../../PracticeWritingPage'

interface SampleEssaysBoxProps {
  samples: SampleEssay[]
}

/**
 * Provides model essays at "intermediate" and "advanced" levels.
 */
export const SampleEssaysBox: React.FC<SampleEssaysBoxProps> = ({ samples }) => (
  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
    <h3 className="font-semibold text-lg mb-3">Sample Essays</h3>
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
  </div>
)

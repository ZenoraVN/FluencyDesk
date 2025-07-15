import React from 'react'
import { SentenceDiversification } from '../../PracticeWritingPage'

interface SentenceDiversificationBoxProps {
  diversifications: SentenceDiversification[]
}

/**
 * Displays AI's sentence diversification suggestions.
 */
export const SentenceDiversificationBox: React.FC<SentenceDiversificationBoxProps> = ({
  diversifications
}) => (
  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
    <h3 className="font-semibold text-lg mb-3">Sentence Diversification</h3>
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
  </div>
)

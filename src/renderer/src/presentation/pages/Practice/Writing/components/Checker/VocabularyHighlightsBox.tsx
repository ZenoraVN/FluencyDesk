import React from 'react'
import { VocabularyHighlight } from '../../PracticeWritingPage'

interface VocabularyHighlightsBoxProps {
  vocabulary: VocabularyHighlight[]
}

/**
 * Shows a table/card list of AI picked vocabulary highlights.
 */
export const VocabularyHighlightsBox: React.FC<VocabularyHighlightsBoxProps> = ({ vocabulary }) => (
  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
    <h3 className="font-semibold text-lg mb-3">Vocabulary Highlights</h3>
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
  </div>
)

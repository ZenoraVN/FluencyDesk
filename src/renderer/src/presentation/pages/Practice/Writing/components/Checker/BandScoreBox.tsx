import React from 'react'
import { BandScores } from '../../types'

interface BandScoreBoxProps {
  bandScores: BandScores
}

/**
 * Displays main IELTS band scores breakdown.
 */
export const BandScoreBox: React.FC<BandScoreBoxProps> = ({ bandScores }) => (
  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
    <h3 className="font-semibold text-lg mb-3">Band Score</h3>
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="font-medium">Overall:</span>
        <span className="font-bold">{bandScores.overall}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-medium">Task Response (TR):</span>
        <span>{bandScores.TR !== null && bandScores.TR !== undefined ? bandScores.TR : 'N/A'}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-medium">Coherence & Cohesion (CC):</span>
        <span>{bandScores.CC !== null && bandScores.CC !== undefined ? bandScores.CC : 'N/A'}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-medium">Grammatical Range & Accuracy (GRA):</span>
        <span>
          {bandScores.GRA !== null && bandScores.GRA !== undefined ? bandScores.GRA : 'N/A'}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="font-medium">Lexical Resource (LR):</span>
        <span>{bandScores.LR !== null && bandScores.LR !== undefined ? bandScores.LR : 'N/A'}</span>
      </div>
    </div>
  </div>
)

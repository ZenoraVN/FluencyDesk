import React from 'react'
import { ParagraphOptimization } from '../../PracticeWritingPage'

interface ParagraphOptimizationBoxProps {
  optimizations: ParagraphOptimization[]
}

/**
 * Shows AI's paragraph-by-paragraph feedback and optimization.
 */
export const ParagraphOptimizationBox: React.FC<ParagraphOptimizationBoxProps> = ({
  optimizations
}) => (
  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
    <h3 className="font-semibold text-lg mb-3">Paragraph Optimization</h3>
    {(optimizations?.length === 0 || !optimizations) && (
      <div className="text-gray-500">No specific suggestions available.</div>
    )}
    <div className="space-y-4">
      {optimizations.map((opt, idx) => (
        <div key={idx} className="border-b pb-3 last:border-b-0 last:pb-0">
          <div className="font-medium mb-1">Paragraph {opt.paragraphIndex}</div>
          <div className="text-sm bg-yellow-50 p-2 rounded mb-2">
            <div className="font-medium">Original:</div>
            <p>{opt.original}</p>
          </div>
          <div className="text-sm bg-green-50 p-2 rounded mb-2">
            <div className="font-medium">Optimized:</div>
            <p>{opt.optimized}</p>
          </div>
          <div className="text-xs text-gray-600">{opt.explanation}</div>
        </div>
      ))}
    </div>
  </div>
)

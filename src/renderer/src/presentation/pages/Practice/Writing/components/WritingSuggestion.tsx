import React from 'react'

interface WritingSuggestionProps {
  suggestions: string[]
  onLoadSuggestion?: () => void
}

const fakeSuggestions = [
  'Use linking words for better flow (e.g. However, Furthermore, On the other hand).',
  'Check your task requirements carefully.',
  'Support each idea with specific examples.',
  'Leave time at the end to review your writing.'
]

const WritingSuggestion: React.FC<WritingSuggestionProps> = ({ suggestions, onLoadSuggestion }) => {
  const displaySuggestions = suggestions.length === 0 ? fakeSuggestions : suggestions

  return (
    <div className="bg-white dark:bg-gray-900 border rounded-xl p-4 mb-4">
      <div className="flex items-center gap-2 mb-2">
        <span
          className="text-xl animate-bounce"
          role="img"
          aria-label="lightbulb"
          style={{ color: '#a855f7' }}
        >
          💡
        </span>
        <span className="font-bold text-md text-purple-600">Suggestions</span>
        <button
          className="ml-auto px-3 py-0.5 text-xs font-medium rounded bg-purple-100 hover:bg-purple-200 text-purple-700 transition"
          type="button"
          onClick={() => onLoadSuggestion && onLoadSuggestion()}
        >
          Tải gợi ý
        </button>
      </div>
      {displaySuggestions.length === 0 ? (
        <div className="text-gray-400 text-sm">(No suggestions yet)</div>
      ) : (
        <ul className="list-disc pl-5 text-sm space-y-1">
          {displaySuggestions.map((s, idx) => (
            <li key={idx}>{s}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default WritingSuggestion

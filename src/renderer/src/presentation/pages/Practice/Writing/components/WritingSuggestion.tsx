import React from 'react'

interface WritingSuggestionProps {
  suggestions: string[]
}

const WritingSuggestion: React.FC<WritingSuggestionProps> = ({ suggestions }) => (
  <div className="bg-white dark:bg-gray-900 border rounded-xl p-4 mb-4">
    <div className="font-bold text-md mb-2 text-purple-600">Suggestions</div>
    {suggestions.length === 0 ? (
      <div className="text-gray-400 text-sm">(No suggestions yet)</div>
    ) : (
      <ul className="list-disc pl-5 text-sm space-y-1">
        {suggestions.map((s, idx) => (
          <li key={idx}>{s}</li>
        ))}
      </ul>
    )}
  </div>
)

export default WritingSuggestion

import React from 'react'

interface WritingSuggestionProps {
  suggestions: string[]
  onLoadSuggestion?: () => void
}

const WritingSuggestion: React.FC<WritingSuggestionProps> = ({ suggestions, onLoadSuggestion }) => {
  return (
    <div className="bg-white dark:bg-gray-900 border rounded-xl p-4 mb-4">
      <div className="flex items-center gap-2 mb-2">
        <span
          className="text-xl animate-pulse"
          role="img"
          aria-label="lightbulb"
          style={{ color: '#a855f7' }}
        >
          💡
        </span>
        <span className="font-bold text-md text-purple-600">Gợi ý khi viết</span>
        <button
          className="ml-auto px-3 py-1 text-sm font-medium rounded bg-purple-100 hover:bg-purple-200 text-purple-700 transition"
          type="button"
          onClick={() => onLoadSuggestion && onLoadSuggestion()}
        >
          Tải thêm gợi ý
        </button>
      </div>
      {suggestions.length === 0 ? (
        <div className="text-gray-400 text-sm">(Chưa có gợi ý)</div>
      ) : (
        <ul className="list-disc pl-5 text-sm space-y-1">
          {suggestions.map((s, idx) => (
            <li key={idx} className="flex items-start">
              <span className="bg-purple-100 text-purple-700 rounded-full w-5 h-5 flex items-center justify-center mr-2 text-xs mt-0.5">
                {idx + 1}
              </span>
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default WritingSuggestion

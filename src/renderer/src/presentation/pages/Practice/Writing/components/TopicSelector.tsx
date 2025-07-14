import React from 'react'

const TOPIC_ICON: Record<string, string> = {
  'Môi trường': '🌍',
  'Công nghệ': '💻',
  'Giáo dục': '📚',
  'Sức khỏe': '🗓️',
  'Xã hội': '👥',
  'Kinh doanh': '💼',
  'Du lịch': '✈️',
  'Văn hóa': '🎨',
  Other: '➕',
  Random: '🎲'
}

interface TopicSelectorProps {
  topics: string[]
  selectedTopic: string
  onSelect: (topic: string) => void
  customTopic: string
  setCustomTopic: (val: string) => void
}

const TopicSelector: React.FC<TopicSelectorProps> = ({
  topics,
  selectedTopic,
  onSelect,
  customTopic,
  setCustomTopic
}) => {
  const displayTopics = ['Other', 'Random', ...topics]
  const showCustomInput = selectedTopic === 'Other'

  return (
    <div>
      <div className="mb-6 flex items-center gap-2">
        <span className="text-xl text-green-600">&#127757;</span>
        <h3 className="text-lg font-bold">Chọn chủ đề</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {displayTopics.map((topic) => (
          <button
            key={topic}
            onClick={() => onSelect(topic)}
            className={[
              'w-full border rounded-xl px-6 py-3 flex items-center gap-2 text-left transition focus:outline-none',
              selectedTopic === topic
                ? 'bg-blue-50 border-blue-400'
                : 'bg-white dark:bg-muted border-border hover:border-blue-200'
            ].join(' ')}
          >
            <span className="text-xl">{TOPIC_ICON[topic] || '🏷️'}</span>
            <span className="font-medium">{topic}</span>
          </button>
        ))}
      </div>
      {showCustomInput && (
        <div className="mt-4">
          <input
            className="w-full border border-blue-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            placeholder="Nhập chủ đề tùy chọn của bạn..."
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
          />
        </div>
      )}
    </div>
  )
}

export default TopicSelector

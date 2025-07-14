import React from 'react'
import { CustomInput } from '../../../../../components/Input/CustomInput'

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
    <div className="bg-card border rounded-xl p-4 mb-4">
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
                ? 'bg-gray-100 border-[#52aaad]'
                : 'bg-gray-50 border-gray-300 hover:border-[#52aaad]'
            ].join(' ')}
          >
            <span className="text-xl">{TOPIC_ICON[topic] || '🏷️'}</span>
            <span className="font-medium">{topic}</span>
          </button>
        ))}
      </div>
      {showCustomInput && (
        <div className="mt-4">
          <CustomInput
            value={customTopic}
            onChange={setCustomTopic}
            className="w-full border border-blue-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Nhập chủ đề tùy chọn của bạn..."
          />
        </div>
      )}
    </div>
  )
}

export default TopicSelector

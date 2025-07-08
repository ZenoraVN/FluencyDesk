import { FC, useEffect, useState } from 'react'
import { Filter, X } from 'lucide-react'
import { CustomInput } from '../../../../../componentsInput/CustomInput'
import CustomCombobox from '../../../../../componentsCombobox/CustomCombobox'

const FREQUENCY_OPTIONS = [
  { value: 'high', label: 'Cao' },
  { value: 'medium', label: 'Trung bình' },
  { value: 'low', label: 'Thấp' }
]
const LEVEL_OPTIONS = [
  { value: 'beginner', label: 'Cơ bản' },
  { value: 'intermediate', label: 'Trung cấp' },
  { value: 'advanced', label: 'Nâng cao' }
]

const CONTENT_TYPE_OPTIONS = [
  { value: 'words', label: 'Từ vựng' },
  { value: 'phrases', label: 'Cụm từ' }
]

type FilterProps = {
  filters: {
    search: string
    frequency: string
    language_level: string
  }
  onFilterChange: (name: 'search' | 'frequency' | 'language_level', value: any) => void
  activeTab: 'words' | 'phrases'
  onTabChange: (tab: string) => void
}

const WikiFilter: FC<FilterProps> = ({ filters, onFilterChange, activeTab, onTabChange }) => {
  const [searchInput, setSearchInput] = useState(filters.search ?? '')
  const [frequencyInput, setFrequencyInput] = useState(filters.frequency ?? '')
  const [levelInput, setLevelInput] = useState(filters.language_level ?? '')
  const [showSearchButton, setShowSearchButton] = useState(false)

  useEffect(() => {
    setShowSearchButton(searchInput !== (filters.search ?? ''))
  }, [searchInput, filters.search])

  useEffect(() => setSearchInput(filters.search ?? ''), [filters.search])
  useEffect(() => setFrequencyInput(filters.frequency ?? ''), [filters.frequency])
  useEffect(() => setLevelInput(filters.language_level ?? ''), [filters.language_level])

  const clearFilters = () => {
    setSearchInput('')
    setFrequencyInput('')
    setLevelInput('')
    onFilterChange('search', '')
    onFilterChange('frequency', '')
    onFilterChange('language_level', '')
  }

  const hasActive = filters.search || filters.frequency || filters.language_level

  return (
    <div className="flex flex-col h-full rounded-2xl border border-[#ddd] p-4 hover:border-[#52aaaf] relative mt-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-[#52aaa5]" />
          <h2 className="text-lg font-semibold text-[#2D3748]">Bộ lọc</h2>
        </div>
        {hasActive && (
          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center gap-1 text-sm text-[#718096] hover:text-[#52aaa5] transition-colors"
          >
            <X className="h-4 w-4" />
            Xóa bộ lọc
          </button>
        )}
      </div>
      {/* Content Type */}
      <div className="mb-4">
        <div className="block text-sm font-medium text-[#2D3748] mb-2">Loại nội dung</div>
        <div className="flex gap-2">
          {CONTENT_TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onTabChange(opt.value)}
              className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeTab === opt.value
                  ? 'bg-[#52aaa5] text-white'
                  : 'bg-[#52aaa5]/5 text-[#52aaa5] hover:bg-[#52aaa5]/10'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      {/* Search */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-[#2D3748]">Từ khóa</label>
          {showSearchButton && searchInput && (
            <button
              className="text-[#52aaa5] text-sm font-medium"
              onClick={() => onFilterChange('search', searchInput)}
              type="button"
            >
              Tìm kiếm
            </button>
          )}
        </div>
        <CustomInput
          value={searchInput}
          onChange={(val) => setSearchInput(val)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onFilterChange('search', searchInput)
          }}
        />
      </div>

      {/* Frequency */}
      <CustomCombobox
        label="Tần suất"
        value={frequencyInput}
        options={FREQUENCY_OPTIONS}
        onChange={(val) => {
          setFrequencyInput(val)
          onFilterChange('frequency', val)
        }}
        className="mb-4"
      />
      {/* Level */}
      <CustomCombobox
        label="Cấp độ"
        value={levelInput}
        options={LEVEL_OPTIONS}
        onChange={(val) => {
          setLevelInput(val)
          onFilterChange('language_level', val)
        }}
      />
    </div>
  )
}

export default WikiFilter

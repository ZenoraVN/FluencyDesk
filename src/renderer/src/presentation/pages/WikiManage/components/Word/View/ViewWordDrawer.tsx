import { useState } from 'react'
import { Sheet, SheetContent } from '../../../../../../components/ui/sheet'
import { RichtextView } from '../../../../../../components/common/RichtextView'

interface Definition {
  id: string
  parts_of_speech: string
  definition: string
  is_main_definition: boolean
  examples: Array<{
    id: string
    example_sentence: string
    mean_example_sentence: string
    created_at: string
    updated_at: string
  }>
  created_at: string
  updated_at: string
}

interface WordData {
  id: string
  word: string
  pronunciation: string
  frequency: string
  image_urls: string[]
  usage_notes: string[]
  language_level: string
  created_at: string
  updated_at: string
  definitions: Definition[]
  relationships: Array<{
    id: string
    related_id: string
    related_type: 'word' | 'phrase'
    relationship_type: string
    word: string
    created_at: string
    updated_at: string
  }>
}

interface ViewWordDrawerProps {
  open: boolean
  onClose: () => void
  data?: WordData
}

const frequencyLabels = {
  high: { label: 'Cao', color: 'bg-green-100 text-green-700 border-green-200' },
  medium: {
    label: 'Trung bình',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200'
  },
  low: { label: 'Thấp', color: 'bg-red-100 text-red-700 border-red-200' }
}

const levelLabels = {
  beginner: {
    label: 'Beginner',
    color: 'bg-blue-100 text-blue-700 border-blue-200'
  },
  intermediate: {
    label: 'Intermediate',
    color: 'bg-purple-100 text-purple-700 border-purple-200'
  },
  advanced: {
    label: 'Advanced',
    color: 'bg-pink-100 text-pink-700 border-pink-200'
  }
}

const partsOfSpeechLabels = {
  verb: {
    label: 'Động từ',
    color: 'bg-indigo-100 text-indigo-700 border-indigo-200'
  },
  noun: {
    label: 'Danh từ',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200'
  },
  adjective: {
    label: 'Tính từ',
    color: 'bg-amber-100 text-amber-700 border-amber-200'
  },
  adverb: {
    label: 'Trạng từ',
    color: 'bg-rose-100 text-rose-700 border-rose-200'
  }
}

const relationshipTypeLabels: Record<string, { label: string; color: string }> = {
  synonym: {
    label: 'Từ đồng nghĩa',
    color: 'bg-blue-100 text-blue-700 border-blue-200'
  },
  antonym: {
    label: 'Từ trái nghĩa',
    color: 'bg-red-100 text-red-700 border-red-200'
  },
  inflection: {
    label: 'Dạng biến thể',
    color: 'bg-green-100 text-green-700 border-green-200'
  },
  rhyme: {
    label: 'Vần',
    color: 'bg-purple-100 text-purple-700 border-purple-200'
  },
  hypernym: {
    label: 'Từ bao quát',
    color: 'bg-orange-100 text-orange-700 border-orange-200'
  },
  includes: {
    label: 'Bao gồm',
    color: 'bg-teal-100 text-teal-700 border-teal-200'
  },
  used_in: {
    label: 'Được dùng trong',
    color: 'bg-indigo-100 text-indigo-700 border-indigo-200'
  },
  collocation: {
    label: 'Cụm từ thường gặp',
    color: 'bg-pink-100 text-pink-700 border-pink-200'
  }
}

export function ViewWordDrawer({ open, onClose, data }: ViewWordDrawerProps) {
  if (!data) return null

  const [showAllDefinitions, setShowAllDefinitions] = useState(false)
  const mainDefinition = data.definitions?.find((def) => def.is_main_definition)
  const otherDefinitions = data.definitions?.filter((def) => !def.is_main_definition)

  const renderDefinition = (def: Definition) => (
    <div
      key={def.id}
      className="rounded-lg border border-[#52aaa5]/10 p-4 space-y-4  shadow-sm hover:outline hover:outline-1 hover:outline-[#52aaa5] transition-all"
    >
      {/* Parts of Speech */}
      <div className="flex items-center gap-2">
        <span
          className={`px-3 py-1 rounded-lg border ${
            partsOfSpeechLabels[def.parts_of_speech as keyof typeof partsOfSpeechLabels]?.color
          }`}
        >
          {partsOfSpeechLabels[def.parts_of_speech as keyof typeof partsOfSpeechLabels]?.label}
        </span>
      </div>

      {/* Definition */}
      <p className="text-[#2D3748]">{def.definition}</p>

      {/* Examples */}
      {def.examples?.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-[#718096]">Ví dụ:</h4>
          {def.examples?.map((example) => (
            <div key={example.id} className="pl-4 border-l-2 border-[#52aaa5]/20 space-y-1">
              <p className="text-[#2D3748]">{example.example_sentence}</p>
              <p className="text-[#718096]">{example.mean_example_sentence}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[40vw] overflow-y-auto bg-[#f6f6f0]">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold text-[#2D3748]">{data.word}</h2>
            <p className="text-lg text-[#718096] font-medium">{data.pronunciation}</p>
          </div>

          {/* Badges */}
          <div className="flex gap-2">
            <span
              className={`px-3 py-1 rounded-lg border ${
                frequencyLabels[data.frequency as keyof typeof frequencyLabels]?.color
              }`}
            >
              {frequencyLabels[data.frequency as keyof typeof frequencyLabels]?.label}
            </span>
            <span
              className={`px-3 py-1 rounded-lg border ${
                levelLabels[data.language_level as keyof typeof levelLabels]?.color
              }`}
            >
              {levelLabels[data.language_level as keyof typeof levelLabels]?.label}
            </span>
          </div>

          {/* Images */}
          {data.image_urls?.length > 0 && (
            <div>
              <h3 className="text-[#2D3748] font-medium mb-3">Hình ảnh</h3>
              <div className="grid grid-cols-2 gap-4">
                {data.image_urls?.map((url, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden shadow-sm"
                  >
                    <img
                      src={url}
                      alt={`${data.word} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Definitions */}
          {mainDefinition && (
            <div>
              <h3 className="text-[#2D3748] font-medium mb-3">Định nghĩa</h3>
              {renderDefinition(mainDefinition)}
              {showAllDefinitions && (
                <div className="mt-4 space-y-4">{otherDefinitions?.map(renderDefinition)}</div>
              )}
              {otherDefinitions?.length > 0 && (
                <button
                  onClick={() => setShowAllDefinitions(!showAllDefinitions)}
                  className="mt-3 w-full py-2 text-center text-[#52aaa5] hover:text-[#52aaa5]/80 transition-colors"
                >
                  {showAllDefinitions ? 'Ẩn bớt' : 'Hiển thị toàn bộ'}
                </button>
              )}
            </div>
          )}

          {/* Relationships */}
          {data.relationships?.length > 0 && (
            <div>
              <h3 className="text-[#2D3748] font-medium mb-3">Mối quan hệ từ vựng</h3>
              <div className="space-y-2">
                {data.relationships.map((relationship) => (
                  <div
                    key={relationship.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-[#52aaa5]/10 bg-[#52aaa5]/5"
                  >
                    <div>
                      <div className="font-medium text-[#2D3748]">{relationship.word}</div>
                      <div className="text-sm text-gray-500">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            relationshipTypeLabels[relationship.relationship_type]?.color ||
                            'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {relationshipTypeLabels[relationship.relationship_type]?.label ||
                            relationship.relationship_type}
                        </span>
                        <span className="ml-2 text-xs">
                          {relationship.related_type === 'word' ? 'Từ' : 'Cụm từ'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Usage Notes */}
          {data.usage_notes?.length > 0 && (
            <div>
              <h3 className="text-[#2D3748] font-medium mb-3">Ghi chú sử dụng</h3>
              <div className="space-y-3 ">
                {data.usage_notes?.map((note, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-[#52aaa5]/10 p-4  shadow-sm hover:outline hover:outline-1 hover:outline-[#52aaa5] transition-all"
                  >
                    <RichtextView content={note} className="text-black" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

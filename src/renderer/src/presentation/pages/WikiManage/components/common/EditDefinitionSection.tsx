import React from 'react'
import { Button } from '../../../../components/ui/button'
import { Plus, Minus } from 'lucide-react'
import { Definition } from '../../type/wiki'
import { CustomInput } from '../../../../../componentsInput/CustomInput'

export interface PartOfSpeechSectionProps {
  selected: string
  onChange: (newValue: string) => void
  size?: 'sm' | 'md'
}

type ExampleState = {
  example_sentence: string
  mean_example_sentence: string
  id?: string
}

interface NewDefState {
  parts_of_speech: string
  definition: string
  examples: ExampleState[]
}

interface EditDefinitionSectionProps {
  wordId: string
  definitions: Definition[]
  newDefinition: NewDefState
  setNewDefinition: React.Dispatch<React.SetStateAction<NewDefState>>
  onAddDefinition: () => void
  onUpdateDefinition: (definitionId: string, field: string, value: string) => void
  onRemoveDefinition: (definitionId: string) => void
  onAddExample: (
    wordId: string,
    definitionId: string,
    example: { example_sentence: string; mean_example_sentence: string }
  ) => Promise<void>
  onRemoveExample: (definitionId: string, exampleId: string) => void
  onSetMainDefinition?: (definitionId: string) => void
  PartOfSpeechSection: React.ComponentType<PartOfSpeechSectionProps>
}

export function EditDefinitionSection({
  wordId,
  definitions,
  newDefinition,
  setNewDefinition,
  onAddDefinition,
  onUpdateDefinition,
  onRemoveDefinition,
  onAddExample,
  onRemoveExample,
  onSetMainDefinition,
  PartOfSpeechSection
}: EditDefinitionSectionProps) {
  const orderedDefinitions =
    typeof onSetMainDefinition === 'function'
      ? [
          ...definitions.filter((d) => d.is_main_definition),
          ...definitions.filter((d) => !d.is_main_definition)
        ]
      : definitions

  // Expand/collapse state per definition
  const [expandedExamples, setExpandedExamples] = React.useState<Record<string, boolean>>({})
  const toggleExamples = (id: string) => {
    setExpandedExamples((prev) => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  // Local edit state for each definition
  const [editedDefinitions, setEditedDefinitions] = React.useState<{
    [id: string]: string
  }>({})
  // Local state for new example per definition
  const [newExample, setNewExample] = React.useState<
    Record<string, { example_sentence: string; mean_example_sentence: string }>
  >({})

  // Loading states
  const [removeDefinitionLoading, setRemoveDefinitionLoading] = React.useState<
    Record<string, boolean>
  >({})
  const [removeExampleLoading, setRemoveExampleLoading] = React.useState<Record<string, boolean>>(
    {}
  )

  const [setMainLoading, setSetMainLoading] = React.useState<Record<string, boolean>>({})
  const [updateDefinitionLoading, setUpdateDefinitionLoading] = React.useState<
    Record<string, boolean>
  >({})

  // Only allow add if filled
  const canAddDefinition = !!newDefinition.parts_of_speech && !!newDefinition.definition.trim()

  // ---- Handlers ----
  const handleAddExample = (definitionId: string) => {
    const example = newExample[definitionId]
    if (!example?.example_sentence?.trim() || !example?.mean_example_sentence?.trim()) return
    onAddExample(wordId, definitionId, {
      example_sentence: example.example_sentence,
      mean_example_sentence: example.mean_example_sentence
    })
    setNewExample((prev) => ({
      ...prev,
      [definitionId]: {
        example_sentence: '',
        mean_example_sentence: ''
      }
    }))
  }

  // Remove Definition (can be async for Phrase)
  const handleRemoveDefinition = async (definitionId: string) => {
    setRemoveDefinitionLoading((prev) => ({
      ...prev,
      [definitionId]: true
    }))
    try {
      await onRemoveDefinition(definitionId)
    } finally {
      setRemoveDefinitionLoading((prev) => ({
        ...prev,
        [definitionId]: false
      }))
    }
  }

  // Remove Example (can be async for Phrase)
  const handleRemoveExample = async (definitionId: string, exampleId: string) => {
    setRemoveExampleLoading((prev) => ({
      ...prev,
      [definitionId + '/' + exampleId]: true
    }))
    try {
      await onRemoveExample(definitionId, exampleId)
    } finally {
      setRemoveExampleLoading((prev) => ({
        ...prev,
        [definitionId + '/' + exampleId]: false
      }))
    }
  }

  // ---- RENDER ----
  return (
    <section>
      {/* New Definition */}
      <div className="mb-6 rounded-xl p-4 hover:outline hover:outline-[#52aaa5] hover:outline-1 border border-[#ddd]">
        <div className="flex items-center justify-between gap-4">
          <PartOfSpeechSection
            selected={newDefinition.parts_of_speech}
            onChange={(v) =>
              setNewDefinition((prev) => ({
                ...prev,
                parts_of_speech: v
              }))
            }
          />
          {canAddDefinition &&
            newDefinition.examples[0]?.example_sentence &&
            newDefinition.examples[0]?.mean_example_sentence && (
              <Button
                onClick={onAddDefinition}
                variant="outline"
                size="sm"
                className="bg-[#52aaa5]/10 text-[#52aaa5] border-[#52aaa5]/50 hover:bg-[#52aaa5]/20 font-semibold whitespace-nowrap"
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm định nghĩa
              </Button>
            )}
        </div>
        <p className="text-sm text-gray-500 mb-1">Định nghĩa</p>
        <CustomInput
          value={newDefinition.definition}
          onChange={(val) =>
            setNewDefinition((prev) => ({
              ...prev,
              definition: val
            }))
          }
          className="min-h-[90px] !text-[#2D3748] border border-[#ddd] rounded-lg shadow-none px-3 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-[#52aaa5]/30"
        />
        <div className="mt-4">
          <div className="mb-2 font-medium text-[#52aaa5]">Ví dụ (bắt buộc)</div>
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-500 mb-1">Câu ví dụ</p>
            <CustomInput
              value={newDefinition.examples[0]?.example_sentence ?? ''}
              onChange={(val) =>
                setNewDefinition((prev) => ({
                  ...prev,
                  examples: [
                    {
                      ...prev.examples[0],
                      example_sentence: val,
                      mean_example_sentence: prev.examples[0]?.mean_example_sentence ?? ''
                    }
                  ]
                }))
              }
              className="min-h-[36px] w-full border border-[#ddd] rounded-lg p-2"
            />
            <p className="text-sm text-gray-500 mb-1">Nghĩa của câu</p>
            <CustomInput
              value={newDefinition.examples[0]?.mean_example_sentence ?? ''}
              onChange={(val) =>
                setNewDefinition((prev) => ({
                  ...prev,
                  examples: [
                    {
                      ...prev.examples[0],
                      mean_example_sentence: val,
                      example_sentence: prev.examples[0]?.example_sentence ?? ''
                    }
                  ]
                }))
              }
              className="min-h-[36px] w-full border border-[#ddd] rounded-lg p-2"
            />
          </div>
        </div>
      </div>
      <p className="text-[#2D3748] font-normal text-base mb-2">Quản lý định nghĩa và ví dụ</p>
      {/* List Definitions */}
      <div className="space-y-7" role="list" aria-label="Danh sách định nghĩa">
        {orderedDefinitions.map((def, idx) => {
          const currentEdit = editedDefinitions[def.id] ?? def.definition
          const isDirty = currentEdit !== def.definition
          return (
            <div
              key={def.id}
              className={`rounded-xl p-4 border
                ${def.is_main_definition ? 'border-[#10b3e6]' : 'border-[#ddd]'}
                hover:outline hover:outline-1
                relative
              `}
              style={{ outlineColor: '#52aaa5' }}
            >
              <div className="flex items-center justify-between mb-2 pt-1">
                <span className="text-base text-gray-500 font-medium">Định nghĩa {idx + 1}</span>
                <div className="flex gap-2">
                  {!!onSetMainDefinition && !def.is_main_definition && !isDirty && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-[#10b3e6] border-[#10b3e6]/40 hover:bg-[#e9f6fc] font-semibold"
                      style={{ minWidth: 170 }}
                      onClick={async () => {
                        setSetMainLoading((prev) => ({
                          ...prev,
                          [def.id]: true
                        }))
                        try {
                          await onSetMainDefinition(def.id)
                        } finally {
                          setSetMainLoading((prev) => ({
                            ...prev,
                            [def.id]: false
                          }))
                        }
                      }}
                      disabled={!!setMainLoading[def.id]}
                    >
                      {setMainLoading[def.id] ? (
                        <span className="inline-block mr-2 w-4 h-4 animate-spin border-2 border-[#10b3e6] border-t-transparent rounded-full" />
                      ) : null}
                      Chuyển sang định nghĩa chính
                    </Button>
                  )}
                  {((isDirty && !updateDefinitionLoading[def.id]) ||
                    updateDefinitionLoading[def.id]) && (
                    <>
                      <Button
                        size="sm"
                        className="bg-[#52aaa5]/80 text-white hover:bg-[#10b3e6]"
                        onClick={async () => {
                          setUpdateDefinitionLoading((prev) => ({
                            ...prev,
                            [def.id]: true
                          }))
                          try {
                            await onUpdateDefinition(def.id, 'definition', currentEdit)
                            setEditedDefinitions((prev) => {
                              const n = { ...prev }
                              delete n[def.id]
                              return n
                            })
                          } finally {
                            setUpdateDefinitionLoading((prev) => ({
                              ...prev,
                              [def.id]: false
                            }))
                          }
                        }}
                        disabled={updateDefinitionLoading[def.id]}
                      >
                        {updateDefinitionLoading[def.id] ? (
                          <span className="inline-block mr-2 w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
                        ) : null}
                        Sửa định nghĩa
                      </Button>
                      {!updateDefinitionLoading[def.id] && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-gray-400 hover:text-[#52aaa5]"
                          onClick={() =>
                            setEditedDefinitions((prev) => {
                              const n = { ...prev }
                              delete n[def.id]
                              return n
                            })
                          }
                        >
                          Hủy thay đổi
                        </Button>
                      )}
                    </>
                  )}
                  {!isDirty && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-[#b32929] border-[#b32929]/40 hover:bg-[#fbe9e9] font-semibold"
                      style={{ minWidth: 90 }}
                      onClick={() => handleRemoveDefinition(def.id)}
                      disabled={!!removeDefinitionLoading[def.id]}
                    >
                      {removeDefinitionLoading[def.id] ? (
                        <span className="inline-block mr-2 w-4 h-4 animate-spin border-2 border-[#b32929] border-t-transparent rounded-full" />
                      ) : null}
                      Xóa
                    </Button>
                  )}
                </div>
              </div>
              {/* Nếu muốn, đặt PartOfSpeechSection bên dưới header này: */}
              <PartOfSpeechSection
                selected={def.parts_of_speech}
                onChange={(v) => onUpdateDefinition(def.id, 'parts_of_speech', v)}
                size="sm"
              />

              {/* Definition Editor */}
              <div className="relative">
                <p className="text-sm text-gray-500 mb-1">Định nghĩa</p>
                <CustomInput
                  value={currentEdit}
                  onChange={(val) =>
                    setEditedDefinitions((prev) => ({
                      ...prev,
                      [def.id]: val
                    }))
                  }
                  className="min-h-[80px] !text-[#2D3748] border border-[#ddd] rounded-lg px-3 py-2 shadow-none focus:outline-none focus:ring-2 focus:ring-[#52aaa5]/20"
                />
              </div>
              {/* Example Section */}
              <div>
                {/* Toggle */}
                <div className="flex items-center justify-between cursor-pointer select-none pt-4">
                  <h4
                    className="text-sm font-medium text-[#52aaa5] tracking-wide flex items-center gap-1"
                    onClick={() => toggleExamples(def.id)}
                    style={{ userSelect: 'none' }}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleExamples(def.id)
                      }}
                      aria-expanded={!!expandedExamples[def.id]}
                      aria-controls={`wiki-example-list-${def.id}`}
                      className="rounded hover:bg-[#e3fbf7] transition mr-2"
                      tabIndex={0}
                    >
                      {expandedExamples[def.id] ? (
                        <svg
                          width="14"
                          height="14"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="14"
                          height="14"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      )}
                    </button>
                    Ví dụ
                  </h4>
                </div>
                {expandedExamples[def.id] && (
                  <div
                    role="list"
                    aria-label="Danh sách ví dụ"
                    id={`wiki-example-list-${def.id}`}
                    className="space-y-4"
                  >
                    {/* Add Example */}
                    <div className="flex flex-col gap-2 rounded-md mt-3">
                      <div className="flex items-center w-full">
                        <p className="text-black text-base font-normal">Thêm ví dụ</p>
                        {newExample[def.id]?.example_sentence?.trim() &&
                          newExample[def.id]?.mean_example_sentence?.trim() && (
                            <Button
                              size="sm"
                              onClick={() => handleAddExample(def.id)}
                              className="bg-[#10b39c] text-white hover:bg-[#52aaa5] w-fit ml-auto"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Thêm ví dụ
                            </Button>
                          )}
                      </div>
                      <div className="flex-1 min-w-[220px] mb-2">
                        <p className="text-sm text-gray-500 mb-1">Câu ví dụ</p>
                        <CustomInput
                          value={newExample[def.id]?.example_sentence || ''}
                          onChange={(val) =>
                            setNewExample((prev) => ({
                              ...prev,
                              [def.id]: {
                                ...prev[def.id],
                                example_sentence: val,
                                mean_example_sentence: prev[def.id]?.mean_example_sentence || ''
                              }
                            }))
                          }
                          className="min-h-[36px] w-full p-2 rounded-lg border border-[#ddd]"
                        />
                      </div>
                      <div className="flex-1 min-w-[160px] mb-2">
                        <p className="text-sm text-gray-500 mb-1">Nghĩa của câu</p>
                        <CustomInput
                          value={newExample[def.id]?.mean_example_sentence || ''}
                          onChange={(val) =>
                            setNewExample((prev) => ({
                              ...prev,
                              [def.id]: {
                                ...prev[def.id],
                                mean_example_sentence: val,
                                example_sentence: prev[def.id]?.example_sentence || ''
                              }
                            }))
                          }
                          className="min-h-[36px] w-full rounded-lg p-2 border border-[#ddd]"
                        />
                      </div>
                    </div>
                    <p className="text-black text-base font-normal">Quản lý ví dụ</p>
                    {/* Example List */}
                    {def.examples.map((example) => {
                      const loading = !!removeExampleLoading[def.id + '/' + (example.id || '')]
                      return (
                        <div
                          key={example.id}
                          className="pl-4 border-l-[3px] border-[#52aaa5]/30 space-y-1 my-2 flex items-center justify-between"
                          role="listitem"
                        >
                          <div className="flex-1">
                            <span className="text-[15px] text-gray-900 block">
                              {example.example_sentence}
                            </span>
                            <span className="text-[14px] text-gray-500 block">
                              {example.mean_example_sentence}
                            </span>
                          </div>
                          <Button
                            onClick={() => handleRemoveExample(def.id, example.id!)}
                            variant="ghost"
                            size="sm"
                            disabled={loading}
                            className={`
                              font-medium
                              bg-[#f6f6f0]
                              border border-[#ecece0]
                              text-[#52aaa5]
                              hover:bg-[#ecece0]
                              hover:text-[#10b39c]
                              transition
                              ml-2
                              ${loading ? 'opacity-70 pointer-events-none' : ''}
                            `}
                            aria-label={`Xóa ví dụ ${example.example_sentence}`}
                          >
                            {loading ? (
                              <span className="inline-block h-4 w-4 animate-spin border-2 border-[#52aaa5] border-t-transparent rounded-full mr-1" />
                            ) : (
                              <Minus className="h-4 w-4" aria-hidden="true" />
                            )}
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

import React from 'react'
import { RichtextchtEditor } from '../../../../../../components/Input/CustomRichtext'

interface AiPromptInputProps {
  value: string
  onChange: (v: string) => void
  onCreateByPrompt: () => void
  onCreateRandom: () => void
  disableCreateByPrompt?: boolean
}

const AiPromptInput: React.FC<AiPromptInputProps> = ({
  value,
  onChange,
  onCreateByPrompt,
  onCreateRandom,
  disableCreateByPrompt
}) => (
  <div className="bg-card rounded-xl p-4 mb-4 border w-full min-w-0">
    <div className="mb-4 flex items-center gap-2">
      <span className="text-xl text-purple-600">&#129302;</span>
      <h3 className="text-lg font-bold">AI Prompt</h3>
    </div>
    <RichtextchtEditor
      value={value}
      onChange={onChange}
      placeholder="Enter a special writing prompt..."
      count={false}
      hideToolbar={true}
    />
    <div className="flex justify-end gap-3 mt-5">
      <button
        className="bg-purple-600 text-white font-bold rounded-l-xl rounded-r-none px-6 py-2 transition disabled:opacity-50"
        onClick={onCreateByPrompt}
        disabled={disableCreateByPrompt}
        style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
      >
        Create by Prompt
      </button>
      <button
        className="bg-blue-500 text-white font-bold rounded-r-xl rounded-l-none px-6 py-2 hover:bg-blue-600 transition"
        onClick={onCreateRandom}
        style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
      >
        Create Random
      </button>
    </div>
  </div>
)

export default AiPromptInput

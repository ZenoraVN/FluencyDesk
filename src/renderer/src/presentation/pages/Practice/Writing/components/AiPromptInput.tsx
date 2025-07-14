import React from 'react'

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
  <div className="bg-card rounded-xl p-8 mb-4 border">
    <div className="mb-4 flex items-center gap-2">
      <span className="text-xl text-purple-600">&#129302;</span>
      <h3 className="text-lg font-bold">AI Prompt</h3>
    </div>
    <textarea
      className="w-full border rounded px-3 py-2 min-h-[40px] max-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary"
      placeholder="Nhập yêu cầu đặc biệt cho đề viết..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={2}
    />
    <div className="flex gap-3 mt-5">
      <button
        className={`bg-purple-600 text-white font-bold rounded px-6 py-2 transition disabled:opacity-50`}
        onClick={onCreateByPrompt}
        disabled={disableCreateByPrompt}
      >
        Tạo đề theo yêu cầu
      </button>
      <button
        className="bg-blue-500 text-white font-bold rounded px-6 py-2 hover:bg-blue-600 transition"
        onClick={onCreateRandom}
      >
        Tạo đề ngẫu nhiên
      </button>
    </div>
  </div>
)

export default AiPromptInput

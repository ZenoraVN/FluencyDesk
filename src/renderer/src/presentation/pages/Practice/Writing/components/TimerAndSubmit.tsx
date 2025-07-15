import React from 'react'

interface TimerAndSubmitProps {
  remaining: number
  onSubmit: () => void
  onSaveDraft?: () => void
  canSubmit: boolean
}

const TimerAndSubmit: React.FC<TimerAndSubmitProps> = ({
  remaining,
  onSubmit,
  onSaveDraft,
  canSubmit
}) => {
  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60
  const minStr = mins < 10 ? `0${mins}` : `${mins}`
  const secStr = secs < 10 ? `0${secs}` : `${secs}`

  return (
    <div className="bg-white dark:bg-gray-900 border rounded-xl p-4 flex flex-col mb-4 w-full">
      <div className="mb-2 text-sm text-gray-600 font-semibold flex items-center gap-2">
        <span
          className="animate-spin-slow"
          style={{
            display: 'inline-flex',
            color: '#2dd4bf',
            fontSize: 20,
            marginRight: 4,
            filter: 'drop-shadow(0 0 2px #06b6d4)'
          }}
          role="img"
          aria-label="timer"
        >
          ⏰
        </span>
        <span className="tracking-wide">Time Remaining</span>
      </div>
      <div className="text-5xl font-mono font-bold text-blue-600 mb-4 select-none">
        {minStr}:{secStr}
      </div>
      <div className="flex w-full gap-2">
        <button
          className="flex-1 px-4 py-2 font-bold text-white rounded transition bg-gray-500 hover:bg-gray-700"
          type="button"
          onClick={() => onSaveDraft && onSaveDraft()}
        >
          Lưu nháp
        </button>
        <button
          className={`flex-1 px-4 py-2 font-bold text-white rounded transition bg-green-600 hover:bg-green-700 ${
            canSubmit ? '' : 'opacity-50 cursor-not-allowed'
          }`}
          disabled={!canSubmit}
          onClick={onSubmit}
          type="button"
        >
          Submit
        </button>
      </div>
      {!canSubmit && (
        <div className="text-xs mt-2 text-gray-400 font-medium text-center">
          You can only submit in the last 10 minutes.
        </div>
      )}
    </div>
  )
}

export default TimerAndSubmit

import React from 'react'

interface TimerAndSubmitProps {
  remaining: number
  onSubmit: () => void
  onSaveDraft?: () => void
  canSubmit: boolean
  evaluating?: boolean
}

const TimerAndSubmit: React.FC<TimerAndSubmitProps> = ({
  remaining,
  onSubmit,
  onSaveDraft,
  canSubmit,
  evaluating
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
          disabled={evaluating}
        >
          Lưu nháp
        </button>
        <button
          className={`flex-1 px-4 py-2 font-bold text-white rounded transition ${
            evaluating ? 'bg-blue-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          } ${canSubmit ? '' : 'opacity-50 cursor-not-allowed'}`}
          disabled={!canSubmit || evaluating}
          onClick={onSubmit}
          type="button"
        >
          {evaluating ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Đang chấm...
            </div>
          ) : (
            'Nộp bài'
          )}
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

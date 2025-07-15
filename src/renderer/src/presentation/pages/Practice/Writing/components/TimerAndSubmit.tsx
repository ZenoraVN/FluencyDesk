import React from 'react'

interface TimerAndSubmitProps {
  remaining: number
  onSubmit: () => void
  canSubmit: boolean
}

const TimerAndSubmit: React.FC<TimerAndSubmitProps> = ({ remaining, onSubmit, canSubmit }) => {
  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60
  const minStr = mins < 10 ? `0${mins}` : `${mins}`
  const secStr = secs < 10 ? `0${secs}` : `${secs}`
  return (
    <div className="bg-white dark:bg-gray-900 border rounded-xl p-4 flex flex-col items-center mb-4">
      <div className="mb-2 text-sm text-gray-600 font-semibold">Time Remaining</div>
      <div className="text-3xl font-mono font-bold text-blue-600 mb-3">
        {minStr}:{secStr}
      </div>
      <button
        className={`w-full px-4 py-2 font-bold text-white rounded transition bg-green-600 hover:bg-green-700 ${
          canSubmit ? '' : 'opacity-50 cursor-not-allowed'
        }`}
        disabled={!canSubmit}
        onClick={onSubmit}
      >
        Submit
      </button>
      {!canSubmit && (
        <div className="text-xs mt-2 text-gray-400 font-medium text-center">
          You can only submit in the last 10 minutes.
        </div>
      )}
    </div>
  )
}

export default TimerAndSubmit

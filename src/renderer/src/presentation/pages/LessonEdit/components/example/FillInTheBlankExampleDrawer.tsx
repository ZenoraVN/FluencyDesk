import React, { useState } from 'react'

interface FillInTheBlankExampleDrawerProps {
  open: boolean
  onClose: () => void
}

export const FillInTheBlankExampleDrawer: React.FC<FillInTheBlankExampleDrawerProps> = ({
  open,
  onClose
}) => {
  const [inputValue, setInputValue] = useState('')
  const [checked, setChecked] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const correctAnswer = 'is'

  // Change width to 32vw, min 400px, max 600px
  if (!open) return null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setChecked(false)
    setShowAnswer(false)
  }

  const handleCheck = () => {
    setChecked(true)
    setShowAnswer(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCheck()
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/30"
        aria-label="drawer-backdrop"
      />
      {/* Drawer */}
      <aside
        className="fixed z-50 right-0 top-0 h-full bg-white dark:bg-neutral-900 shadow-xl transition-transform duration-300"
        style={{
          width: 'min(32vw, 600px)',
          minWidth: 400,
          maxWidth: 600,
          borderLeft: '1.5px solid #e5e7eb',
          transition: 'transform 0.3s'
        }}
        aria-label="Fill-in-the-blank example drawer"
      >
        <div className="py-8 px-6 flex flex-col gap-6 h-full">
          <div>
            <h2 className="text-lg font-bold text-[#233c5c]">Fill in the Blank Example</h2>
            <p className="text-gray-600 mt-1 text-sm">
              This type of question requires students to fill in the missing word(s) in a sentence.
            </p>
          </div>
          <div>
            <p className="mb-2 font-medium text-gray-800 dark:text-gray-100">Example:</p>
            <div className="bg-gray-100 dark:bg-neutral-800 rounded-md p-4">
              <div className="text-base text-gray-900 dark:text-white mb-1 flex items-center gap-1 flex-wrap">
                The cat&nbsp;
                <input
                  className={`border-b-2 outline-none bg-transparent px-2 py-0.5 mx-1 w-20 text-center
                  ${checked ? (inputValue.trim().toLowerCase() === correctAnswer ? 'border-green-500 text-green-700' : 'border-red-400 text-red-600') : 'border-gray-400 text-gray-700 dark:text-gray-300'}
                  `}
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="____"
                  spellCheck={false}
                  aria-label="blank"
                  disabled={false}
                  style={{ minWidth: 48 }}
                />
                &nbsp;on the mat.
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
                  onClick={handleCheck}
                >
                  Check Answer
                </button>
                {showAnswer && inputValue.trim().toLowerCase() !== correctAnswer && (
                  <button
                    className="px-3 py-1 rounded bg-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-300 transition"
                    onClick={() => setInputValue(correctAnswer)}
                  >
                    Show Correct
                  </button>
                )}
              </div>
              {checked && (
                <div className="text-xs mt-2">
                  {inputValue.trim().toLowerCase() === correctAnswer ? (
                    <span className="text-green-600 font-semibold">Correct! 🎉</span>
                  ) : (
                    <span className="text-red-500 font-semibold">Incorrect. Try again!</span>
                  )}
                </div>
              )}
              {showAnswer && inputValue.trim().toLowerCase() !== correctAnswer && (
                <div className="text-xs mt-1 text-gray-500">
                  Correct answer:{' '}
                  <span className="font-semibold text-green-600">{correctAnswer}</span>
                </div>
              )}
            </div>
          </div>
          <div>
            <ul className="list-disc pl-5 text-gray-500 text-sm space-y-2">
              <li>Use blanks to indicate missing words.</li>
              <li>Promote critical thinking by omitting key vocabulary or grammatical elements.</li>
              <li>Example can include single or multiple blanks.</li>
              <li>You can interact and fill in the blank to see if your answer is correct!</li>
            </ul>
          </div>
        </div>
      </aside>
    </>
  )
}

export default FillInTheBlankExampleDrawer

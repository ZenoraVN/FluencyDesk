import React from 'react'

interface AnnotatedAnswerBoxProps {
  annotatedText?: string // allow undefined/null for safety
}

const parseAnnotatedText = (text: string | undefined | null): React.ReactNode[] => {
  if (!text || typeof text !== 'string' || text.length === 0) {
    return [<span key="empty"></span>]
  }
  // RegExp to find [ERR]...[/ERR][FIX]...[/FIX] groups
  const regex = /\[ERR](.+?)\[\/ERR]\[FIX](.+?)\[\/FIX]/gs
  const result: React.ReactNode[] = []
  let lastIndex = 0
  let match
  let keyIdx = 0

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      result.push(<span key={`norm-${keyIdx++}`}>{text.slice(lastIndex, match.index)}</span>)
    }
    result.push(
      <span
        key={`err-${keyIdx++}`}
        className="bg-red-200 text-red-900 px-0.5 rounded-sm font-semibold"
      >
        {match[1]}
      </span>
    )
    result.push(
      <span
        key={`fix-${keyIdx++}`}
        className="ml-1 bg-green-200 text-green-900 px-1 rounded-sm font-semibold"
      >
        {match[2]}
      </span>
    )
    lastIndex = regex.lastIndex
  }
  if (lastIndex < (text?.length || 0)) {
    result.push(<span key={`tail-${keyIdx++}`}>{text.slice(lastIndex)}</span>)
  }
  return result
}

export const AnnotatedAnswerBox: React.FC<AnnotatedAnswerBoxProps> = ({ annotatedText }) => {
  return (
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
      <h3 className="font-semibold text-lg mb-2 flex items-center">
        <span className="text-blue-600 mr-2">&#9998;</span>
        Your Answer with AI Corrections
      </h3>
      <div className="whitespace-pre-line leading-relaxed break-words text-gray-900">
        {parseAnnotatedText(annotatedText)}
      </div>
    </div>
  )
}

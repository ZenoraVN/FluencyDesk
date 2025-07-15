import React from 'react'

interface AnnotatedAnswerBoxProps {
  annotatedText?: string // allow undefined/null for safety
}

const parseAnnotatedText = (text: string | undefined | null): React.ReactNode[] => {
  if (!text || typeof text !== 'string' || text.length === 0) {
    // Logging for debug
    // eslint-disable-next-line no-console
    console.log('AnnotatedAnswerBox: No annotatedText provided', text)
    return [<span key="empty"></span>]
  }
  // RegExp to find [ERR]...[/ERR][FIX]...[/FIX] groups
  const regex = /\[ERR\](.+?)\[\/ERR\]\[FIX\](.+?)\[\/FIX\]/gs
  const result: React.ReactNode[] = []
  let lastIndex = 0
  let match
  let keyIdx = 0

  let found = false
  while ((match = regex.exec(text)) !== null) {
    found = true
    if (match.index > lastIndex) {
      // eslint-disable-next-line no-console
      console.log('AnnotatedAnswerBox: Normal text:', text.slice(lastIndex, match.index))
      result.push(<span key={`norm-${keyIdx++}`}>{text.slice(lastIndex, match.index)}</span>)
    }
    // eslint-disable-next-line no-console
    console.log('AnnotatedAnswerBox: Error:', match[1], 'Fix:', match[2])
    result.push(
      <span
        key={`err-${keyIdx++}`}
        className="bg-red-200 text-red-900 px-0.5 rounded-sm font-semibold"
        title="Original mistake"
      >
        {match[1]}
      </span>
    )
    result.push(
      <span
        key={`fix-${keyIdx++}`}
        className="ml-1 bg-green-200 text-green-900 px-1 rounded-sm font-semibold"
        title="Correction"
      >
        {match[2]}
      </span>
    )
    lastIndex = regex.lastIndex
  }
  if (!found) {
    // eslint-disable-next-line no-console
    console.log('AnnotatedAnswerBox: No [ERR]/[FIX] matches found in text:', text)
  }
  if (lastIndex < (text?.length || 0)) {
    result.push(<span key={`tail-${keyIdx++}`}>{text.slice(lastIndex)}</span>)
  }
  return result
}

export const AnnotatedAnswerBox: React.FC<AnnotatedAnswerBoxProps> = ({ annotatedText }) => {
  // Check if the text contains any error markup
  const hasCorrections =
    annotatedText && /\[ERR\].+?\[\/ERR\]\[FIX\].+?\[\/FIX\]/.test(annotatedText || '')
  // Logging for debug
  // eslint-disable-next-line no-console
  console.log(
    'AnnotatedAnswerBox rendered, hasCorrections:',
    hasCorrections,
    'annotatedText:',
    annotatedText
  )

  return (
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
      <h3 className="font-semibold text-lg mb-2 flex items-center">
        <span className="text-blue-600 mr-2">&#9998;</span>
        Your Answer with AI Corrections
      </h3>
      <div className="whitespace-pre-line leading-relaxed break-words text-gray-900">
        {/* Nếu không có markup thì vẫn hiển thị answer gốc */}
        {annotatedText && typeof annotatedText === 'string' && annotatedText.trim().length > 0 ? (
          hasCorrections ? (
            parseAnnotatedText(annotatedText)
          ) : (
            <span>{annotatedText}</span>
          )
        ) : (
          <span className="text-gray-500 italic">No answer to display.</span>
        )}
      </div>
    </div>
  )
}

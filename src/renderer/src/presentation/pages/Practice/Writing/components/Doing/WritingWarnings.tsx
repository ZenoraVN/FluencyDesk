import React from 'react'

interface WritingWarningsProps {
  wordCount: number
  minWords: number
  paragraphCount?: number
  minParagraphs?: number
  customWarnings?: string[]
}

const WarningIcon = () => (
  <span
    className="mr-2 text-yellow-500"
    role="img"
    aria-label="warning"
    style={{ fontSize: '1.1em' }}
  >
    ⚠️
  </span>
)

/**
 * Displays validation warnings for a writing answer: word count, paragraph count, or custom errors.
 */
const WritingWarnings: React.FC<WritingWarningsProps> = ({
  wordCount,
  minWords,
  paragraphCount,
  minParagraphs,
  customWarnings = []
}) => {
  // DEBUG: Log received props
  // eslint-disable-next-line no-console
  console.log('[WritingWarnings] props:', { wordCount, minWords, paragraphCount, minParagraphs })

  const warnings: string[] = []

  // Word count warning
  if (wordCount < minWords) {
    warnings.push(
      `Bài viết của bạn phải có tối thiểu ${minWords} từ. Hiện tại: ${wordCount}/${minWords}`
    )
  }

  // DEBUG: Condition for warning
  // eslint-disable-next-line no-console
  console.log(
    '[WritingWarnings] ParaWarn Condition',
    minParagraphs,
    paragraphCount,
    minParagraphs && minParagraphs > 0 && (paragraphCount ?? 0) < minParagraphs
  )

  // Paragraph count warning - chỉ cảnh báo nếu task yêu cầu minParagraphs > 0
  if (minParagraphs && minParagraphs > 0 && (paragraphCount ?? 0) < minParagraphs) {
    warnings.push(
      `Bài viết của bạn phải có tối thiểu ${minParagraphs} đoạn văn (phân tách bằng dòng trống). Hiện tại: ${paragraphCount ?? 0}/${minParagraphs}`
    )
  }

  // Push any additional custom warnings
  if (customWarnings.length > 0) {
    warnings.push(...customWarnings)
  }

  if (warnings.length === 0) return null

  return (
    <div className="bg-white dark:bg-gray-900 border rounded-xl p-4 flex flex-col gap-2 mt-2 w-full">
      {warnings.map((w, idx) => (
        <div key={idx} className="flex items-center text-xs text-yellow-600 font-semibold">
          <WarningIcon />
          <span>{w}</span>
        </div>
      ))}
    </div>
  )
}

export default WritingWarnings

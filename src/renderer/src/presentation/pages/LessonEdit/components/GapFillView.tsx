import { FC } from 'react'

interface GapFillViewProps {
  content: string
  onBlankClick?: (hex: string) => void
  onBlankRemove?: (hex: string) => void
  selectedBlankId?: string | null
  className?: string
}

export const GapFillView: FC<GapFillViewProps> = ({
  content,
  onBlankClick,
  onBlankRemove,
  selectedBlankId,
  className = ''
}) => {
  const renderContent = () => {
    if (!content) return null

    const parts = content.split(/(\*\*\*[A-Fa-f0-9]{6}\*\*\*)/gi)
    return parts.map((part: string, index: number) => {
      const match = part.match(/\*\*\*([A-Fa-f0-9]{6})\*\*\*/i)
      if (match) {
        const hex = match[1]
        const bgColor = `#${hex}80`
        const borderColor = selectedBlankId === hex ? '#3b82f6' : `#${hex}`
        return (
          <div key={index} className="blank-wrapper inline-flex items-center mx-1">
            <button
              type="button"
              onClick={() => onBlankClick?.(hex)}
              className="blank-button flex items-center px-1 py-0.5 rounded transition-all"
              style={{
                backgroundColor: bgColor,
                border: `1px solid ${borderColor}`
              }}
            >
              <span style={{ color: `#${hex}` }}>___</span>
            </button>
          </div>
        )
      }
      return (
        <span
          key={index}
          className="prose prose-sm max-w-none break-words break-all whitespace-pre-wrap leading-relaxed"
          dangerouslySetInnerHTML={{ __html: part }}
        />
      )
    })
  }

  return (
    <div className={`text-[#2D3748] leading-relaxed text-base ${className}`}>{renderContent()}</div>
  )
}

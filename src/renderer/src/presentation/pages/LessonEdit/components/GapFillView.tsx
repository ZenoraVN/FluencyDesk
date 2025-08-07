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

    const parts = content.split(/(\*\*\*[a-f0-9]{6}\*\*\*)/g)
    return parts.map((part: string, index: number) => {
      const match = part.match(/\*\*\*([a-f0-9]{6})\*\*\*/)
      if (match) {
        const hex = match[1]
        const bgColor = `#${hex}33`
        const borderColor = selectedBlankId === hex ? '#3b82f6' : `#${hex}`
        return (
          <span key={index} className="blank-wrapper inline-flex items-center mx-1">
            <button
              type="button"
              onClick={() => onBlankClick?.(hex)}
              className="blank-button flex items-center px-2 py-1 rounded transition-all"
              style={{
                backgroundColor: bgColor,
                border: `1px solid ${borderColor}`
              }}
            >
              <span style={{ color: `#${hex}` }}>___</span>
            </button>
            <button
              type="button"
              className="delete-blank ml-1 text-red-500 hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation()
                onBlankRemove?.(hex)
              }}
            >
              ✕
            </button>
          </span>
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

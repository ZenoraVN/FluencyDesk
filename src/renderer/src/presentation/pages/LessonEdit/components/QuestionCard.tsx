import React from 'react'

import * as LucideIcons from 'lucide-react'

interface SkillBadge {
  icon: React.ReactNode
  color: string
  label: string
}

interface QuestionCardProps {
  name: string
  purpose: string
  icon: keyof typeof LucideIcons
  color: string
  skills: SkillBadge[]
  onView: () => void
  onCreate: () => void
  showTooltip?: boolean
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  name,
  purpose,
  icon,
  color,
  skills,
  onView,
  onCreate,
  showTooltip = true
}) => {
  const IconComp = (LucideIcons as any)[icon] as React.FC<{ size?: number; color?: string }>
  // Helper for background with alpha, fallback if not supplied hex
  function hexToRgba(hex: string, alpha: number): string {
    let c = hex.replace('#', '')
    if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2]
    const num = parseInt(c, 16)
    return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`
  }

  return (
    <div
      className="relative w-full h-full border border-gray-300 rounded-xl transition-all group flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 hover:scale-[1.01]"
      style={{ borderTop: `4px solid ${color}` }}
    >
      {/* Row: Icon badge + tên dạng câu hỏi */}
      <div className="flex flex-row items-center pt-6 pl-5 pr-5 pb-1 gap-3">
        {/* Badge icon dạng câu hỏi */}
        <span
          className="flex items-center justify-center rounded-[8px]"
          style={{
            background: hexToRgba(color, 0.18),
            width: 40,
            height: 40,
            minWidth: 40,
            minHeight: 40
          }}
        >
          {IconComp && (
            <span style={{ color: color }}>
              <IconComp size={22} />
            </span>
          )}
        </span>
        {/* Tên câu hỏi */}
        <h3 className="text-base font-semibold text-[#233c5c]">{name}</h3>
      </div>
      {/* Purpose mô tả */}
      <div className="relative px-5 mb-2">
        <p
          className="text-sm text-gray-600 min-h-[48px] line-clamp-3"
          title={showTooltip && purpose.length > 60 ? purpose : undefined}
        >
          {purpose}
        </p>
      </div>
      {/* Footer: skill icon và action badge */}
      <div className="flex items-end justify-between px-5 pb-3 pt-0 w-full">
        {/* Skill icon group: remove color badges, show icons colored, bottom left */}
        <div className="flex flex-row gap-2 items-end">
          {skills.map((s, idx) => (
            <span
              key={s.label + idx}
              className="flex items-center transition-colors"
              title={s.label}
              style={{
                lineHeight: 0,
                color: s.color
              }}
            >
              {s.icon && React.isValidElement(s.icon)
                ? React.cloneElement(s.icon as React.ReactElement, {
                    style: { width: 18, height: 18, color: s.color }
                  })
                : null}
            </span>
          ))}
        </div>
        <div className="flex gap-3">
          {/* Eye button */}
          <button
            title="View"
            className="flex items-center gap-1 rounded-[8px]  transition group/card-action"
            onClick={onView}
            style={{ outline: 'none' }}
          >
            <LucideIcons.LucideEye
              size={20}
              className="text-gray-400 group-hover/card-action:text-blue-600 transition-colors"
            />
          </button>
          {/* Plus button */}
          <button
            title="Create"
            className="flex items-center gap-1 rounded-[8px]  transition group/card-action"
            onClick={onCreate}
            style={{ outline: 'none' }}
          >
            <LucideIcons.LucidePlus
              size={20}
              className="text-gray-400 group-hover/card-action:text-green-600 transition-colors"
            />
          </button>
        </div>
      </div>
    </div>
  )
}

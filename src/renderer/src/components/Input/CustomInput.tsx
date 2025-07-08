import { FC, useState, useEffect, useRef, KeyboardEvent } from 'react'

export interface CustomInputProps {
  value: string
  onChange: (value: string) => void
  className?: string
  onKeyDown?: (e: KeyboardEvent<HTMLDivElement>) => void
  onFocus?: () => void
  disabled?: boolean
  [key: string]: any // allows extra props, like id, data-*, style, etc.
}

export const CustomInput: FC<CustomInputProps> = ({
  value,
  onChange,
  className = '',
  onKeyDown,
  onFocus,
  disabled = false,
  ...rest
}) => {
  const [, setIsFocused] = useState(false)
  const divRef = useRef<HTMLDivElement>(null)
  const isFocusedRef = useRef(false)

  const recalcHeight = () => {
    if (!divRef.current) return
    if (isFocusedRef.current || (divRef.current.innerText ?? '').trim() !== '') {
      divRef.current.style.height = 'auto'
      divRef.current.style.height = `${divRef.current.scrollHeight}px`
    } else {
      divRef.current.style.height = '20px'
    }
  }

  useEffect(() => {
    if (divRef.current && divRef.current.innerText !== value) {
      divRef.current.innerText = value
      recalcHeight()
    }
  }, [value])

  const handleInput = () => {
    if (!divRef.current || disabled) return
    const text = divRef.current.innerText ?? ''
    onChange(text)
    recalcHeight()
  }

  useEffect(() => {
    if (!divRef.current) return
    requestAnimationFrame(() => {
      if (!divRef.current) return
      recalcHeight()
    })
  }, [value])

  return (
    <div
      className={`relative ${className} rounded-lg border border-[#ddd] p-2 ${
        disabled ? 'bg-gray-100 cursor-not-allowed opacity-70' : ''
      }`}
      style={{ borderRadius: 8, ...(rest.style || {}) }}
      {...rest}
    >
      <div
        ref={divRef}
        contentEditable={!disabled}
        suppressContentEditableWarning
        spellCheck={true}
        onInput={handleInput}
        onFocus={() => {
          if (disabled) return
          setIsFocused(true)
          isFocusedRef.current = true
          onFocus?.()
          recalcHeight()
        }}
        onBlur={() => {
          setIsFocused(false)
          isFocusedRef.current = false
          recalcHeight()
        }}
        onKeyDown={onKeyDown}
        className="w-full outline-none bg-transparent text-[#2D3748] min-h-[20px] relative"
        style={{
          minHeight: 20,
          whiteSpace: 'pre-wrap',
          boxSizing: 'border-box',
          overflow: 'auto',
          pointerEvents: disabled ? 'none' : 'auto'
        }}
        aria-disabled={disabled}
      />
    </div>
  )
}

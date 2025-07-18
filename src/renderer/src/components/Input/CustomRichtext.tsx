import { FC, useState, useRef, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Color from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Palette
} from 'lucide-react'

interface RichtextchtEditorProps {
  value: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
  count?: boolean
  min?: boolean
  hideToolbar?: boolean
  hideColor?: boolean // NEW: hide color picker button if true
}

export const RichtextchtEditor: FC<RichtextchtEditorProps> = ({
  value,
  onChange,
  className = '',
  placeholder = 'Type here...',
  count = true,
  min = false,
  hideToolbar = false,
  hideColor = false
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [isFocused, setIsFocused] = useState(false)
  const colorPickerRef = useRef<HTMLDivElement>(null)

  // Count words and characters
  const updateCounts = (text: string) => {
    const cleanText = text
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    setCharCount(cleanText.length)
    const words = cleanText.split(/\s+/).filter((word) => word.length > 0)
    setWordCount(words.length)
  }

  // Close color picker on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Initialize tiptap editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: { HTMLAttributes: {} }
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: {
          style:
            'background-color: #fef08a; border-radius: 2px; padding: 0 2px; margin: 0 -2px; border-bottom: 2px solid #f59e0b;'
        }
      })
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      const text = editor.getText()
      const cleanHtml = html.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim()
      onChange(cleanHtml)
      updateCounts(text)
    }
  })

  // Sync prop value to editor
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', false)
    }
  }, [value, editor])

  // Is the editor empty?
  const isEmpty = !value || value.trim() === '' || value === '<p></p>' || value === '<p><br></p>'

  // Minimal mode (no toolbar, no count)
  const isMinimal = min && !count

  return (
    <div
      className={`${isMinimal ? 'h-10 relative' : 'space-y-2'} rounded-lg bg-gray-50 ${className}`}
    >
      {/* Toolbar (shown unless min or hideToolbar) */}
      {!isMinimal && !hideToolbar && (
        <div
          className={`flex items-center gap-1 p-1 border border-[#52aaa5]/20 rounded-t-lg ${className}`}
        >
          <div className="flex items-center gap-1 pr-2 border-r border-[#52aaa5]/20">
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`p-2 rounded hover:bg-[#52aaa5]/10 ${
                editor?.isActive('heading', { level: 1 })
                  ? 'bg-[#52aaa5]/20 border border-[#52aaa5]/40'
                  : ''
              }`}
            >
              <Heading1 size={18} className="text-[#2D3748]" />
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-2 rounded hover:bg-[#52aaa5]/10 ${
                editor?.isActive('heading', { level: 2 })
                  ? 'bg-[#52aaa5]/20 border border-[#52aaa5]/40'
                  : ''
              }`}
            >
              <Heading2 size={18} className="text-[#2D3748]" />
            </button>
          </div>
          <div className="flex items-center gap-1 px-2 border-r border-[#52aaa5]/20">
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={`p-2 rounded hover:bg-[#52aaa5]/10 ${
                editor?.isActive('bold') ? 'bg-[#52aaa5]/20 border border-[#52aaa5]/40' : ''
              }`}
            >
              <Bold size={18} className="text-[#2D3748]" />
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={`p-2 rounded hover:bg-[#52aaa5]/10 ${
                editor?.isActive('italic') ? 'bg-[#52aaa5]/20 border border-[#52aaa5]/40' : ''
              }`}
            >
              <Italic size={18} className="text-[#2D3748]" />
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleUnderline().run()}
              className={`p-2 rounded hover:bg-[#52aaa5]/10 ${
                editor?.isActive('underline') ? 'bg-[#52aaa5]/20 border border-[#52aaa5]/40' : ''
              }`}
            >
              <UnderlineIcon size={18} className="text-[#2D3748]" />
            </button>
          </div>
          {/* Color picker block, conditionally hidden */}
          {!hideColor && (
            <div className="relative flex items-center gap-1 px-2 border-r border-[#52aaa5]/20">
              <button
                type="button"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className={`p-2 rounded hover:bg-[#52aaa5]/10 ${
                  showColorPicker ? 'bg-[#52aaa5]/20' : ''
                }`}
              >
                <Palette size={18} className="text-[#2D3748]" />
              </button>
              {showColorPicker && (
                <div
                  ref={colorPickerRef}
                  className="absolute top-full left-0 mt-1 p-2 bg-white border border-[#52aaa5]/20 rounded-lg shadow-lg z-10"
                >
                  {/* All quick access colors: black, white, red, green, blue, yellow */}
                  <div className="flex items-center gap-2 mb-2">
                    {[
                      { value: '#000000' }, // Black
                      { value: '#FFFFFF', border: true }, // White
                      { value: '#FF0000' }, // Red
                      { value: '#008000' }, // Green
                      { value: '#0000FF' }, // Blue
                      { value: '#FFD700' } // Yellow
                    ].map((color, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          editor?.chain().focus().setColor(color.value).run()
                          setShowColorPicker(false)
                        }}
                        className={`w-6 h-6 border ${color.border ? 'border-gray-300' : 'border-[#e5e7eb]'} rounded-lg shadow-sm transition-transform hover:scale-110 hover:shadow-md`}
                        style={{ backgroundColor: color.value, borderRadius: 8 }}
                        title={color.value}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="flex items-center gap-1 px-2">
            <button
              type="button"
              onClick={() => editor?.chain().focus().setTextAlign('left').run()}
              className={`p-2 rounded hover:bg-[#52aaa5]/10 ${
                editor?.isActive({ textAlign: 'left' })
                  ? 'bg-[#52aaa5]/20 border border-[#52aaa5]/40'
                  : ''
              }`}
            >
              <AlignLeft size={18} className="text-[#2D3748]" />
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().setTextAlign('center').run()}
              className={`p-2 rounded hover:bg-[#52aaa5]/10 ${
                editor?.isActive({ textAlign: 'center' })
                  ? 'bg-[#52aaa5]/20 border border-[#52aaa5]/40'
                  : ''
              }`}
            >
              <AlignCenter size={18} className="text-[#2D3748]" />
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().setTextAlign('right').run()}
              className={`p-2 rounded hover:bg-[#52aaa5]/10 ${
                editor?.isActive({ textAlign: 'right' })
                  ? 'bg-[#52aaa5]/20 border border-[#52aaa5]/40'
                  : ''
              }`}
            >
              <AlignRight size={18} className="text-[#2D3748]" />
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative w-full">
        {/* Placeholder */}
        {isEmpty && !isFocused && (
          <div
            className={`
              pointer-events-none select-none absolute left-3
              ${isMinimal ? 'top-1/2 -translate-y-1/2 text-base leading-none' : 'top-4'}
              text-[#718096] opacity-70
            `}
            style={{ zIndex: 1 }}
          >
            {placeholder}
          </div>
        )}
        {/* @ts-ignore: Tiptap EditorContent doesn't have onFocus/onBlur DOM events but they work */}
        <EditorContent
          editor={editor}
          className={
            (isMinimal ? 'px-3 py-0 text-base h-full min-h-0' : 'min-h-[100px] p-3 pb-8') +
            ' border border-[#52aaa5]/20 rounded-lg text-[#2D3748] w-full outline-none bg-transparent ' +
            className
          }
          style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflowWrap: 'anywhere',
            ...(isMinimal
              ? {
                  minHeight: '2.5rem',
                  maxHeight: '2.5rem',
                  height: '2.5rem',
                  overflow: 'hidden',
                  lineHeight: '2.25rem',
                  boxSizing: 'border-box',
                  paddingTop: 0,
                  paddingBottom: 0,
                  marginTop: 0,
                  marginBottom: 0
                }
              : {}),
            borderRadius: 8
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {count && (
          <div
            className={`absolute ${
              isMinimal ? 'bottom-1 right-2 text-xs' : 'bottom-2 right-3'
            } flex gap-4 text-sm text-[#52aaa5]/70`}
          >
            <span className={className}>{wordCount} words</span>
            <span className={className}>{charCount} characters</span>
          </div>
        )}
      </div>
      <style>{`
        .ProseMirror {
          min-height: 100px;
          outline: none;
          color: #2D3748;
          white-space: pre-wrap !important;
          word-break: break-word !important;
          overflow-wrap: anywhere !important;
        }
        .ProseMirror p {
          margin: 0.5em 0;
        }
        .ProseMirror h1 {
          font-size: 1.5em;
          font-weight: 600;
          margin: 0.5em 0;
          color: #2D3748;
        }
        .ProseMirror h2 {
          font-size: 1.3em;
          font-weight: 600;
          margin: 0.5em 0;
          color: #2D3748;
        }
        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5em;
          margin: 0.5em 0;
        }
        .ProseMirror li {
          margin: 0.2em 0;
        }
        .ProseMirror li p {
          margin: 0;
        }
      `}</style>
    </div>
  )
}

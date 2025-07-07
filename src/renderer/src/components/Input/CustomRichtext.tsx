import { FC, useState, useRef, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Palette,
} from "lucide-react";

const COLORS = [
  { value: "#000000" },
  { value: "#FF0000" },
  { value: "#008000" },
  { value: "#0000FF" },
  { value: "#800080" },
  { value: "#FFA500" },
  { value: "#FF69B4" },
  { value: "#4B0082" },
  { value: "#008080" },
  { value: "#800000" },
  { value: "#FFD700" },
  { value: "#4169E1" },
];

interface RichtextchtEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  count?: boolean; // thêm
  min?: boolean; // thêm
}

export const RichtextchtEditor: FC<RichtextchtEditorProps> = ({
  value,
  onChange,
  className = "",
  placeholder = "Type here...",
  count = true,
  min = false,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  // Đếm số từ, ký tự
  const updateCounts = (text: string) => {
    const cleanText = text
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    setCharCount(cleanText.length);
    const words = cleanText.split(/\s+/).filter((word) => word.length > 0);
    setWordCount(words.length);
  };

  // Đóng color picker nếu click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target as Node)
      ) {
        setShowColorPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Khởi tạo tiptap editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: { HTMLAttributes: {} },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: {
          style:
            "background-color: #fef08a; border-radius: 2px; padding: 0 2px; margin: 0 -2px; border-bottom: 2px solid #f59e0b;",
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = editor.getText();
      const cleanHtml = html
        .replace(/\s+/g, " ")
        .replace(/>\s+</g, "><")
        .trim();
      onChange(cleanHtml);
      updateCounts(text);
    },
  });

  // Sync value từ ngoài vào editor nếu value prop thay đổi
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", false);
    }
  }, [value, editor]);

  // Kiểm tra editor có rỗng hay không
  const isEmpty =
    !value ||
    value.trim() === "" ||
    value === "<p></p>" ||
    value === "<p><br></p>";

  // Dạng đơn giản (min)
  const isMinimal = min && !count;

  return (
    <div
      className={`${
        isMinimal ? "h-10 flex items-center relative" : "space-y-2"
      } rounded-lg ${className}`}
    >
      {/* Toolbar -- chỉ hiện nếu không phải min */}
      {!isMinimal && (
        <div
          className={`flex items-center gap-1 p-1 border border-[#52aaa5]/20 rounded-t-lg ${className}`}
        >
          <div className="flex items-center gap-1 pr-2 border-r border-[#52aaa5]/20">
            <button
              type="button"
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={`p-2 rounded hover:bg-[#52aaa5]/10 ${
                editor?.isActive("heading", { level: 1 })
                  ? "bg-[#52aaa5]/20 border border-[#52aaa5]/40"
                  : ""
              }`}
            >
              <Heading1 size={18} className="text-[#2D3748]" />
            </button>
            <button
              type="button"
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={`p-2 rounded hover:bg-[#52aaa5]/10 ${
                editor?.isActive("heading", { level: 2 })
                  ? "bg-[#52aaa5]/20 border border-[#52aaa5]/40"
                  : ""
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
                editor?.isActive("bold")
                  ? "bg-[#52aaa5]/20 border border-[#52aaa5]/40"
                  : ""
              }`}
            >
              <Bold size={18} className="text-[#2D3748]" />
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={`p-2 rounded hover:bg-[#52aaa5]/10 ${
                editor?.isActive("italic")
                  ? "bg-[#52aaa5]/20 border border-[#52aaa5]/40"
                  : ""
              }`}
            >
              <Italic size={18} className="text-[#2D3748]" />
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleUnderline().run()}
              className={`p-2 rounded hover:bg-[#52aaa5]/10 ${
                editor?.isActive("underline")
                  ? "bg-[#52aaa5]/20 border border-[#52aaa5]/40"
                  : ""
              }`}
            >
              <UnderlineIcon size={18} className="text-[#2D3748]" />
            </button>
          </div>
          <div className="relative flex items-center gap-1 px-2 border-r border-[#52aaa5]/20">
            <button
              type="button"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className={`p-2 rounded hover:bg-[#52aaa5]/10 ${
                showColorPicker ? "bg-[#52aaa5]/20" : ""
              }`}
            >
              <Palette size={18} className="text-[#2D3748]" />
            </button>
            {showColorPicker && (
              <div
                ref={colorPickerRef}
                className="absolute top-full left-0 mt-1 p-2 bg-white border border-[#52aaa5]/20 rounded-lg shadow-lg z-10"
              >
                <div className="grid grid-cols-4 gap-2">
                  {COLORS.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        editor?.chain().focus().setColor(color.value).run();
                        setShowColorPicker(false);
                      }}
                      className="w-6 h-6 rounded-full transition-transform hover:scale-125 hover:shadow-md"
                      style={{ backgroundColor: color.value }}
                      title={color.value}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 px-2">
            <button
              type="button"
              onClick={() => editor?.chain().focus().setTextAlign("left").run()}
              className={`p-2 rounded hover:bg-[#52aaa5]/10 ${
                editor?.isActive({ textAlign: "left" })
                  ? "bg-[#52aaa5]/20 border border-[#52aaa5]/40"
                  : ""
              }`}
            >
              <AlignLeft size={18} className="text-[#2D3748]" />
            </button>
            <button
              type="button"
              onClick={() =>
                editor?.chain().focus().setTextAlign("center").run()
              }
              className={`p-2 rounded hover:bg-[#52aaa5]/10 ${
                editor?.isActive({ textAlign: "center" })
                  ? "bg-[#52aaa5]/20 border border-[#52aaa5]/40"
                  : ""
              }`}
            >
              <AlignCenter size={18} className="text-[#2D3748]" />
            </button>
            <button
              type="button"
              onClick={() =>
                editor?.chain().focus().setTextAlign("right").run()
              }
              className={`p-2 rounded hover:bg-[#52aaa5]/10 ${
                editor?.isActive({ textAlign: "right" })
                  ? "bg-[#52aaa5]/20 border border-[#52aaa5]/40"
                  : ""
              }`}
            >
              <AlignRight size={18} className="text-[#2D3748]" />
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative w-full">
        {/* Placeholder: có min thì style thấp, không thì normal */}
        {isEmpty && !isFocused && (
          <div
            className={`
              pointer-events-none select-none absolute left-3
              ${
                isMinimal
                  ? "top-1/2 -translate-y-1/2 text-base leading-none"
                  : "top-4"
              }
              text-[#718096] opacity-70
            `}
            style={{ zIndex: 1 }}
          >
            {placeholder}
          </div>
        )}
        {/* @ts-ignore: Tiptap EditorContent không có type onFocus/onBlur nhưng vẫn nhận DOM event */}
        <EditorContent
          editor={editor}
          className={
            (isMinimal
              ? "px-3 py-0 text-base h-full min-h-0 flex items-center"
              : "min-h-[100px] p-3 pb-8") +
            " border border-[#52aaa5]/20 rounded-lg text-[#2D3748] w-full outline-none bg-transparent " +
            className
          }
          style={
            isMinimal
              ? {
                  minHeight: "2.5rem", // = h-10 (40px) and matches TextEditor
                  maxHeight: "2.5rem",
                  height: "2.5rem",
                  overflow: "hidden",
                  lineHeight: "2.25rem",
                  display: "flex",
                  alignItems: "center",
                  boxSizing: "border-box",
                  paddingTop: 0,
                  paddingBottom: 0,
                  marginTop: 0,
                  marginBottom: 0,
                }
              : {
                  whiteSpace: "pre-wrap",
                }
          }
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {count && (
          <div
            className={`absolute ${
              isMinimal ? "bottom-1 right-2 text-xs" : "bottom-2 right-3"
            } flex gap-4 text-sm text-[#52aaa5]/70`}
          >
            <span className={` ${className}`}>{wordCount} từ</span>
            <span className={` ${className}`}>{charCount} ký tự</span>
          </div>
        )}
      </div>
      <style>{`
        .ProseMirror {
          min-height: 100px;
          outline: none;
          color: #2D3748;
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
  );
};

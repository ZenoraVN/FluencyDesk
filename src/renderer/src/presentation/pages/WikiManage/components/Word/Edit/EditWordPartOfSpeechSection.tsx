export const allPartsOfSpeech = [
  {
    value: "noun",
    label: "Danh từ",
    color: "text-emerald-600",
    focus: "focus-visible:ring-emerald-200",
    hover: "hover:text-emerald-600",
    outline: "outline-emerald-400",
  },
  {
    value: "verb",
    label: "Động từ",
    color: "text-indigo-600",
    focus: "focus-visible:ring-indigo-200",
    hover: "hover:text-indigo-600",
    outline: "outline-indigo-400",
  },
  {
    value: "adjective",
    label: "Tính từ",
    color: "text-amber-600",
    focus: "focus-visible:ring-amber-200",
    hover: "hover:text-amber-600",
    outline: "outline-amber-400",
  },
  {
    value: "adverb",
    label: "Trạng từ",
    color: "text-rose-600",
    focus: "focus-visible:ring-rose-200",
    hover: "hover:text-rose-600",
    outline: "outline-rose-400",
  },
  {
    value: "article",
    label: "Mạo từ",
    color: "text-gray-600",
    hover: "hover:text-gray-900",
    outline: "outline-gray-400",
  },
  {
    value: "pronoun",
    label: "Đại từ",
    color: "text-gray-600",
    hover: "hover:text-gray-900",
    outline: "outline-gray-400",
  },
  {
    value: "preposition",
    label: "Giới từ",
    color: "text-gray-600",
    hover: "hover:text-gray-900",
    outline: "outline-gray-400",
  },
  {
    value: "conjunction",
    label: "Liên từ",
    color: "text-gray-600",
    hover: "hover:text-gray-900",
    outline: "outline-gray-400",
  },
  {
    value: "determiner",
    label: "Từ hạn định",
    color: "text-gray-600",
    hover: "hover:text-gray-900",
    outline: "outline-gray-400",
  },
  {
    value: "interjection",
    label: "Thán từ",
    color: "text-gray-600",
    hover: "hover:text-gray-900",
    outline: "outline-gray-400",
  },
  {
    value: "auxiliary",
    label: "Trợ động từ",
    color: "text-gray-600",
    hover: "hover:text-gray-900",
    outline: "outline-gray-400",
  },
  {
    value: "numeral",
    label: "Số từ",
    color: "text-gray-600",
    hover: "hover:text-gray-900",
    outline: "outline-gray-400",
  },
  {
    value: "particle",
    label: "Tiểu từ",
    color: "text-gray-600",
    hover: "hover:text-gray-900",
    outline: "outline-gray-400",
  },
  {
    value: "exclamative",
    label: "Từ cảm thán",
    color: "text-gray-600",
    hover: "hover:text-gray-900",
    outline: "outline-gray-400",
  },
];

interface EditWordPartOfSpeechSectionProps {
  selected: string;
  onChange: (newValue: string) => void;
  size?: "sm" | "md";
}

export function EditWordPartOfSpeechSection({
  selected,
  onChange,
}: EditWordPartOfSpeechSectionProps) {
  return (
    <div className="flex flex-wrap gap-2 border border-[#ddd] rounded-lg p-2 mb-4 hover:outline hover:outline-[#52aaa5] hover:outline-1">
      {allPartsOfSpeech.map(({ value, label, color, hover, outline }) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className={`
            px-3 py-1 rounded-lg font-medium border border-transparent
            text-gray-500 transition text-sm
            ${hover} 
            ${
              selected === value
                ? `${color} outline outline-2 ${outline} bg-white`
                : ""
            }
          `}
          style={selected === value ? { zIndex: 2 } : undefined}
          aria-pressed={selected === value}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

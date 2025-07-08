const allPhrasePartsOfSpeech = [
  {
    value: "noun_phrase",
    label: "Cụm danh từ",
    color: "text-emerald-600",
    outline: "outline-emerald-400",
    hover: "hover:text-emerald-600",
  },
  {
    value: "verb_phrase",
    label: "Cụm động từ",
    color: "text-indigo-600",
    outline: "outline-indigo-400",
    hover: "hover:text-indigo-600",
  },
  {
    value: "adjective_phrase",
    label: "Cụm tính từ",
    color: "text-amber-600",
    outline: "outline-amber-400",
    hover: "hover:text-amber-600",
  },
  {
    value: "adverb_phrase",
    label: "Cụm trạng từ",
    color: "text-rose-600",
    outline: "outline-rose-400",
    hover: "hover:text-rose-600",
  },
  {
    value: "phrasal_verb",
    label: "Cụm động từ (Phrasal verb)",
    color: "text-blue-600",
    outline: "outline-blue-400",
    hover: "hover:text-blue-600",
  },
  {
    value: "idiom",
    label: "Thành ngữ (Idiom)",
    color: "text-orange-600",
    outline: "outline-orange-400",
    hover: "hover:text-orange-600",
  },
  {
    value: "prepositional_phrase",
    label: "Cụm giới từ",
    color: "text-gray-600",
    hover: "hover:text-gray-900",
    outline: "outline-gray-400",
  },
  {
    value: "gerund_phrase",
    label: "Cụm V-ing (Gerund phrase)",
    color: "text-gray-600",
    hover: "hover:text-gray-900",
    outline: "outline-gray-400",
  },
  {
    value: "infinitive_phrase",
    label: "Cụm to-V (Infinitive phrase)",
    color: "text-gray-600",
    hover: "hover:text-gray-900",
    outline: "outline-gray-400",
  },
  {
    value: "participial_phrase",
    label: "Cụm phân từ (Participial phrase)",
    color: "text-gray-600",
    hover: "hover:text-gray-900",
    outline: "outline-gray-400",
  },
  {
    value: "absolute_phrase",
    label: "Absolute phrase",
    color: "text-gray-600",
    hover: "hover:text-gray-900",
    outline: "outline-gray-400",
  },
  {
    value: "appositive_phrase",
    label: "Cụm đồng vị (Appositive phrase)",
    color: "text-gray-600",
    hover: "hover:text-gray-900",
    outline: "outline-gray-400",
  },
  {
    value: "collocation",
    label: "Cụm collocation",
    color: "text-gray-600",
    hover: "hover:text-gray-900",
    outline: "outline-gray-400",
  },
  {
    value: "fixed_expression",
    label: "Cấu trúc cố định (Fixed expression)",
    color: "text-gray-600",
    hover: "hover:text-gray-900",
    outline: "outline-gray-400",
  },
];

interface EditPhrasePartOfSpeechSectionProps {
  selected: string;
  onChange: (newValue: string) => void;
  size?: "sm" | "md";
}

export function EditPhrasePartOfSpeechSection({
  selected,
  onChange,
}: EditPhrasePartOfSpeechSectionProps) {
  return (
    <div className="flex flex-wrap gap-2 border border-[#ddd] rounded-lg p-2 mb-4 hover:outline hover:outline-[#52aaa5] hover:outline-1">
      {allPhrasePartsOfSpeech.map(({ value, label, color, outline, hover }) => (
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

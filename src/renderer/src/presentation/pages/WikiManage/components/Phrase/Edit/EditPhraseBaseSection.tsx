import { Input } from "../../../../../components/ui/input";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

const frequencyLabels = {
  high: { label: "Cao", color: "bg-green-100 text-green-700 border-green-200" },
  medium: {
    label: "Trung bình",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  low: { label: "Thấp", color: "bg-red-100 text-red-700 border-red-200" },
};
const levelLabels = {
  beginner: {
    label: "Beginner",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  intermediate: {
    label: "Intermediate",
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
  advanced: {
    label: "Advanced",
    color: "bg-pink-100 text-pink-700 border-pink-200",
  },
};

type ApiStatus = "idle" | "success" | "error" | "modified";
type EditingField =
  | "phrase"
  | "pronunciation"
  | "frequency"
  | "language_level"
  | null;

interface FieldStatuses {
  phrase: ApiStatus;
  pronunciation: ApiStatus;
  frequency: ApiStatus;
  language_level: ApiStatus;
  images: ApiStatus;
}

interface EditPhraseBaseSectionProps {
  phrase: string;
  pronunciation: string;
  frequency: string;
  languageLevel: string;
  fieldStatuses: FieldStatuses;
  onChange: (field: EditingField, value: string) => void;
  onSave: (field: EditingField, value?: string) => void;
  onCancel: (field: EditingField) => void;
}

const getStatusIcon = (status: ApiStatus) => {
  switch (status) {
    case "success":
      return <CheckCircle2 className="w-5 h-5 text-[#52aaa5]" />;
    case "error":
      return <XCircle className="w-5 h-5 text-red-500" />;
    case "modified":
      return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    default:
      return <CheckCircle2 className="w-5 h-5 text-[#52aaa5] opacity-0" />;
  }
};

export function EditPhraseBaseSection({
  phrase,
  pronunciation,
  frequency,
  languageLevel,
  fieldStatuses,
  onChange,
  onSave,
  onCancel,
}: EditPhraseBaseSectionProps) {
  return (
    <div className="space-y-6">
      {/* Phrase and pronunciation */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            value={phrase}
            onChange={(e) => onChange("phrase", e.target.value)}
            className="text-2xl font-semibold text-[#2D3748] bg-transparent border-b border-[#52aaa5] outline-none focus:border-b-2"
            onKeyDown={(e) => e.key === "Enter" && onSave("phrase", phrase)}
            aria-label="Cụm từ"
            aria-describedby="phrase-description"
            autoFocus
          />
          <span id="phrase-description" className="sr-only">
            Nhập cụm từ cần chỉnh sửa
          </span>
          <button
            onClick={() =>
              fieldStatuses.phrase === "modified"
                ? onSave("phrase", phrase)
                : onCancel("phrase")
            }
            className={`p-1 rounded-full hover:bg-gray-100 transition-colors ${
              !fieldStatuses.phrase || fieldStatuses.phrase === "idle"
                ? "hidden"
                : ""
            }`}
          >
            {getStatusIcon(fieldStatuses.phrase)}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="text"
            value={pronunciation}
            onChange={(e) => onChange("pronunciation", e.target.value)}
            className="text-lg text-[#718096] font-medium bg-transparent border-b border-[#52aaa5] outline-none focus:border-b-2"
            onKeyDown={(e) =>
              e.key === "Enter" && onSave("pronunciation", pronunciation)
            }
            aria-label="Phát âm"
            aria-describedby="pronunciation-description"
          />
          <span id="pronunciation-description" className="sr-only">
            Nhập cách phát âm của cụm từ
          </span>
          <button
            onClick={() =>
              fieldStatuses.pronunciation === "modified"
                ? onSave("pronunciation", pronunciation)
                : onCancel("pronunciation")
            }
            className={`p-1 rounded-full hover:bg-gray-100 transition-colors ${
              !fieldStatuses.pronunciation ||
              fieldStatuses.pronunciation === "idle"
                ? "hidden"
                : ""
            }`}
            aria-label={
              fieldStatuses.pronunciation === "modified"
                ? "Lưu phát âm"
                : "Hủy thay đổi phát âm"
            }
          >
            {getStatusIcon(fieldStatuses.pronunciation)}
          </button>
        </div>
      </div>
      {/* Frequency */}
      <div className="space-y-4">
        <h3 className="text-[#2D3748] font-medium mb-2">Tần suất sử dụng</h3>
        <div className="flex gap-2" role="group" aria-label="Tần suất sử dụng">
          {Object.entries(frequencyLabels).map(([value, { label, color }]) => (
            <button
              key={value}
              onClick={() => onChange("frequency", value)}
              className={`px-3 py-1 rounded-lg border transition-all ${
                frequency === value
                  ? color + " border-current"
                  : color.replace("text-", "text-opacity-60 text-") +
                    " border-transparent"
              }`}
              aria-pressed={frequency === value}
            >
              {label}
            </button>
          ))}
        </div>
        <h3 className="text-[#2D3748] font-medium mb-2 mt-4">
          Cấp độ ngôn ngữ
        </h3>
        <div className="flex gap-2" role="group" aria-label="Cấp độ ngôn ngữ">
          {Object.entries(levelLabels).map(([value, { label, color }]) => (
            <button
              key={value}
              onClick={() => onChange("language_level", value)}
              className={`px-3 py-1 rounded-lg border transition-all ${
                languageLevel === value
                  ? color + " border-current"
                  : color.replace("text-", "text-opacity-60 text-") +
                    " border-transparent"
              }`}
              aria-pressed={languageLevel === value}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
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
  | "word"
  | "pronunciation"
  | "frequency"
  | "language_level"
  | null;
interface FieldStatuses {
  word: ApiStatus;
  pronunciation: ApiStatus;
  frequency: ApiStatus;
  language_level: ApiStatus;
  images: ApiStatus;
}
interface EditWordBaseSectionProps {
  word: string;
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
export function EditWordBaseSection({
  word,
  pronunciation,
  frequency,
  languageLevel,
  fieldStatuses,
  onChange,
  onSave,
  onCancel,
}: EditWordBaseSectionProps) {
  const [saveLoading, setSaveLoading] = useState<{ [key: string]: boolean }>(
    {}
  );

  function SaveText({
    onClick,
    loading,
    label = "lưu thay đổi",
    className = "",
    disabled = false,
  }: {
    onClick: () => void;
    loading?: boolean;
    label?: string;
    className?: string;
    disabled?: boolean;
  }) {
    return (
      <span
        role="button"
        tabIndex={0}
        onClick={loading || disabled ? undefined : onClick}
        onKeyDown={(e) => {
          if (!loading && !disabled && (e.key === "Enter" || e.key === " "))
            onClick();
        }}
        className={
          `inline-flex items-center cursor-pointer 
          text-[#10b39c] text-sm font-medium ml-3
          transition-opacity hover:underline active:text-[#52aaa5]
          ${loading ? "pointer-events-none opacity-60" : ""}
          ${disabled ? "pointer-events-none opacity-60" : ""}
          ` + className
        }
        aria-disabled={loading || disabled}
        style={{ userSelect: "none" }}
      >
        {loading && (
          <span className="inline-block h-3 w-3 mr-1 border-2 border-[#10b39c] border-t-transparent rounded-full animate-spin" />
        )}
        {label}
      </span>
    );
  }

  return (
    <div className="space-y-6">
      {/* Word and pronunciation */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            value={word}
            onChange={(e) => onChange("word", e.target.value)}
            className="text-2xl font-semibold text-[#2D3748] bg-transparent border-b border-[#52aaa5] outline-none focus:border-b-2"
            onKeyDown={(e) => e.key === "Enter" && onSave("word", word)}
            aria-label="Từ vựng"
            aria-describedby="word-description"
            autoFocus
          />
          <span id="word-description" className="sr-only">
            Nhập từ cần chỉnh sửa
          </span>
          <button
            onClick={() =>
              fieldStatuses.word === "modified"
                ? onSave("word", word)
                : onCancel("word")
            }
            className={`p-1 rounded-full hover:bg-gray-100 transition-colors ${
              !fieldStatuses.word || fieldStatuses.word === "idle"
                ? "hidden"
                : ""
            }`}
          >
            {getStatusIcon(fieldStatuses.word)}
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
            Nhập phát âm của từ này
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
      {/* Frequency and Level */}
      <div className="space-y-4">
        <div className="flex items-center mb-2">
          <h3 className="text-[#2D3748] font-medium">Tần suất sử dụng</h3>
          {fieldStatuses.frequency === "modified" && (
            <SaveText
              label="lưu thay đổi"
              loading={!!saveLoading["frequency"]}
              onClick={async () => {
                setSaveLoading((s) => ({ ...s, frequency: true }));
                await onSave("frequency", frequency);
                setSaveLoading((s) => ({ ...s, frequency: false }));
              }}
            />
          )}
        </div>
        <div
          className="flex gap-2 items-center"
          role="group"
          aria-label="Tần suất sử dụng"
        >
          {Object.entries(frequencyLabels).map(([value, { label, color }]) => (
            <button
              key={value}
              onClick={() => onChange("frequency", value)}
              className={`
        px-3 py-1 rounded-lg border transition-all focus-visible:outline-none
        ${
          frequency === value
            ? `${color} border-2 border-[#52aaa5] ring-2 ring-[#52aaa5]/30`
            : color.replace("text-", "text-opacity-60 text-") +
              " border border-transparent hover:border-[#52aaa5]/60 hover:bg-neutral-50"
        }
      `}
              aria-pressed={frequency === value}
            >
              {label}
            </button>
          ))}
          {fieldStatuses.frequency === "error" && (
            <span className="text-sm text-red-500 ml-2">Lỗi lưu, thử lại</span>
          )}
        </div>
        <div className="flex items-center mb-2 mt-4">
          <h3 className="text-[#2D3748] font-medium">Cấp độ ngôn ngữ</h3>
          {fieldStatuses.language_level === "modified" && (
            <SaveText
              label="lưu thay đổi"
              loading={!!saveLoading["language_level"]}
              onClick={async () => {
                setSaveLoading((s) => ({ ...s, language_level: true }));
                await onSave("language_level", languageLevel);
                setSaveLoading((s) => ({ ...s, language_level: false }));
              }}
            />
          )}
        </div>
        <div
          className="flex gap-2 items-center"
          role="group"
          aria-label="Cấp độ ngôn ngữ"
        >
          {Object.entries(levelLabels).map(([value, { label, color }]) => (
            <button
              key={value}
              onClick={() => onChange("language_level", value)}
              className={`
        px-3 py-1 rounded-lg border transition-all focus-visible:outline-none
        ${
          languageLevel === value
            ? `${color} border-2 border-[#52aaa5] ring-2 ring-[#52aaa5]/30`
            : color.replace("text-", "text-opacity-60 text-") +
              " border border-transparent hover:border-[#52aaa5]/60 hover:bg-neutral-50"
        }
      `}
              aria-pressed={languageLevel === value}
            >
              {label}
            </button>
          ))}

          {fieldStatuses.language_level === "error" && (
            <span className="text-sm text-red-500 ml-2">Lỗi lưu, thử lại</span>
          )}
        </div>
      </div>
    </div>
  );
}

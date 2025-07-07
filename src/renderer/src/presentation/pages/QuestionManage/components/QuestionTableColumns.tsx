import { ColumnDef } from "@tanstack/react-table";
import { Question } from "../types/Question";
import { Edit2, Trash2 } from "lucide-react";

const QUESTION_TYPES = {
  fill_in_the_blank: "Điền vào chỗ trống",
  choice_one: "Chọn một đáp án",
  choice_multi: "Chọn nhiều đáp án",
  matching: "Nối câu",
  true_false_not_given: "Đúng/Sai/Không đề cập",
  error_identification: "Nhận diện lỗi",
  sentence_completion: "Hoàn thành câu",
  word_repetition: "Lặp lại từ",
  phrase_repetition: "Lặp lại cụm từ",
  conversational_repetition: "Lặp lại hội thoại",
  open_conversation: "Hội thoại mở",
  open_paragraph: "Đoạn văn mở",
} as const;

const STATUS_COLORS = {
  draft: "bg-gray-50 text-gray-600",
  pending: "bg-yellow-50 text-yellow-600",
  approved: "bg-green-50 text-green-600",
  rejected: "bg-red-50 text-red-600",
  published: "bg-blue-50 text-blue-600",
  unpublished: "bg-purple-50 text-purple-600",
  archived: "bg-orange-50 text-orange-600",
} as const;

const STATUS_LABELS = {
  draft: "Nháp",
  pending: "Đang chờ",
  approved: "Đã duyệt",
  rejected: "Từ chối",
  published: "Đã xuất bản",
  unpublished: "Chưa xuất bản",
  archived: "Đã lưu trữ",
} as const;

const SKILL_COLORS = {
  listening: "bg-pink-50 text-pink-600",
  speaking: "bg-indigo-50 text-indigo-600",
  reading: "bg-green-50 text-green-600",
  writing: "bg-yellow-50 text-yellow-600",
  grammar: "bg-cyan-50 text-cyan-600",
} as const;

const SKILL_LABELS = {
  listening: "Nghe",
  speaking: "Nói",
  reading: "Đọc",
  writing: "Viết",
  grammar: "Ngữ pháp",
} as const;

const LEVEL_COLORS = {
  beginner: "bg-blue-50 text-blue-600",
  intermediate: "bg-purple-50 text-purple-600",
  advanced: "bg-orange-50 text-orange-600",
} as const;

const LEVEL_LABELS = {
  beginner: "Cơ bản",
  intermediate: "Trung cấp",
  advanced: "Nâng cao",
} as const;

export const getQuestionColumns = (
  onDelete: (questionId: string) => void,
  navigate: ReturnType<typeof import("react-router-dom").useNavigate>,
  startIndex: number
): ColumnDef<Question>[] => [
  {
    header: "STT",
    accessorFn: (_row, index) => `${startIndex + index + 1}`,
    cell: (info) => {
      const value = info.getValue() as string;
      return <span className="text-sm text-[#718096]">{value}</span>;
    },
    size: 55,
  },
  {
    header: "Loại",
    accessorKey: "type",
    cell: (info) => {
      const type = info.getValue() as keyof typeof QUESTION_TYPES | string;
      return (
        <span className="text-sm text-[#2D3748]">
          {QUESTION_TYPES[type as keyof typeof QUESTION_TYPES] ?? type}
        </span>
      );
    },
    size: 140,
  },
  {
    header: "Kỹ năng",
    accessorKey: "skill",
    cell: (info) => {
      const skill = info.getValue() as keyof typeof SKILL_LABELS | string;
      return (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            SKILL_COLORS[skill as keyof typeof SKILL_COLORS] ??
            "bg-gray-100 text-gray-800"
          }`}
        >
          {SKILL_LABELS[skill as keyof typeof SKILL_LABELS] ?? skill}
        </span>
      );
    },
    size: 120,
  },
  {
    header: "Cấp độ",
    accessorKey: "level",
    cell: (info) => {
      const lvl = info.getValue() as keyof typeof LEVEL_LABELS | string;
      return (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            LEVEL_COLORS[lvl as keyof typeof LEVEL_COLORS] ??
            "bg-gray-100 text-gray-800"
          }`}
        >
          {LEVEL_LABELS[lvl as keyof typeof LEVEL_LABELS] ?? lvl}
        </span>
      );
    },
    size: 110,
  },
  {
    header: "Trạng thái",
    accessorKey: "status",
    cell: (info) => {
      const status = info.getValue() as keyof typeof STATUS_LABELS | string;
      return (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            STATUS_COLORS[status as keyof typeof STATUS_COLORS] ??
            "bg-gray-100 text-gray-800"
          }`}
        >
          {STATUS_LABELS[status as keyof typeof STATUS_LABELS] ?? status}
        </span>
      );
    },
    size: 130,
  },
  {
    header: "Điểm",
    accessorKey: "score",
    cell: (info) => {
      const score = info.getValue() as number;
      return <span className="text-sm text-[#2D3748]">{score}</span>;
    },
    size: 70,
  },
  {
    header: "Thao tác",
    id: "actions",
    cell: (info) => {
      const id = info.row.original.id;
      return (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => navigate(`/question/edit/${id}`)}
            className="p-2 text-[#718096] hover:text-[#52aaa5] hover:bg-[#52aaa5]/10 rounded-lg transition-colors"
            title="Chỉnh sửa"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(id)}
            className="p-2 text-[#718096] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Xóa"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      );
    },
    size: 90,
  },
];

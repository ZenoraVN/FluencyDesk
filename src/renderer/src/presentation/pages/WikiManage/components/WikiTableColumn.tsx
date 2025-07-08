import { ColumnDef } from "@tanstack/react-table";
import { Edit2, Trash2, Eye } from "lucide-react";
type WikiItem = {
  id: string;
  word?: string;
  phrase?: string;
  pronunciation: string;
  frequency: string;
  language_level: string;
  usage_notes: string[];
  created_at: string;
  updated_at: string;
};
const FREQUENCY_COLORS: Record<string, string> = {
  high: "bg-green-50 text-green-600",
  medium: "bg-yellow-50 text-yellow-600",
  low: "bg-red-50 text-red-600",
  "": "bg-gray-100 text-gray-800",
};
const LEVEL_COLORS: Record<string, string> = {
  beginner: "bg-blue-50 text-blue-600",
  intermediate: "bg-purple-50 text-purple-600",
  advanced: "bg-pink-50 text-pink-600",
  "": "bg-gray-100 text-gray-800",
};
const FREQUENCY_LABELS: Record<string, string> = {
  high: "Cao",
  medium: "Trung bình",
  low: "Thấp",
  "": "Không rõ",
};
const LEVEL_LABELS: Record<string, string> = {
  beginner: "Cơ bản",
  intermediate: "Trung cấp",
  advanced: "Nâng cao",
  "": "Không rõ",
};

export const getWikiColumns = (
  tab: "words" | "phrases",
  onDelete: (id: string) => void,
  startIndex: number
): ColumnDef<WikiItem>[] => [
  {
    header: "STT",
    accessorFn: (_, index) => `${startIndex + index + 1}`,
    cell: (info) => (
      <span className="text-sm text-[#718096]">
        {info.getValue() as string}
      </span>
    ),
    size: 55,
  },
  {
    header: tab === "words" ? "Từ vựng" : "Cụm từ",
    accessorKey: tab === "words" ? "word" : "phrase",
    cell: (info) => (
      <span className="text-sm text-[#2D3748]">
        {String(info.getValue() ?? "")}
      </span>
    ),
    size: 180,
  },
  {
    header: "Phát âm",
    accessorKey: "pronunciation",
    cell: (info) => (
      <span className="text-sm text-[#2D3748]">
        {info.getValue() as string}
      </span>
    ),
    size: 110,
  },
  {
    header: "Tần suất",
    accessorKey: "frequency",
    cell: (info) => {
      const val = info.getValue() as string;
      return (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            FREQUENCY_COLORS[val] ?? FREQUENCY_COLORS[""]
          }`}
        >
          {FREQUENCY_LABELS[val] ?? val}
        </span>
      );
    },
    size: 110,
  },
  {
    header: "Cấp độ",
    accessorKey: "language_level",
    cell: (info) => {
      const lvl = info.getValue() as string;
      return (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            LEVEL_COLORS[lvl] ?? LEVEL_COLORS[""]
          }`}
        >
          {LEVEL_LABELS[lvl] ?? lvl}
        </span>
      );
    },
    size: 100,
  },
  {
    header: "Thao tác",
    id: "actions",
    cell: (info) => {
      const item = info.row.original;
      return (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("open-wiki-view", {
                  detail: { id: item.id, tab },
                })
              )
            }
            className="p-2 text-[#718096] hover:text-[#52aaa5] hover:bg-[#52aaa5]/10 rounded-lg transition-colors"
            title="Xem chi tiết"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("open-wiki-edit", {
                  detail: { id: item.id, tab },
                })
              )
            }
            className="p-2 text-[#718096] hover:text-[#52aaa5] hover:bg-[#52aaa5]/10 rounded-lg transition-colors"
            title="Chỉnh sửa"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
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

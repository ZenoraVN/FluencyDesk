import { ColumnDef } from "@tanstack/react-table";
import { Course } from "../type/Course";
import { Edit2, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LEVEL_COLORS = {
  beginner: { bg: "bg-blue-50", text: "text-blue-600" },
  intermediate: { bg: "bg-purple-50", text: "text-purple-600" },
  advanced: { bg: "bg-orange-50", text: "text-orange-600" },
  expert: { bg: "bg-red-50", text: "text-red-600" },
};
const LEVEL_LABELS = {
  beginner: "Cơ bản",
  intermediate: "Trung cấp",
  advanced: "Nâng cao",
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Bản nháp",
  pending: "Chờ duyệt",
  approved: "Đã duyệt",
  rejected: "Bị từ chối",
  published: "Đã xuất bản",
  unpublished: "Chưa xuất bản",
  archived: "Lưu trữ",
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  draft: { bg: "bg-gray-50", text: "text-gray-500" },
  pending: { bg: "bg-yellow-50", text: "text-yellow-600" },
  approved: { bg: "bg-green-50", text: "text-green-600" },
  rejected: { bg: "bg-red-50", text: "text-red-600" },
  published: { bg: "bg-blue-50", text: "text-blue-600" },
  unpublished: { bg: "bg-purple-50", text: "text-purple-600" },
  archived: { bg: "bg-gray-100", text: "text-gray-400" },
};

export const getCourseColumns = (
  onDelete: (courseId: string) => void,
  navigate: ReturnType<typeof useNavigate>,
  startIndex: number
): ColumnDef<Course>[] => [
  {
    header: "STT",
    accessorFn: (_row, index) => `${startIndex + index + 1}`,
    cell: (info) => (
      <span className="text-sm text-[#718096]">
        {info.getValue() as string}
      </span>
    ),
    size: 60,
  },
  {
    header: "Tiêu đề",
    accessorKey: "title",
    cell: (info) => {
      const row = info.row.original;
      return (
        <div className="flex items-center gap-4">
          {row.image_url && (
            <img
              src={row.image_url}
              alt={row.title}
              className="w-20 h-20 rounded-lg object-cover"
            />
          )}
          <span
            className="text-sm font-medium text-[#2D3748] truncate max-w-md"
            title={row.title}
          >
            {row.title}
          </span>
        </div>
      );
    },
  },
  {
    header: "Loại",
    accessorKey: "type",
    cell: (info) => {
      const type = info.getValue() as "BOOK" | "OTHER";
      return (
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            type === "BOOK"
              ? "bg-[#52aaa5]/10 text-[#52aaa5]"
              : "bg-[#718096]/10 text-[#718096]"
          }`}
        >
          {type === "BOOK" ? "Sách" : "Khác"}
        </span>
      );
    },
    size: 100,
  },
  {
    header: "Trạng thái",
    accessorKey: "status",
    cell: (info) => {
      const status = info.getValue() as string;
      const lbl = STATUS_LABELS[status] || status;
      const clr = STATUS_COLORS[status] || {
        bg: "bg-gray-50",
        text: "text-gray-500",
      };
      return (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${clr.bg} ${clr.text}`}
        >
          {lbl}
        </span>
      );
    },
    size: 120,
  },
  {
    header: "Cấp độ",
    accessorKey: "level",
    cell: (info) => {
      const lvl = info.getValue() as keyof typeof LEVEL_LABELS;
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${LEVEL_COLORS[lvl]?.bg} ${LEVEL_COLORS[lvl]?.text}`}
        >
          {LEVEL_LABELS[lvl]}
        </span>
      );
    },
    size: 90,
  },
  {
    header: "Thao tác",
    id: "actions",
    cell: (info) => {
      const id = info.row.original.id;
      return (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => navigate(`/course/edit/${id}`)}
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
          <button
            onClick={() => navigate(`/course/view/${id}`)}
            className="p-2 text-[#718096] hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
            title="Xem chi tiết"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      );
    },
    size: 120,
  },
];

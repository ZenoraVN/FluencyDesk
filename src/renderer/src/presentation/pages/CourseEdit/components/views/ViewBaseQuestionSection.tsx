import { FC } from "react";
import { Award, User, Hash, Target } from "lucide-react";
import { QuestionDetail } from "../../types/questionDetail";

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  draft: { label: "Nháp", color: "#718096" }, // xám
  pending: { label: "Chờ duyệt", color: "#FBBF24" }, // vàng
  approved: { label: "Đã duyệt", color: "#4ECDC4" }, // xanh ngọc nhạt
  rejected: { label: "Bị từ chối", color: "#EF4444" }, // đỏ
  published: { label: "Đã xuất bản", color: "#52aaa5" }, // xanh lá tươi
  unpublished: { label: "Gỡ xuất bản", color: "#AAB4BE" }, // xám xanh
  archived: { label: "Lưu trữ", color: "#9CA3AF" }, // xám đen hơn
};

const LEVEL_MAP: Record<string, { label: string; color: string }> = {
  beginner: { label: "Cơ bản", color: "#FF6B6B" },
  intermediate: { label: "Trung cấp", color: "#4ECDC4" },
  advanced: { label: "Nâng cao", color: "#45B7D1" },
};

const PILL_COLORS = [
  "#52aaa5", // Mint
  "#4ECDC4", // Green blue
  "#45B7D1", // Blue
  "#FF6B6B", // Pink red
  "#FFD93D", // Sunny yellow
  "#9575DE", // Violet
  "#B5EAEA", // Sky turquoise
];

interface Props {
  question: QuestionDetail;
}

export const ViewBaseQuestionSection: FC<Props> = ({ question }) => (
  <div className="mb-6 space-y-4">
    {/* Status, Level, Creator, Score */}
    <div className="flex items-center flex-wrap gap-2">
      {/* Status */}
      <span
        className="flex items-center gap-1 pr-3 py-1 rounded-full text-sm font-medium"
        style={{
          color: STATUS_MAP[question.status]?.color,
        }}
      >
        <Target
          className="h-4 w-4"
          style={{ color: STATUS_MAP[question.status]?.color }}
        />
        {STATUS_MAP[question.status]?.label ?? question.status}
      </span>

      {/* Level */}
      <span
        className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium"
        style={{
          color: LEVEL_MAP[question.level]?.color,
        }}
      >
        <Award
          className="h-4 w-4"
          style={{ color: LEVEL_MAP[question.level]?.color }}
        />
        {LEVEL_MAP[question.level]?.label ?? question.level}
      </span>

      {/* Creator */}
      <span className="flex items-center gap-1 px-3 py-1 rounded-full text-sm text-[#718096]">
        <User className="h-4 w-4" />
        {question.creator_role}
      </span>

      {/* Score */}
      <span className="flex items-center gap-1 px-3 py-1 rounded-full text-sm text-[#52aaa5]">
        <Award className="h-4 w-4" />
        {question.score} điểm
      </span>
    </div>

    {/* Chủ đề & Tags, loại bỏ tiêu đề & hiển thị pill màu, mỗi pill có icon */}
    <div className="flex flex-wrap gap-2">
      {(question.topic ?? []).map((topic: string, i: number) => (
        <span
          key={`topic-${topic}`}
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium"
          style={{
            color: PILL_COLORS[i % PILL_COLORS.length], // màu chữ
          }}
        >
          <Target
            className="h-4 w-4"
            style={{ color: PILL_COLORS[i % PILL_COLORS.length] }}
          />
          {topic}
        </span>
      ))}
      {(question.tags ?? []).map((tag: string, i: number) => (
        <span
          key={`tag-${tag}`}
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium"
          style={{
            color:
              PILL_COLORS[
                (i + (question.topic?.length ?? 0)) % PILL_COLORS.length
              ],
          }}
        >
          <Hash
            className="h-4 w-4"
            style={{
              color:
                PILL_COLORS[
                  (i + (question.topic?.length ?? 0)) % PILL_COLORS.length
                ],
            }}
          />
          {tag}
        </span>
      ))}
    </div>
  </div>
);

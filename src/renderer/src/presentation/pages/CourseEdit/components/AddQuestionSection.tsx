import { FC } from "react";
import { Plus, Eye } from "lucide-react";
import { QuestionType, QuestionSkill } from "../types/course";
import { QuestionDetail } from "../types/questionDetail";

interface AddQuestionSectionProps {
  showForm: boolean;
  newQuestionId: string;
  foundQuestion: QuestionDetail | null;
  onToggleForm: () => void;
  onCreateQuestion: () => void;
  onQuestionIdChange: (value: string) => void;
  onCheckQuestion: () => void;
  onAddQuestion: () => void;
  onViewQuestion: (questionId: string) => void;
}

// Label & style constant object giữ lại
const QUESTION_TYPE_COLORS = {
  fill_in_the_blank: "#FF6B6B",
  choice_one: "#4ECDC4",
  choice_multi: "#45B7D1",
  matching: "#96CEB4",
  true_false_not_givens: "#6366F1",
  error_identifications: "#FF9F43",
  sentence_completions: "#FF6B6B",
  word_repetitions: "#4ECDC4",
  phrase_repetitions: "#45B7D1",
  conversational_repetitions: "#96CEB4",
  open_conversations: "#6366F1",
  open_paragraphs: "#FF9F43",
  other: "#B0BEC5", // <-- thêm dòng này!
} as const;

const QUESTION_SKILL_COLORS = {
  listening: "#FF6B6B",
  reading: "#4ECDC4",
  writing: "#45B7D1",
  speaking: "#96CEB4",
  grammar: "#6366F1",
} as const;
const QUESTION_TYPE_LABELS = {
  fill_in_the_blank: "Điền vào chỗ trống",
  choice_one: "Chọn một đáp án",
  choice_multi: "Chọn nhiều đáp án",
  matching: "Nối câu",
  true_false_not_givens: "Đúng/Sai/Không có",
  error_identifications: "Tìm lỗi sai",
  sentence_completions: "Hoàn thành câu",
  word_repetitions: "Lặp lại từ",
  phrase_repetitions: "Lặp lại cụm từ",
  conversational_repetitions: "Lặp lại hội thoại",
  open_conversations: "Hội thoại mở",
  open_paragraphs: "Đoạn văn mở",
  other: "Khác", // <-- thêm dòng này!
} as const;
const QUESTION_SKILL_LABELS = {
  listening: "Nghe",
  reading: "Đọc",
  writing: "Viết",
  speaking: "Nói",
  grammar: "Ngữ pháp",
} as const;

export const AddQuestionSection: FC<AddQuestionSectionProps> = ({
  showForm,
  newQuestionId,
  foundQuestion,
  onToggleForm,
  onCreateQuestion,
  onQuestionIdChange,
  onCheckQuestion,
  onAddQuestion,
  onViewQuestion,
}) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={onToggleForm}
          className="inline-flex items-center gap-1 text-sm text-[#52aaa5] hover:bg-[#52aaa5]/10 px-3 py-1 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Thêm câu hỏi
        </button>
        <button
          onClick={onCreateQuestion}
          className="inline-flex items-center gap-1 text-sm text-[#52aaa5] hover:bg-[#52aaa5]/10 px-3 py-1 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tạo câu hỏi
        </button>
      </div>
      {showForm && (
        <div className="mb-6 border border-[#52aaa5]/10 rounded-lg">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newQuestionId}
                onChange={(e) => onQuestionIdChange(e.target.value)}
                placeholder="Nhập ID câu hỏi"
                className="bg-transparent hover:outline hover:outline-[#52aaa5] hover:outline-1 flex-1 px-3 py-2 rounded-lg border border-[#52aaa5]/20 focus:border-[#52aaa5] focus:ring focus:ring-[#52aaa5]/20 text-[#2D3748] placeholder-[#718096] outline-none"
              />
              <button
                onClick={onCheckQuestion}
                disabled={!newQuestionId}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  !newQuestionId
                    ? "bg-[#52aaa5]/20 text-[#52aaa5]/50 cursor-not-allowed"
                    : "bg-[#52aaa5] text-white hover:bg-[#52aaa5]/90"
                }`}
              >
                Kiểm tra
              </button>
            </div>
            {foundQuestion && (
              <>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{
                        backgroundColor: `${
                          QUESTION_TYPE_COLORS[
                            foundQuestion.type as QuestionType
                          ]
                        }15`,
                        color:
                          QUESTION_TYPE_COLORS[
                            foundQuestion.type as QuestionType
                          ],
                      }}
                    >
                      {QUESTION_TYPE_LABELS[foundQuestion.type as QuestionType]}
                    </span>
                    <span
                      className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{
                        backgroundColor: `${
                          QUESTION_SKILL_COLORS[
                            foundQuestion.skill as QuestionSkill
                          ]
                        }15`,
                        color:
                          QUESTION_SKILL_COLORS[
                            foundQuestion.skill as QuestionSkill
                          ],
                      }}
                    >
                      {
                        QUESTION_SKILL_LABELS[
                          foundQuestion.skill as QuestionSkill
                        ]
                      }
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={onAddQuestion}
                      className="px-4 py-2 bg-[#52aaa5] text-white rounded-lg hover:bg-[#52aaa5]/90 transition-colors"
                    >
                      Thêm
                    </button>
                    <button
                      onClick={() => onViewQuestion(foundQuestion.id)}
                      className="inline-flex items-center gap-1 px-4 py-2 text-[#52aaa5] hover:bg-[#52aaa5]/10 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Xem câu hỏi
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

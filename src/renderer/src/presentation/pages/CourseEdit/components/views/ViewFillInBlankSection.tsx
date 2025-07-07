import { FC } from "react";
import { QuestionDetail } from "../../types/questionDetail";
import { RichtextView } from "@/presentation/components/common/RichtextView";
interface Props {
  question: QuestionDetail;
}
export const ViewFillInBlankSection: FC<Props> = ({ question }) => {
  const q = question.fill_in_the_blank_question;
  const ans = question.fill_in_the_blank_answers || [];
  if (!q) return null;
  return (
    <div className="rounded-xl">
      <h3 className="text-lg font-medium text-[#2D3748] mb-3">Câu hỏi</h3>
      <RichtextView content={q.question} />
      <div className="mt-6">
        <h4 className="font-medium mb-2 text-[#2D3748]">Đáp án & Giải thích</h4>
        <div className="space-y-4">
          {ans.map((a: any, idx: number) => (
            <div key={idx} className="border rounded-lg px-4 py-3 bg-gray-50">
              <div>
                <span className="font-semibold">Đáp án {idx + 1}: </span>
                <RichtextView content={a.answer || ""} />
              </div>
              <div className="text-sm mt-2">
                <span className="font-semibold text-[#3182CE]">
                  Giải thích:{" "}
                </span>
                <RichtextView content={a.explain || ""} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

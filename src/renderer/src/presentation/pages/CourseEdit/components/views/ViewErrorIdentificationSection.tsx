import { FC } from "react";
import { QuestionDetail } from "../../types/questionDetail";
interface Props {
  question: QuestionDetail;
}
export const ViewErrorIdentificationSection: FC<Props> = ({ question }) => {
  const q = question.error_identification_question;
  const answers = question.error_identification_answers || [];
  if (!q) return null;
  return (
    <div className="rounded-xl">
      <h3 className="text-lg font-medium text-[#2D3748] mb-3">{q.question}</h3>
      <div className="mt-6 space-y-4">
        {answers.map((opt: any, idx: number) => (
          <div key={idx} className="p-4 border rounded-lg bg-gray-50">
            <div>
              <span className="font-medium text-[#E53E3E]">Từ sai:</span>{" "}
              <span>{opt.error_word}</span>
            </div>
            <div>
              <span className="font-medium text-[#38A169]">Từ đúng:</span>{" "}
              <span>{opt.correct_word}</span>
            </div>
            <div>
              <span className="font-medium text-[#3182CE]">Giải thích:</span>{" "}
              <span>{opt.explain}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

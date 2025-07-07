import { FC } from "react";
import { QuestionDetail } from "../../types/questionDetail";
interface Props {
  question: QuestionDetail;
}
export const ViewOpenParagraphSection: FC<Props> = ({ question }) => {
  const o = question.open_paragraph;
  if (!o) return null;
  return (
    <div className="rounded-xl space-y-6">
      <div>
        <h4 className="font-medium text-[#2D3748] mb-1">Đoạn văn mẫu</h4>
        <div className="bg-gray-100 p-4 rounded text-[#2D3748]">
          {o.example_paragraph}
        </div>
      </div>
      <div>
        <h4 className="font-medium text-[#2D3748] mb-1">Nghĩa đoạn văn</h4>
        <div className="bg-gray-50 p-4 rounded text-[#2D3748]">
          {o.mean_example_paragraph}
        </div>
      </div>
      {o.tips && o.tips.length > 0 && (
        <div>
          <h4 className="font-medium text-[#2D3748] mb-1">Mẹo viết</h4>
          <ul className="list-disc ml-6 text-[#2D3748]">
            {o.tips.map((tip: string, idx: number) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

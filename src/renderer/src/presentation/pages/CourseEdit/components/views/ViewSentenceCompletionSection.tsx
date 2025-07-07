import { FC } from "react";
import { QuestionDetail } from "../../types/questionDetail";
interface Props {
  question: QuestionDetail;
}
export const ViewSentenceCompletionSection: FC<Props> = ({ question }) => {
  const list = question.sentence_completions || [];
  if (!list.length) return null;
  return (
    <div className="rounded-xl">
      <h4 className="font-medium text-[#2D3748] mb-4">Các câu hoàn thành</h4>
      <div className="space-y-6">
        {list.map((item: any, idx: number) => (
          <div key={idx} className="border rounded-lg p-4 bg-gray-50">
            <div>
              <span className="font-semibold">Câu gốc: </span>
              <span>{item.original_sentence}</span>
            </div>
            <div>
              <span className="font-semibold">Phần bắt đầu: </span>
              <span>{item.start_phrase}</span>
            </div>
            {item.middle_phrase && (
              <div>
                <span className="font-semibold">Phần giữa: </span>
                <span>{item.middle_phrase}</span>
              </div>
            )}
            {item.end_phrase && (
              <div>
                <span className="font-semibold">Phần cuối: </span>
                <span>{item.end_phrase}</span>
              </div>
            )}
            <div>
              <span className="font-semibold">Các câu đúng: </span>
              <ul className="list-disc ml-6">
                {item.true_sentences?.map((t: string, i: number) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className="font-semibold">Giải thích: </span>
              <span>{item.explain}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

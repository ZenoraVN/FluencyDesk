import { FC } from "react";
import { QuestionDetail } from "../../types/questionDetail";

interface Props {
  question: QuestionDetail;
}

export const ViewConversationalRepetitionSection: FC<Props> = ({
  question,
}) => {
  if (!question.conversational_repetition) return null;
  const { title, overview } = question.conversational_repetition;
  const qa =
    (question as any).conversational_repetition_qas ||
    question.conversational_repetition_qa ||
    [];

  // Trộn question & answer thành dạng chat ziczac từng dòng
  const chatBubbles: {
    type: "question" | "answer";
    text: string;
    mean: string;
  }[] = [];
  qa.forEach((item: any) => {
    chatBubbles.push({
      type: "question",
      text: item.question,
      mean: item.mean_of_question,
    });
    chatBubbles.push({
      type: "answer",
      text: item.answer,
      mean: item.mean_of_answer,
    });
  });

  return (
    <div className="">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-xl font-semibold text-neutral-800">{title}</h3>
      </div>
      <div className="mb-6 text-neutral-700">{overview}</div>
      <div className="flex flex-col gap-3">
        {chatBubbles.map((bubble, idx) => (
          <div
            key={idx}
            className={`flex w-full ${
              bubble.type === "question" ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`
                px-4 py-3 rounded-2xl shadow-sm max-w-[80%]
                ${
                  bubble.type === "question"
                    ? " text-neutral-900 rounded-lg border border-yellow-500"
                    : " text-neutral-900 rounded-lg border border-[#52aaaf]"
                }
              `}
            >
              <div className="text-base">{bubble.text}</div>
              <div className="text-xs text-gray-500 mt-1">{bubble.mean}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

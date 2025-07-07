import { FC } from "react";
import { QuestionDetail } from "../../types/questionDetail";
import { RichtextView } from "@/presentation/components/common/RichtextView";

interface Props {
  question: QuestionDetail;
}

export const ViewChoiceOneSection: FC<Props> = ({ question }) => {
  if (!question.choice_one_question) return null;

  return (
    <div className="rounded-xl">
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-xl font-medium text-[#2D3748]">
          {question.choice_one_question.question}
        </h3>
      </div>
      <div className="space-y-3">
        {(question.choice_one_options ?? []).map((option: any, idx: number) => (
          <div
            key={option.id || idx}
            className={`flex items-center gap-3 w-full p-2 rounded-lg text-left transition-colors ${
              option.is_correct
                ? "text-[#52aaaf] border border-[#52aaaf]"
                : "border border-[#ddd] text-[#2D3748] hover:border-red-500"
            }`}
          >
            <span className={option.is_correct ? "font-medium" : ""}>
              {option.option}
            </span>
          </div>
        ))}
      </div>

      {question.choice_one_question.explain && (
        <div className="mt-6">
          <h4 className="font-medium text-[#2D3748] mb-1">Giải thích</h4>
          <RichtextView
            content={question.choice_one_question.explain}
            className="text-[#718096]"
          />
        </div>
      )}
    </div>
  );
};

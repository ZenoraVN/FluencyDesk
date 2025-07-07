import { FC, useState } from "react";
import { QuestionDetail } from "../../types/questionDetail";
import { RichtextView } from "@/presentation/components/common/RichtextView";

interface Props {
  question: QuestionDetail;
}

const answerLabel = {
  TRUE: "Đúng",
  FALSE: "Sai",
  NOT_GIVEN: "Không chắc chắn",
} as const;

const colorClasses = {
  TRUE: "bg-green-100 text-green-700 border-green-400 hover:bg-green-200",
  FALSE: "bg-red-100 text-red-700 border-red-400 hover:bg-red-200",
  NOT_GIVEN:
    "bg-yellow-100 text-yellow-700 border-yellow-400 hover:bg-yellow-200",
};

export const ViewTrueFalseNotGivenSection: FC<Props> = ({ question }) => {
  const qs = question.true_false_not_givens || [];
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  if (!qs.length) return null;

  const handleToggle = (idx: number) => {
    setOpenIdx(idx === openIdx ? null : idx);
  };

  return (
    <div className="pt-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-5">
        Các câu hỏi True/False/Not Given
      </h3>
      <div className="space-y-6">
        {qs.map((item: any, idx: number) => (
          <div key={idx} className="rounded-lg">
            <div className="flex gap-4 p-2 items-center">
              {/* Numbered button */}
              <button
                className="flex items-center justify-center rounded-lg w-8 h-8 border border-[#52aaaf] text-black mr-2 text-base hover:bg-[#429294] hover:text-white"
                type="button"
                tabIndex={-1}
                aria-label={`Câu số ${idx + 1}`}
                disabled
              >
                {idx + 1}
              </button>
              {/* Question */}
              <button
                className="w-3/5 text-left p-2 focus:outline-none rounded-lg border hover:border-[#52aaaf] flex-1"
                onClick={() => handleToggle(idx)}
                type="button"
              >
                <div className="mt-1 text-gray-900 break-words">
                  <RichtextView content={item.question} />
                </div>
              </button>
              {/* Answer Button */}
              <button
                className={`flex items-center px-3 py-2 rounded-lg border font-semibold transition-colors ${
                  colorClasses[item.answer as keyof typeof colorClasses]
                }`}
                type="button"
                tabIndex={-1}
                disabled
              >
                {answerLabel[item.answer as keyof typeof answerLabel]}
              </button>
            </div>
            {/* Explain */}
            {openIdx === idx && (
              <div className="px-4 py-3 animate-fade-in">
                <span className="font-semibold text-gray-700 block mb-1">
                  Giải thích:
                </span>
                <RichtextView
                  content={item.explain || "Không có giải thích."}
                  className="text-black"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

import { FC, useState } from "react";
import { QuestionDetail } from "../../types/questionDetail";
import { RichtextView } from "@/presentation/components/common/RichtextView";

interface Props {
  question: QuestionDetail;
}

export const ViewMatchingSection: FC<Props> = ({ question }) => {
  const pairs = question.matchings || [];
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const handleToggle = (idx: number) => {
    setOpenIdx(idx === openIdx ? null : idx);
  };
  if (!pairs.length) return null;

  return (
    <div className="pt-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-5">
        Các cặp ghép nối
      </h3>
      <div className="space-y-6">
        {pairs.map((pair: any, idx: number) => (
          <div key={idx} className="rounded-lg">
            <div className="flex gap-4 p-2 items-center">
              {/* Numbered Button */}
              <button
                className="flex items-center justify-center rounded-lg w-8 h-8 border border-[#52aaaf] text-black mr-2 text-base  hover:bg-[#429294] hover:text-white"
                type="button"
                tabIndex={-1}
                aria-label={`Cặp số ${idx + 1}`}
                disabled
              >
                {idx + 1}
              </button>
              {/* Question */}
              <button
                className="w-1/2 text-left p-2 focus:outline-none rounded-lg border hover:border-[#52aaaf] flex-1"
                onClick={() => handleToggle(idx)}
                type="button"
              >
                <div className="mt-1 text-gray-900 break-words">
                  {pair.question || "--"}
                </div>
              </button>
              {/* Answer */}
              <button
                className="w-1/2 text-left p-2 focus:outline-none rounded-lg border hover:border-yellow-500 flex-1"
                onClick={() => handleToggle(idx)}
                type="button"
              >
                <div className="mt-1 text-gray-900 break-words">
                  {pair.answer || "--"}
                </div>
              </button>
            </div>
            {/* Explain (collapsed/expanded) */}
            {openIdx === idx && (
              <div className="px-4 py-3 animate-fade-in">
                <span className="font-semibold text-gray-700 block mb-1">
                  Giải thích:
                </span>
                <RichtextView
                  content={pair.explain || "Không có giải thích."}
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

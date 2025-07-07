import { FC } from "react";
import { QuestionDetail } from "../../types/questionDetail";
interface Props {
  question: QuestionDetail;
}
export const ViewOpenConversationSection: FC<Props> = ({ question }) => {
  const o = question.open_conversation;
  if (!o) return null;
  const lines = (o.example_conversation || "").split("\n").filter(Boolean);
  // Detect roles (A:, B: ...) for color
  const colorMap: Record<string, string> = {};
  let colorIdx = 0;
  const defaultColors = [
    "#52aaa5",
    "#4C51BF",
    "#D53F8C",
    "#805AD5",
    "#38A169",
    "#D69E2E",
    "#E53E3E",
    "#3182CE",
  ];
  lines.forEach((l) => {
    const m = l.match(/^([^:]+):/);
    if (m && !colorMap[m[1]]) {
      colorMap[m[1]] = defaultColors[colorIdx++ % defaultColors.length];
    }
  });
  return (
    <div className="rounded-xl">
      <div className="mb-3">
        <div className="font-semibold text-[#2D3748]">{o.title}</div>
        <div className="text-gray-600">{o.overview}</div>
      </div>
      <div className="my-6">
        <h4 className="font-medium mb-2 text-[#2D3748]">Hội thoại mẫu</h4>
        <div className="space-y-2">
          {lines.map((line, idx) => {
            const m = line.match(/^([^:]+):(.*)$/);
            let role = m?.[1]?.trim() || "";
            let content = m?.[2]?.trim() || line;
            return (
              <div key={idx} className="flex items-start gap-2">
                {role && (
                  <span
                    className="py-1 px-3 rounded font-bold text-xs mr-2"
                    style={{
                      background: `${colorMap[role]}15`,
                      color: colorMap[role],
                    }}
                  >
                    {role}
                  </span>
                )}
                <span>{content}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

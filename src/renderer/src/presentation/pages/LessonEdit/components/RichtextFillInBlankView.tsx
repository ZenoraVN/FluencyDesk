import { FC } from "react";

interface RichtextFillInBlankViewProps {
  content: string;
  onBlankClick?: (number: number) => void;
  selectedBlankNumber?: number | null;
  className?: string;
}

export const RichtextFillInBlankView: FC<RichtextFillInBlankViewProps> = ({
  content,
  onBlankClick,
  selectedBlankNumber,
  className = "",
}) => {
  // Render content with highlighted blanks
  const renderContent = () => {
    if (!content) return null;

    const parts = content.split(/(\*\*\*\d+\*\*\*)/g);
    return parts.map((part: string, index: number) => {
      const match = part.match(/\*\*\*(\d+)\*\*\*/);
      if (match) {
        const number = parseInt(match[1]);
        return (
          <button
            key={index}
            type="button"
            onClick={() => onBlankClick?.(number)}
            className={`inline-block mx-1 cursor-pointer ${
              selectedBlankNumber === number
                ? "text-blue-600"
                : "text-gray-400 hover:text-blue-500"
            }`}
          >
            ___({number})___
          </button>
        );
      }
      return (
        <span
          key={index}
          className="prose prose-sm max-w-none break-words break-all whitespace-pre-wrap leading-relaxed
            prose-p:my-1 prose-headings:my-2 prose-headings:text-[#2D3748]
            prose-p:break-words prose-p:break-all prose-p:whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: part }}
        />
      );
    });
  };

  return (
    <div className={`text-[#2D3748] leading-relaxed text-base ${className}`}>
      {renderContent()}
    </div>
  );
};

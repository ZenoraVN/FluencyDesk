import { FC } from "react";
import { QuestionDetail } from "../../types/questionDetail";
import { RichtextView } from "@/presentation/components/common/RichtextView";
import ImagePreview from "@/presentation/components/Image/ImagePreview";

interface Props {
  question: QuestionDetail;
}

export const ViewReadingDetailSection: FC<Props> = ({ question }) => {
  const readingDetail = question.reading_question_detail;

  if (!readingDetail || !readingDetail.passage) return null;

  const { title, passage, image_urls = [] } = readingDetail;

  return (
    <div className="rounded-xl">
      {title && (
        <div className="mb-2 font-medium text-xl text-[#2D3748]">{title}</div>
      )}
      <div className="mb-6">
        <h4 className="font-medium text-[#2D3748] mb-1">Nội dung bài đọc</h4>
        <RichtextView content={passage} className="text-[#2D3748]" />
      </div>
      {Array.isArray(image_urls) && image_urls.length > 0 && (
        <div className="mt-2">
          <ImagePreview images={image_urls} gridCols={3} />
        </div>
      )}
    </div>
  );
};

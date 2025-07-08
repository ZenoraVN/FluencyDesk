import { FC } from 'react'
import { QuestionDetail } from '../../types/questionDetail'
import ImagePreview from '../../../../../components/Image/ImagePreview'

import { RichtextView } from '../../../../../components/common/RichtextView'

interface Props {
  question: QuestionDetail
}

export const ViewListeningDetailSection: FC<Props> = ({ question }) => {
  if (!question.listening_question_detail) return null

  const { audio_url, image_urls = [], transcript = '' } = question.listening_question_detail as any

  return (
    <div className="rounded-xl my-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="font-medium text-[#2D3748]">Chi tiết bài nghe</span>
      </div>

      {audio_url && (
        <audio controls src={audio_url} className="w-full mb-4">
          Trình duyệt của bạn không hỗ trợ audio
        </audio>
      )}

      {image_urls.length > 0 && (
        <div className="mt-2">
          <ImagePreview images={image_urls} gridCols={3} />
        </div>
      )}

      {transcript && (
        <div className="mt-4">
          <h5 className="font-medium text-[#2D3748] mb-1 flex items-center gap-2">Transcript</h5>
          <RichtextView
            content={transcript}
            className="text-black text-base p-4 rounded-lg border border-[#ddd] hover:border-[#52aaaf]"
          />
        </div>
      )}
    </div>
  )
}

export default ViewListeningDetailSection

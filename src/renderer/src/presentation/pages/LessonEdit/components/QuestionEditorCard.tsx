import React from 'react'

interface QuestionEditorCardProps {
  title: string
  description?: string
}

const QuestionEditorCard: React.FC<QuestionEditorCardProps> = ({ title, description }) => (
  <div
    className="w-full border border-[#e0e0e0] rounded-lg shadow-sm px-6 py-5 my-2 flex flex-col justify-center"
    style={{ minHeight: 100, height: 100 }}
  >
    <span className="font-semibold text-[#377f85] text-base">{title}</span>
    {description && <span className="mt-1 text-gray-600 text-xs">{description}</span>}
  </div>
)

export default QuestionEditorCard

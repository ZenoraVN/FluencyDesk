import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { ArrowLeft, Clock, Tag, Edit, Save } from 'lucide-react'
import { noteDetail } from './data/mockData'
import TextEditor from '../../../components/common/TextEditor'

const NotePage = () => {
  useParams()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState(noteDetail.content)

  // In a real app, we would fetch the note data based on the id
  const note = noteDetail

  const handleSave = () => {
    // In a real app, we would save the content to the backend
    console.log('Saving content:', content)
    setIsEditing(false)
  }

  return (
    <div className="relative min-h-screen bg-[#f6f6f0] p-8">
      {/* Decorative Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-[#52aaa5]/5" />
        <div className="absolute -left-20 bottom-1/4 h-[400px] w-[400px] rounded-full bg-[#52aaa5]/7" />
        <div className="absolute right-1/4 top-1/4 h-[350px] w-[350px] rounded-3xl bg-[#52aaa5]/4 transform rotate-45" />
      </div>

      <div className="relative mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            className="mb-6 -ml-2 text-[#718096] hover:text-[#2D3748]"
            onClick={() => navigate('/notes')}
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Quay lại
          </Button>

          <div className="flex items-start justify-between">
            <h1 className="text-3xl font-semibold text-[#2D3748]">{note.title}</h1>
            <Button 
              size="lg"
              className="bg-[#52aaa5] text-white hover:bg-[#52aaa5]/90"
              onClick={() => {
                if (isEditing) {
                  handleSave()
                } else {
                  setIsEditing(true)
                }
              }}
            >
              {isEditing ? (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Lưu
                </>
              ) : (
                <>
                  <Edit className="mr-2 h-5 w-5" />
                  Chỉnh sửa
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Metadata */}
        <div className="mb-8 flex flex-wrap items-center gap-6 text-[#718096]">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span>Cập nhật {note.lastUpdated}</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            <div className="flex flex-wrap gap-2">
              {note.tags.map((tag) => (
                <Badge 
                  key={tag}
                  variant="secondary"
                  className="bg-[#52aaa5]/10 text-[#52aaa5]"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <TextEditor
          value={content}
          onChange={setContent}
          readOnly={!isEditing}
          height="calc(100vh - 300px)"
          className="shadow-sm"
        />
      </div>
    </div>
  )
}

export default NotePage
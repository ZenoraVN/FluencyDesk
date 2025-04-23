import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/button'
import { CloudOff, ArrowLeft } from 'lucide-react'
import WikiAnalytics from './components/WikiAnalytics'
import LearningOptions from './components/LearningOptions'
import WikiCollection from './components/WikiCollection'

const NotebookWiki = () => {
  const { notebookId } = useParams()
  const navigate = useNavigate()
  const [isOfflineMode] = useState(false)
  const [isLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-8 rounded-full bg-[#52aaa5]/10 p-8">
        <svg
          className="h-20 w-20 text-[#52aaa5]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      </div>
      <h3 className="mb-4 text-2xl font-semibold text-[#2D3748]">
        Chưa có từ vựng nào
      </h3>
      <p className="mb-8 max-w-lg text-lg text-[#718096]">
        Hãy thêm từ vựng để bắt đầu học
      </p>
      <Button 
        size="lg"
        className="bg-[#52aaa5] text-white hover:bg-[#52aaa5]/90"
        onClick={() => console.log('Add new word')}
      >
        Thêm từ vựng mới
      </Button>
    </div>
  )

  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-8 rounded-full bg-red-100 p-8">
        <CloudOff className="h-20 w-20 text-red-500" />
      </div>
      <h3 className="mb-4 text-2xl font-semibold text-[#2D3748]">
        {error === 'offline_not_found'
          ? 'Không tìm thấy dữ liệu ngoại tuyến'
          : 'Đang bảo trì'}
      </h3>
      <p className="mb-8 text-lg text-[#718096]">
        {error === 'offline_not_found'
          ? 'Vui lòng kết nối internet để tải dữ liệu'
          : 'Vui lòng thử lại sau'}
      </p>
      <Button 
        variant="outline"
        className="border-[#52aaa5] text-[#52aaa5] hover:bg-[#52aaa5]/10"
        onClick={() => setError(null)}
      >
        Thử lại
      </Button>
    </div>
  )

  if (!notebookId) {
    return (
      <div className="min-h-screen bg-[#f6f6f0] p-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl text-[#2D3748]">Không tìm thấy sổ ghi chú</h1>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f6f6f0] p-6">
        <div className="mx-auto max-w-7xl animate-pulse space-y-8">
          <div className="h-64 rounded-2xl bg-gray-200" />
          <div className="h-48 rounded-2xl bg-gray-200" />
          <div className="h-96 rounded-2xl bg-gray-200" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f6f6f0] p-6">
        <div className="mx-auto max-w-7xl">
          {renderErrorState()}
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-[#f6f6f0] p-6">
      {/* Decorative Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#52aaa5]/5" />
        <div className="absolute -left-20 bottom-1/4 h-80 w-80 rounded-full bg-[#52aaa5]/7" />
        <div className="absolute right-1/4 top-1/4 h-72 w-72 rounded-3xl bg-[#52aaa5]/4 transform rotate-45" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Back Button */}
        <div className="mb-8 flex items-center gap-4">
          <Button 
            variant="ghost"
            className="rounded-2xl p-2 text-[#2D3748] hover:bg-[#52aaa5]/10"
            onClick={() => navigate('/notebook')}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-semibold text-[#2D3748]">Từ vựng của bạn</h1>
        </div>

        {/* Offline Mode Banner */}
        {isOfflineMode && (
          <div className="mb-8 flex items-center gap-3 rounded-xl bg-[#52aaa5]/10 p-5 text-[#52aaa5]">
            <CloudOff className="h-6 w-6" />
            <span className="text-base font-medium">Đang sử dụng dữ liệu ngoại tuyến</span>
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-8">
          <WikiAnalytics />
          <LearningOptions />
          <WikiCollection />
        </div>
      </div>
    </div>
  )
}

export default NotebookWiki
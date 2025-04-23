import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Search, Plus, CloudOff, ScrollText } from 'lucide-react'
import { myNotebooks, sharedNotebooks } from './data/mockData'
import NotebookStats from './components/NotebookStats'
import NotebookCard from './components/NotebookCard'
import StudyReminders from './components/StudyReminders'
import RecentActivities from './components/RecentActivities'

interface Notebook {
  id: string
  title: string
  description: string
  totalNotes: number
  color: string
  lastUpdated: string
  isShared: boolean
  stats: {
    mastered: number
    learning: number
    toReview: number
    accuracy: number
  }
  categories: string[]
  recentNotes: {
    id: string
    term: string
    definition: string
    example: string
  }[]
  sharedBy?: string
}

const NotebookPage = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [isOfflineMode] = useState(false)

  const filteredMyNotebooks = myNotebooks.filter(notebook =>
    notebook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notebook.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredSharedNotebooks = sharedNotebooks.filter(notebook =>
    notebook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notebook.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const hasMyNotebooks = filteredMyNotebooks.length > 0
  const hasSharedNotebooks = filteredSharedNotebooks.length > 0
  const isSearching = searchQuery.trim().length > 0
  const showNoResults = isSearching && !hasMyNotebooks && !hasSharedNotebooks
  const showNoNotebooks = !isSearching && !hasMyNotebooks && !hasSharedNotebooks

  const handleNotebookClick = (notebookId: string) => {
    navigate(`/notebook/${notebookId}`)
  }

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-8 rounded-full bg-[#52aaa5]/10 p-8">
        <ScrollText className="h-20 w-20 text-[#52aaa5]" />
      </div>
      <h3 className="mb-4 text-2xl font-semibold text-[#2D3748]">
        {isSearching ? 'Không tìm thấy sổ ghi chú phù hợp' : 'Chưa có sổ ghi chú nào'}
      </h3>
      {!isSearching && (
        <>
          <p className="mb-8 max-w-lg text-lg text-[#718096]">
            Tạo sổ ghi chú để lưu trữ và ôn tập từ vựng, ngữ pháp một cách hiệu quả
          </p>
          <Button 
            size="lg"
            className="bg-[#52aaa5] text-white hover:bg-[#52aaa5]/90"
            onClick={() => console.log('Create new notebook')}
          >
            <Plus className="mr-2 h-5 w-5" />
            Tạo sổ ghi chú mới
          </Button>
        </>
      )}
    </div>
  )

  return (
    <div className="relative min-h-screen bg-[#f6f6f0] p-8">
      {/* Decorative Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-[#52aaa5]/5" />
        <div className="absolute -left-20 bottom-1/4 h-[400px] w-[400px] rounded-full bg-[#52aaa5]/7" />
        <div className="absolute right-1/4 top-1/4 h-[350px] w-[350px] rounded-3xl bg-[#52aaa5]/4 transform rotate-45" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-[#2D3748]">Sổ ghi chú</h1>
          <Button 
            size="lg"
            className="bg-[#52aaa5] text-white hover:bg-[#52aaa5]/90"
            onClick={() => console.log('Create new notebook')}
          >
            <Plus className="mr-2 h-5 w-5" />
            Tạo mới
          </Button>
        </div>

        {/* Stats Overview */}
        <NotebookStats />

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#718096]" />
            <Input
              className="h-12 w-full rounded-xl border-[#52aaa5]/20 pl-12 text-lg text-[#2D3748] placeholder:text-[#718096]"
              placeholder="Tìm kiếm sổ ghi chú..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Offline Banner */}
        {isOfflineMode && (
          <div className="mb-8 flex items-center gap-3 rounded-xl bg-[#52aaa5]/10 p-5 text-[#52aaa5]">
            <CloudOff className="h-6 w-6" />
            <span className="text-base font-medium">Đang sử dụng dữ liệu ngoại tuyến</span>
          </div>
        )}

        {/* Main Content */}
        {showNoNotebooks || showNoResults ? (
          renderEmptyState()
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Notebooks Grid */}
            <div className="lg:col-span-2 space-y-8">
              {/* My Notebooks */}
              {hasMyNotebooks && (
                <div className="space-y-6">
                  <h2 className="text-xl font-medium text-[#2D3748]">Sổ ghi chú của tôi</h2>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {filteredMyNotebooks.map((notebook: Notebook) => (
                      <NotebookCard
                        key={notebook.id}
                        {...notebook}
                        onClick={handleNotebookClick}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Shared Notebooks */}
              {hasSharedNotebooks && (
                <div className="space-y-6">
                  <h2 className="text-xl font-medium text-[#2D3748]">Sổ ghi chú được chia sẻ</h2>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {filteredSharedNotebooks.map((notebook: Notebook) => (
                      <NotebookCard
                        key={notebook.id}
                        {...notebook}
                        onClick={handleNotebookClick}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="space-y-8">
              <StudyReminders />
              <RecentActivities />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NotebookPage
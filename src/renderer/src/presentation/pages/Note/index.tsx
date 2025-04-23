import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Search, Plus, CloudOff, StickyNote } from 'lucide-react'
import { myNotes, sharedNotes } from './data/mockData'
import NoteCard from './components/NoteCard'

const NotePage = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [isOfflineMode] = useState(false)

  const filteredMyNotes = myNotes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.overview.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const filteredSharedNotes = sharedNotes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.overview.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const hasMyNotes = filteredMyNotes.length > 0
  const hasSharedNotes = filteredSharedNotes.length > 0
  const isSearching = searchQuery.trim().length > 0
  const showNoResults = isSearching && !hasMyNotes && !hasSharedNotes
  const showNoNotes = !isSearching && !hasMyNotes && !hasSharedNotes

  const handleNoteClick = (noteId: string) => {
    navigate(`/note/${noteId}`)
  }

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-8 rounded-full bg-[#52aaa5]/10 p-8">
        <StickyNote className="h-20 w-20 text-[#52aaa5]" />
      </div>
      <h3 className="mb-4 text-2xl font-semibold text-[#2D3748]">
        {isSearching ? 'Không tìm thấy ghi chú phù hợp' : 'Chưa có ghi chú nào'}
      </h3>
      {!isSearching && (
        <>
          <p className="mb-8 max-w-lg text-lg text-[#718096]">
            Tạo ghi chú để lưu trữ kiến thức và chia sẻ với cộng đồng
          </p>
          <Button 
            size="lg"
            className="bg-[#52aaa5] text-white hover:bg-[#52aaa5]/90"
            onClick={() => console.log('Create new note')}
          >
            <Plus className="mr-2 h-5 w-5" />
            Tạo ghi chú mới
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
          <h1 className="text-3xl font-semibold text-[#2D3748]">Ghi chú</h1>
          <Button 
            size="lg"
            className="bg-[#52aaa5] text-white hover:bg-[#52aaa5]/90"
            onClick={() => console.log('Create new note')}
          >
            <Plus className="mr-2 h-5 w-5" />
            Tạo mới
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#718096]" />
            <Input
              className="h-12 w-full rounded-xl border-[#52aaa5]/20 pl-12 text-lg text-[#2D3748] placeholder:text-[#718096]"
              placeholder="Tìm kiếm ghi chú..."
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
        {showNoNotes || showNoResults ? (
          renderEmptyState()
        ) : (
          <div className="space-y-8">
            {/* Pinned Notes */}
            {hasMyNotes && filteredMyNotes.some(note => note.pinned) && (
              <div className="space-y-6">
                <h2 className="text-xl font-medium text-[#2D3748]">Ghim</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredMyNotes
                    .filter(note => note.pinned)
                    .map(note => (
                      <NoteCard
                        key={note.id}
                        {...note}
                        onClick={handleNoteClick}
                      />
                    ))}
                </div>
              </div>
            )}

            {/* My Notes */}
            {hasMyNotes && (
              <div className="space-y-6">
                <h2 className="text-xl font-medium text-[#2D3748]">Ghi chú của tôi</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredMyNotes
                    .filter(note => !note.pinned)
                    .map(note => (
                      <NoteCard
                        key={note.id}
                        {...note}
                        onClick={handleNoteClick}
                      />
                    ))}
                </div>
              </div>
            )}

            {/* Shared Notes */}
            {hasSharedNotes && (
              <div className="space-y-6">
                <h2 className="text-xl font-medium text-[#2D3748]">Ghi chú được chia sẻ</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredSharedNotes.map(note => (
                    <NoteCard
                      key={note.id}
                      {...note}
                      onClick={handleNoteClick}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default NotePage
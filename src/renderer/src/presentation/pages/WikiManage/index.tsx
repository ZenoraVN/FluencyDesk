import { useState, useEffect, useCallback } from 'react'
import ApiService from '../../../service/ApiService'
import { getWikiColumns } from './components/WikiTableColumn'
import WikiFilter from './components/WikiFilter'
import CustomTable from '../../../components/Table/CustomTable'
import { Button } from '../../../components/ui/button'
import { Plus } from 'lucide-react'
import { Tabs, TabsContent } from '../../../components/ui/tabs'
import { CreateWordDrawer } from './components/Word/Create/CreateWordDrawer'
import { CreatePhraseDrawer } from './components/Phrase/Create/CreatePhraseDrawer'
import { ViewWordDrawer } from './components/Word/View/ViewWordDrawer'
import { EditWordDrawer } from './components/Word/Edit/EditWordDrawer'
import { ViewPhraseDrawer } from './components/Phrase/View/ViewPhraseDrawer'
import { EditPhraseDrawer } from './components/Phrase/Edit/EditPhraseDrawer'
import ImageViewDialog from '../../../components/Dialog/ImageViewDialog'
import type { WordData, PhraseData } from './type/wiki'
import { CustomButton } from '../../../components/Button/CustomButton'

interface WikiItem {
  id: string
  word?: string
  phrase?: string
  pronunciation: string
  frequency: string
  language_level: string
  usage_notes: string[]
  created_at: string
  updated_at: string
}

interface WordSearchResponse {
  code: number
  message: string
  data: {
    words: WikiItem[]
    total: number
    page: number
    page_size: number
  }
}

interface PhraseSearchResponse {
  code: number
  message: string
  data: {
    phrases: WikiItem[]
    total: number
    page: number
    page_size: number
  }
}
type WikiSearchResponse = WordSearchResponse | PhraseSearchResponse

const PAGE_SIZE = 10 as const

export default function WikiManagePage() {
  const [activeTab, setActiveTab] = useState<'words' | 'phrases'>('words')
  const [items, setItems] = useState<WikiItem[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    search: '',
    frequency: '',
    language_level: ''
  })
  const [showCreateWordDrawer, setShowCreateWordDrawer] = useState(false)
  const [showCreatePhraseDrawer, setShowCreatePhraseDrawer] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageViewOpen, setImageViewOpen] = useState(false)
  const [imageViewImages, setImageViewImages] = useState<
    { src: string; name?: string; size?: string; type?: string }[]
  >([])
  const [imageViewIndex, setImageViewIndex] = useState<number>(0)

  // TÁCH biệt state selected để đúng kiểu cho drawer
  const [selectedWord, setSelectedWord] = useState<WordData | undefined>(undefined)
  const [selectedPhrase, setSelectedPhrase] = useState<PhraseData | undefined>(undefined)
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false)
  const [editDrawerOpen, setEditDrawerOpen] = useState(false)

  // Quick create states & handlers
  const [isQuickCreatingWord, setIsQuickCreatingWord] = useState(false)
  const [isQuickCreatingPhrase, setIsQuickCreatingPhrase] = useState(false)

  const handleQuickCreateWord = async (_text: string, callback?: () => void) => {
    setIsQuickCreatingWord(true)
    try {
      // TODO: add your Gemini & save logic here!
      // Ví dụ giả lập delay:
      await new Promise((res) => setTimeout(res, 1000))
      if (callback) callback()
    } catch (e) {
      // handle error
    } finally {
      setIsQuickCreatingWord(false)
    }
  }

  const handleQuickCreatePhrase = async (_text: string, callback?: () => void) => {
    setIsQuickCreatingPhrase(true)
    try {
      // TODO: add your Gemini & save logic here!
      await new Promise((res) => setTimeout(res, 1000))
      if (callback) callback()
    } catch (e) {
      // handle error
    } finally {
      setIsQuickCreatingPhrase(false)
    }
  }

  const handlePreviewImages = (
    images: { src: string; name?: string; size?: string; type?: string }[],
    index: number
  ) => {
    setImageViewImages(images)
    setImageViewIndex(index)
    setImageViewOpen(true)
  }

  const fetchItems = useCallback(
    async (tab = activeTab, page = currentPage, filterVals = filters) => {
      setLoading(true)
      setError(null)
      try {
        const params = {
          query: filterVals.search,
          page: page,
          page_size: PAGE_SIZE,
          ...(filterVals.frequency && { frequency: filterVals.frequency }),
          ...(filterVals.language_level && {
            language_level: filterVals.language_level
          })
        }
        const resp = await ApiService.get<WikiSearchResponse>(
          tab === 'words' ? '/wiki/word/search' : '/wiki/phrase/search',
          true,
          params
        )
        let data: WikiItem[] = []
        if (resp && resp.code === 200 && resp.data) {
          if ('words' in resp.data && Array.isArray(resp.data.words)) {
            data = resp.data.words as WikiItem[]
          } else if ('phrases' in resp.data && Array.isArray(resp.data.phrases)) {
            data = resp.data.phrases as WikiItem[]
          }
          setItems(data)
          setTotalItems(resp.data.total)
        } else {
          setItems([])
          setTotalItems(0)
        }
      } catch (e: any) {
        setError(e.message || 'Đã có lỗi xảy ra')
        setItems([])
        setTotalItems(0)
      } finally {
        setLoading(false)
      }
    },
    [activeTab, currentPage, filters]
  )

  useEffect(() => {
    fetchItems()
    // eslint-disable-next-line
  }, [activeTab, currentPage])

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa mục này?')) return
    try {
      const endpoint = activeTab === 'words' ? `/wiki/word/${id}` : `/wiki/phrase/${id}`
      await ApiService.delete<void>(endpoint, true)
      setItems((prev) => prev.filter((item) => item.id !== id))
      setTotalItems((prev) => prev - 1)
    } catch (e: any) {
      setError(e.response?.data?.message || e.message || 'Xóa thất bại')
    }
  }

  const handleFilterChange = (name: keyof typeof filters, value: any) => {
    const newFilters = {
      ...filters,
      [name]: value
    }
    setFilters(newFilters)
    setCurrentPage(1)
    fetchItems(activeTab, 1, newFilters)
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as 'words' | 'phrases')
    setCurrentPage(1)
    setFilters({
      search: '',
      frequency: '',
      language_level: ''
    })
  }

  // -------- View / Edit Handlers -----------
  const refreshSelectedWord = async () => {
    if (!selectedWord?.id) return
    try {
      const resp = await ApiService.get<{ code: number; data: WordData }>(
        `/wiki/word/${selectedWord.id}`,
        true
      )
      if (resp.code === 200) setSelectedWord(resp.data)
    } catch {
      // Handle error nếu cần
    }
  }

  const handleView = async (id: string) => {
    try {
      if (activeTab === 'words') {
        const resp = await ApiService.get<{ code: number; data: WordData }>(
          `/wiki/word/${id}`,
          true
        )
        if (resp.code === 200) {
          setSelectedWord(resp.data)
          setViewDrawerOpen(true)
        }
      } else {
        const resp = await ApiService.get<{ code: number; data: PhraseData }>(
          `/wiki/phrase/${id}`,
          true
        )
        if (resp.code === 200) {
          setSelectedPhrase(resp.data)
          setViewDrawerOpen(true)
        }
      }
    } catch (err) {
      setError('Không tải được chi tiết.')
    }
  }
  const handleEdit = async (id: string) => {
    try {
      if (activeTab === 'words') {
        const resp = await ApiService.get<{ code: number; data: WordData }>(
          `/wiki/word/${id}`,
          true
        )
        if (resp.code === 200) {
          setSelectedWord(resp.data)
          setEditDrawerOpen(true)
        }
      } else {
        const resp = await ApiService.get<{ code: number; data: PhraseData }>(
          `/wiki/phrase/${id}`,
          true
        )
        if (resp.code === 200) {
          setSelectedPhrase(resp.data)
          setEditDrawerOpen(true)
        }
      }
    } catch (err) {
      setError('Không tải được dữ liệu chỉnh sửa.')
    }
  }

  // Lắng nghe event từ custom table columns
  useEffect(() => {
    const onOpenView = (e: any) => handleView(e.detail.id)
    const onOpenEdit = (e: any) => handleEdit(e.detail.id)
    window.addEventListener('open-wiki-view', onOpenView as EventListener)
    window.addEventListener('open-wiki-edit', onOpenEdit as EventListener)
    return () => {
      window.removeEventListener('open-wiki-view', onOpenView as EventListener)
      window.removeEventListener('open-wiki-edit', onOpenEdit as EventListener)
    }
    // eslint-disable-next-line
  }, [activeTab])

  // Columns for CustomTable
  const columns = getWikiColumns(activeTab, handleDelete, (currentPage - 1) * PAGE_SIZE)

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="px-8 pt-8">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold text-[#2D3748]">Quản lý từ điển</h1>
          {activeTab === 'words' ? (
            <CustomButton onClick={() => setShowCreateWordDrawer(true)} templateStyle="tealRounded">
              <Plus className="h-4 w-4" />
              Thêm từ mới
            </CustomButton>
          ) : (
            <Button
              onClick={() => setShowCreatePhraseDrawer(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#52aaa5] text-white hover:bg-[#52aaa5]/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Thêm cụm từ mới
            </Button>
          )}
        </div>
      </div>
      {/* Main content */}
      <div className="flex gap-4 flex-1 px-8 pt-0 pb-4 min-h-0 overflow-hidden">
        {/* Left - Table */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 min-h-0">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="h-full">
              <TabsContent value="words" className="h-full flex-1 min-h-0">
                <CustomTable<WikiItem>
                  data={items}
                  columns={columns}
                  loading={loading}
                  totalCount={totalItems}
                  currentPage={currentPage}
                  pageSize={PAGE_SIZE}
                  onPageChange={setCurrentPage}
                  emptyMessage={
                    <>
                      <div className="mb-2 text-xl font-semibold text-[#2D3748]">
                        Không tìm thấy {activeTab === 'words' ? 'từ vựng' : 'cụm từ'}
                      </div>
                      <p className="text-[#718096]">Thử điều chỉnh bộ lọc tìm kiếm</p>
                    </>
                  }
                />
              </TabsContent>
              <TabsContent value="phrases" className="h-full flex-1 min-h-0">
                <CustomTable<WikiItem>
                  data={items}
                  columns={columns}
                  loading={loading}
                  totalCount={totalItems}
                  currentPage={currentPage}
                  pageSize={PAGE_SIZE}
                  onPageChange={setCurrentPage}
                  emptyMessage={
                    <>
                      <div className="mb-2 text-xl font-semibold text-[#2D3748]">
                        Không tìm thấy {activeTab === 'words' ? 'từ vựng' : 'cụm từ'}
                      </div>
                      <p className="text-[#718096]">Thử điều chỉnh bộ lọc tìm kiếm</p>
                    </>
                  }
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        {/* Right - Filter */}
        <div className="w-80 flex flex-col min-h-0">
          <div className="flex-1 flex flex-col min-h-0">
            <WikiFilter
              filters={filters}
              onFilterChange={handleFilterChange}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </div>
        </div>
      </div>
      {/* Drawer create */}
      <CreateWordDrawer
        open={showCreateWordDrawer}
        onClose={() => setShowCreateWordDrawer(false)}
      />
      <CreatePhraseDrawer
        open={showCreatePhraseDrawer}
        onClose={() => setShowCreatePhraseDrawer(false)}
      />
      {/* Drawer view/edit */}
      {activeTab === 'words' ? (
        <>
          <ViewWordDrawer
            open={viewDrawerOpen}
            onClose={() => {
              setViewDrawerOpen(false)
              setSelectedWord(undefined)
            }}
            data={selectedWord}
          />
          <EditWordDrawer
            open={editDrawerOpen && !imageViewOpen}
            onClose={() => {
              setEditDrawerOpen(false)
              setSelectedWord(undefined)
            }}
            data={selectedWord}
            onRefresh={refreshSelectedWord}
            handleQuickCreateWord={handleQuickCreateWord}
            handleQuickCreatePhrase={handleQuickCreatePhrase}
            isQuickCreatingWord={isQuickCreatingWord}
            isQuickCreatingPhrase={isQuickCreatingPhrase}
            onPreviewImages={handlePreviewImages}
          />
        </>
      ) : (
        <>
          <ViewPhraseDrawer
            open={viewDrawerOpen}
            onClose={() => {
              setViewDrawerOpen(false)
              setSelectedPhrase(undefined)
            }}
            data={selectedPhrase}
          />
          <EditPhraseDrawer
            open={editDrawerOpen && !imageViewOpen}
            onClose={() => {
              setEditDrawerOpen(false)
              setSelectedPhrase(undefined)
            }}
            data={selectedPhrase}
            handleQuickCreateWord={handleQuickCreateWord}
            handleQuickCreatePhrase={handleQuickCreatePhrase}
            isQuickCreatingWord={isQuickCreatingWord}
            isQuickCreatingPhrase={isQuickCreatingPhrase}
          />
        </>
      )}
      {/* Error */}
      {error && (
        <div className="fixed bottom-8 right-8 bg-red-100 text-red-600 px-4 py-2 rounded-xl shadow">
          {error}
        </div>
      )}

      <ImageViewDialog
        open={imageViewOpen}
        onClose={() => setImageViewOpen(false)}
        images={imageViewImages}
        currentIndex={imageViewIndex}
        onNavigate={(idx) => setImageViewIndex(idx)}
      />
    </div>
  )
}

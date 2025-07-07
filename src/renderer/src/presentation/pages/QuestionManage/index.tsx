import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CustomTable from '../../../components/Table/CustomTable'
import QuestionFilter from './components/QuestionFilter'
import { getQuestionColumns } from './components/QuestionTableColumns'
import ApiService from '../../../service/ApiService'
import { Question, QuestionSearchRequest, QuestionSearchResponse } from './types/Question'

const QuestionManagePage = () => {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState<Question[]>([])
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [loading, setLoading] = useState(false)
  const [, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [filters, setFilters] = useState<QuestionSearchRequest>({
    page: 1,
    page_size: 10
  })

  // Fetch data
  const fetchQuestions = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await ApiService.get<QuestionSearchResponse>('/question/search', true, {
        ...filters,
        page: currentPage,
        page_size: pageSize
      })
      if (response && Array.isArray(response.questions)) {
        setQuestions(response.questions)
        setTotalQuestions(response.total)
      } else {
        setQuestions([])
        setTotalQuestions(0)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuestions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, filters])

  // Handlers
  const handleDelete = async (questionId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) return
    try {
      // Không setLoading(true) ở đây
      await ApiService.delete(`/question/${questionId}`, true)
      setQuestions((prevQuestions) => prevQuestions.filter((q) => q.id !== questionId))
      setTotalQuestions((prev) => prev - 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete question')
    }
    // Không setLoading(false)
  }

  const handleFilterChange = (name: keyof QuestionSearchRequest, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: name === 'page' ? value : 1
    }))
  }

  const columns = getQuestionColumns(handleDelete, navigate, (currentPage - 1) * pageSize)

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="px-8 pt-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-[#2D3748]">Quản lý câu hỏi</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/draft-question')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            >
              Quản lý bản nháp
            </button>
            <button
              onClick={() => navigate('/create-question')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#52aaa5] text-white hover:bg-[#52aaa5]/90 transition-colors"
            >
              Tạo câu hỏi
            </button>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex gap-4 flex-1 px-8 pt-0 pb-4 min-h-0 overflow-hidden">
        {/* Left - Table */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 min-h-0">
            <CustomTable<Question>
              data={questions}
              columns={columns}
              loading={loading}
              totalCount={totalQuestions}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              emptyMessage={
                <>
                  <div className="mb-2 text-xl font-semibold text-[#2D3748]">
                    Không tìm thấy câu hỏi
                  </div>
                  <p className="text-[#718096]">Thử điều chỉnh bộ lọc tìm kiếm</p>
                </>
              }
            />
          </div>
        </div>
        {/* Right - Filter */}
        <div className="w-80 flex flex-col min-h-0">
          <div className="flex-1 flex flex-col min-h-0">
            <QuestionFilter filters={filters} onFilterChange={handleFilterChange} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuestionManagePage

import { FC, useState, useRef, useEffect } from 'react'
import { Filter, X, Loader2 } from 'lucide-react'
import { QuestionSearchRequest } from '../types/Question'
import ApiService from '../../../../service/ApiService'
import CustomCombobox from '../../../../components/Combobox/CustomCombobox'
import { CustomInput } from '../../../../components/Input/CustomInput'

const QUESTION_TYPES = [
  { value: 'fill_in_the_blank', label: 'Điền vào chỗ trống' },
  { value: 'choice_one', label: 'Chọn một đáp án' },
  { value: 'choice_multi', label: 'Chọn nhiều đáp án' },
  { value: 'matching', label: 'Nối câu' },
  { value: 'true_false_not_given', label: 'Đúng/Sai/Không đề cập' },
  { value: 'error_identification', label: 'Nhận diện lỗi' },
  { value: 'sentence_completion', label: 'Hoàn thành câu' },
  { value: 'word_repetition', label: 'Lặp lại từ' },
  { value: 'phrase_repetition', label: 'Lặp lại cụm từ' },
  { value: 'conversational_repetition', label: 'Lặp lại hội thoại' },
  { value: 'open_conversation', label: 'Hội thoại mở' },
  { value: 'open_paragraph', label: 'Đoạn văn mở' }
]
const STATUS_LIST = [
  { value: 'draft', label: 'Nháp' },
  { value: 'pending', label: 'Đang chờ' },
  { value: 'approved', label: 'Đã duyệt' },
  { value: 'rejected', label: 'Từ chối' },
  { value: 'published', label: 'Đã xuất bản' },
  { value: 'unpublished', label: 'Chưa xuất bản' },
  { value: 'archived', label: 'Đã lưu trữ' }
]
const SKILLS = [
  { value: 'listening', label: 'Nghe' },
  { value: 'speaking', label: 'Nói' },
  { value: 'reading', label: 'Đọc' },
  { value: 'writing', label: 'Viết' },
  { value: 'grammar', label: 'Ngữ pháp' }
]
const LEVELS = [
  { value: 'beginner', label: 'Cơ bản' },
  { value: 'intermediate', label: 'Trung cấp' },
  { value: 'advanced', label: 'Nâng cao' }
]
const CREATOR_ROLES = [
  { value: 'developer', label: 'Developer' },
  { value: 'user', label: 'User' }
]

interface UserSearchResult {
  id: string
  email: string
  username: string
}

type QuestionFilterProps = {
  filters: QuestionSearchRequest
  onFilterChange: (name: keyof QuestionSearchRequest, value: any) => void
}

const QuestionFilter: FC<QuestionFilterProps> = ({ filters, onFilterChange }) => {
  const [idInput, setIdInput] = useState(filters.id ?? '')
  const [showIdSearch, setShowIdSearch] = useState(false)
  // Người tạo
  const [userInput, setUserInput] = useState('')
  const [userSearchLoading, setUserSearchLoading] = useState(false)
  const [userDropdown, setUserDropdown] = useState<UserSearchResult[]>([])
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const userDropdownRef = useRef<HTMLDivElement>(null)
  // ID Người tạo & vai trò người tạo
  const [creatorIdInput, setCreatorIdInput] = useState(filters.creator_id ?? '')
  const [showCreatorIdSearch, setShowCreatorIdSearch] = useState(false)
  const [creatorRoleInput, setCreatorRoleInput] = useState(filters.creator_role ?? '')
  // Chủ đề và thẻ
  const [topicInput, setTopicInput] = useState(filters.topic ?? '')
  const [tagInput, setTagInput] = useState(filters.tag ?? '')
  // Điểm
  const [scoreInput, setScoreInput] = useState(filters.score ?? '')
  // Của tôi
  const [isOwner, setIsOwner] = useState(!!filters.is_owner)
  useEffect(() => {
    setIsOwner(!!filters.is_owner)
  }, [filters.is_owner])
  const handleToggleIsOwner = () => {
    setIsOwner((prev) => {
      const next = !prev
      onFilterChange('is_owner', next)
      if (next) {
        onFilterChange('creator_id', '')
        onFilterChange('creator_role', '')
        setCreatorIdInput('')
        setCreatorRoleInput('')
        setUserInput('')
        setUserDropdown([])
        setShowUserDropdown(false)
      }
      return next
    })
  }
  // --- Người tạo: fetch khi bấm “Kiểm tra” (ẩn khi isOwner) ---
  const handleUserSearch = async () => {
    if (!userInput.trim()) return
    setUserSearchLoading(true)
    try {
      const resp = await ApiService.get(
        `/user/search?query=${encodeURIComponent(userInput.trim())}`,
        true
      )
      let list: UserSearchResult[] = []
      if (Array.isArray(resp)) list = resp
      else if (
        resp &&
        typeof resp === 'object' &&
        'id' in resp &&
        'email' in resp &&
        'username' in resp
      ) {
        list = [resp as UserSearchResult]
      }

      setUserDropdown(list)
      setShowUserDropdown(true)
    } catch {
      setUserDropdown([])
      setShowUserDropdown(true)
    } finally {
      setUserSearchLoading(false)
    }
  }
  // Đóng dropdown người dùng khi click ngoài
  useEffect(() => {
    if (!showUserDropdown) return
    const handleClick = (e: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false)
      }
    }
    window.addEventListener('mousedown', handleClick)
    return () => window.removeEventListener('mousedown', handleClick)
  }, [showUserDropdown])
  // -- Clear filter --
  const clearFilters = () => {
    onFilterChange('id', '')
    onFilterChange('type', '')
    onFilterChange('topic', '')
    onFilterChange('tag', '')
    onFilterChange('level', '')
    onFilterChange('score', '')
    onFilterChange('creator_id', '')
    onFilterChange('creator_role', '')
    onFilterChange('status', '')
    onFilterChange('skill', '')
    onFilterChange('is_owner', false)
    setIdInput('')
    setUserInput('')
    setUserDropdown([])
    setShowUserDropdown(false)
    setTopicInput('')
    setTagInput('')
    setScoreInput('')
    setCreatorIdInput('')
    setShowCreatorIdSearch(false)
    setCreatorRoleInput('')
    setIsOwner(false)
  }
  const hasActive =
    filters.id ||
    filters.type ||
    filters.topic ||
    filters.tag ||
    filters.level ||
    filters.score ||
    filters.creator_id ||
    filters.creator_role ||
    filters.status ||
    filters.skill ||
    filters.is_owner
  // Sync input state with filter props in case parent changes them
  useEffect(() => {
    setCreatorIdInput(filters.creator_id ?? '')
  }, [filters.creator_id])
  useEffect(() => {
    setCreatorRoleInput(filters.creator_role ?? '')
  }, [filters.creator_role])
  useEffect(() => {
    setIdInput(filters.id ?? '')
  }, [filters.id])
  useEffect(() => {
    setShowIdSearch(idInput !== (filters.id ?? ''))
  }, [idInput, filters.id])
  useEffect(() => {
    setShowCreatorIdSearch(creatorIdInput !== (filters.creator_id ?? ''))
  }, [creatorIdInput, filters.creator_id])
  // --- Main ---
  return (
    <div className="flex flex-col h-full rounded-2xl border border-[#ddd] p-4 hover:border-[#52aaaf] relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-[#52aaa5]" />
          <h2 className="text-lg font-semibold text-[#2D3748]">Bộ lọc</h2>
        </div>
        {hasActive && (
          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center gap-1 text-sm text-[#718096] hover:text-[#52aaa5] transition-colors"
          >
            <X className="h-4 w-4" />
            Xóa bộ lọc
          </button>
        )}
      </div>
      {/* Body */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {/* ID */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-[#2D3748]">ID</label>
            {showIdSearch && idInput && (
              <button
                className="text-[#52aaaf] text-sm font-medium"
                onClick={() => {
                  onFilterChange('id', idInput)
                  setShowIdSearch(false)
                }}
                type="button"
              >
                Kiểm tra
              </button>
            )}
          </div>
          <CustomInput
            value={idInput}
            onChange={setIdInput}
            className="transition-colors hover:border-[#52aaaf]"
          />
        </div>

        {/* Của tôi */}
        <div className="flex items-center gap-3 mb-2">
          <label className="block text-sm font-medium text-[#2D3748]">Của tôi</label>
          <button
            type="button"
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors border
              ${isOwner ? 'bg-[#52aaaf] border-[#43b089]' : 'bg-gray-200 border-gray-300'}
            `}
            onClick={handleToggleIsOwner}
            aria-pressed={isOwner}
          >
            <span
              className={`
                inline-block w-5 h-5 transform bg-white rounded-full transition-transform
                ${isOwner ? 'translate-x-5' : 'translate-x-0'}
              `}
            />
          </button>
          <span className="text-sm text-[#718096]">Chỉ hiển thị các câu hỏi bạn tạo</span>
        </div>

        {/* Người tạo */}
        <div ref={userDropdownRef}>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-[#2D3748]">Tìm kiếm người dùng</label>
            {!isOwner && (
              <button
                type="button"
                onClick={handleUserSearch}
                className="text-[#52aaa5] text-sm font-medium"
              >
                Kiểm tra
              </button>
            )}
          </div>
          <CustomInput
            value={userInput}
            onChange={!isOwner ? setUserInput : () => {}}
            onFocus={() => !isOwner && setShowUserDropdown(!!userDropdown.length)}
            className={`transition-colors hover:border-[#52aaaf] ${
              isOwner ? 'opacity-50 pointer-events-none bg-[#f5f6fa]' : ''
            }`}
          />
          {/* Dropdown - nếu có kết quả */}
          {!isOwner && showUserDropdown && (
            <div className="absolute left-0 right-0 z-20 mt-2 bg-white border border-[#ddd] rounded-lg shadow-xl max-h-60 overflow-y-auto animate-fade-in">
              {userSearchLoading && (
                <div className="flex items-center gap-2 px-3 py-2 text-[#2D3748]">
                  <Loader2 className="animate-spin h-4 w-4" /> Đang tìm kiếm...
                </div>
              )}
              {!userSearchLoading &&
                userDropdown.length > 0 &&
                userDropdown.map((user) => (
                  <button
                    type="button"
                    key={user.id}
                    onClick={() => {
                      onFilterChange('creator_id', user.id)
                      setCreatorIdInput(user.id)
                      setUserInput(`${user.username} (${user.email})`)
                      setShowUserDropdown(false)
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-[#ebf8fa] transition-colors cursor-pointer flex flex-col"
                  >
                    <span className="font-medium text-[#2D3748]">{user.username}</span>
                    <span className="text-xs text-[#718096]">{user.email}</span>
                  </button>
                ))}
              {!userSearchLoading && userDropdown.length === 0 && (
                <div className="px-3 py-2 text-[#718096]">Không tìm thấy</div>
              )}
            </div>
          )}
        </div>

        {/* ID Người tạo */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-[#2D3748]">ID Người tạo</label>
            {showCreatorIdSearch && creatorIdInput && !isOwner && (
              <button
                className="text-[#52aaaf] text-sm font-medium"
                type="button"
                onClick={() => {
                  onFilterChange('creator_id', creatorIdInput)
                  setShowCreatorIdSearch(false)
                }}
              >
                Kiểm tra
              </button>
            )}
          </div>
          <CustomInput
            value={creatorIdInput}
            onChange={!isOwner ? setCreatorIdInput : () => {}}
            className={`transition-colors hover:border-[#52aaaf] ${
              isOwner ? 'opacity-50 pointer-events-none bg-[#f5f6fa]' : ''
            }`}
          />
        </div>

        {/* Vai trò người tạo */}
        <CustomCombobox
          label="Vai trò người tạo"
          value={creatorRoleInput || ''}
          options={CREATOR_ROLES}
          onChange={
            !isOwner
              ? (val) => {
                  setCreatorRoleInput(val)
                  onFilterChange('creator_role', val)
                }
              : () => {}
          }
          className={isOwner ? 'opacity-50 pointer-events-none bg-[#f5f6fa]' : ''}
        />

        {/* Trạng thái */}
        <CustomCombobox
          label="Trạng thái"
          value={filters.status || ''}
          options={STATUS_LIST}
          onChange={(val) => onFilterChange('status', val)}
        />
        {/* Kỹ năng */}
        <CustomCombobox
          label="Kỹ năng"
          value={filters.skill || ''}
          options={SKILLS}
          onChange={(val) => onFilterChange('skill', val)}
        />
        {/* Loại câu hỏi */}
        <CustomCombobox
          label="Loại câu hỏi"
          value={filters.type || ''}
          options={QUESTION_TYPES}
          onChange={(val) => onFilterChange('type', val)}
        />
        {/* Chủ đề */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-[#2D3748]">Chủ đề</label>
            <button
              className="text-[#52aaa5] text-sm font-medium"
              type="button"
              onClick={() => onFilterChange('topic', topicInput)}
            >
              Kiểm tra
            </button>
          </div>
          <CustomInput
            value={topicInput}
            onChange={setTopicInput}
            className="transition-colors hover:border-[#52aaaf]"
          />
        </div>
        {/* Thẻ */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-[#2D3748]">Thẻ</label>
            <button
              className="text-[#52aaa5] text-sm font-medium"
              type="button"
              onClick={() => onFilterChange('tag', tagInput)}
            >
              Kiểm tra
            </button>
          </div>
          <CustomInput
            value={tagInput}
            onChange={setTagInput}
            className="transition-colors hover:border-[#52aaaf]"
          />
        </div>
        {/* Cấp độ */}
        <CustomCombobox
          label="Cấp độ"
          value={filters.level || ''}
          options={LEVELS}
          onChange={(val) => onFilterChange('level', val)}
        />
        {/* Điểm */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-[#2D3748]">Điểm</label>
            <button
              className="text-[#52aaa5] text-sm font-medium"
              type="button"
              onClick={() => onFilterChange('score', scoreInput ? Number(scoreInput) : '')}
            >
              Kiểm tra
            </button>
          </div>
          <CustomInput
            value={String(scoreInput ?? '')}
            onChange={setScoreInput}
            className="transition-colors hover:border-[#52aaaf]"
          />
        </div>
      </div>
    </div>
  )
}

export default QuestionFilter

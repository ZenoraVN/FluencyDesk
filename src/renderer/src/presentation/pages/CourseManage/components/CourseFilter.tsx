import { FC, useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Filter, X, Loader2 } from 'lucide-react'
import { CourseSearchRequest } from '../type/Course'
import CustomCombobox from '../../../../components/Combobox/CustomCombobox'
import { CustomInput } from '../../../../components/Input/CustomInput'
import ApiService from '../../../../service/ApiService'
type UserSearchResult = {
  id: string
  email: string
  username: string
}

const COURSE_TYPES = [
  { value: 'BOOK', label: 'Sách' },
  { value: 'OTHER', label: 'Khác' }
]
const COURSE_SKILLS = [
  { value: 'listening', label: 'Nghe' },
  { value: 'reading', label: 'Đọc' },
  { value: 'writing', label: 'Viết' },
  { value: 'speaking', label: 'Nói' },
  { value: 'grammar', label: 'Ngữ pháp' },
  { value: 'vocabulary', label: 'Từ vựng' }
]
const COURSE_TAGS = [
  { value: 'vocabulary', label: 'vocabulary' },
  { value: 'grammar', label: 'grammar' },
  { value: 'listening', label: 'listening' },
  { value: 'reading', label: 'reading' },
  { value: 'writing', label: 'writing' },
  { value: 'speaking', label: 'speaking' }
]
const STATUS_LIST = [
  { value: 'draft', label: 'Nháp' },
  { value: 'published', label: 'Công khai' }
]
const CREATOR_ROLES = [
  { value: 'developer', label: 'Developer' },
  { value: 'user', label: 'User' }
]
const LEVEL_LIST = [
  { value: 'beginner', label: 'Cơ bản' },
  { value: 'intermediate', label: 'Trung cấp' },
  { value: 'advanced', label: 'Nâng cao' }
]

interface CourseFilterProps {
  filters: CourseSearchRequest
  onFilterChange: (name: keyof CourseSearchRequest, value: any) => void
  onSearch?: () => void
}

const CourseFilter: FC<CourseFilterProps> = ({ filters, onFilterChange, onSearch }) => {
  // State cho các field
  const [titleInput, setTitleInput] = useState(filters.title ?? '')
  const [showTitleSearch, setShowTitleSearch] = useState(false)
  const [userSearch, setUserSearch] = useState('')
  const [lastUserSearched, setLastUserSearched] = useState('')
  const [showUserSearchButton, setShowUserSearchButton] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const userDropdownRef = useRef<HTMLDivElement>(null)
  const [creatorIdInput, setCreatorIdInput] = useState(filters.creator_id ?? '')
  const [showCreatorIdSearch, setShowCreatorIdSearch] = useState(false)

  // Của tôi state & logic
  const [isOwner, setIsOwner] = useState(!!filters.is_owner)
  useEffect(() => {
    setIsOwner(!!filters.is_owner)
  }, [filters.is_owner])
  const handleToggleIsOwner = () => {
    setIsOwner((v) => {
      const next = !v
      onFilterChange('is_owner', next)
      if (next) {
        onFilterChange('creator_id', '')
        onFilterChange('creator_role', '')
      }
      return next
    })
  }

  // User Search Query
  const {
    data: users,
    isFetching: isLoadingUsers,
    error: userError,
    refetch: refetchUsers
  } = useQuery<UserSearchResult[]>({
    queryKey: ['userSearch', userSearch],
    queryFn: async () => {
      if (!userSearch.trim()) return []
      const resp = await ApiService.get(
        `/user/search?query=${encodeURIComponent(userSearch.trim())}`,
        true
      )
      if (Array.isArray(resp)) return resp
      if (resp && typeof resp === 'object') return [resp]
      return []
    },
    enabled: false,
    staleTime: 60_000,
    refetchOnWindowFocus: false
  })

  useEffect(() => {
    setShowTitleSearch(titleInput !== (filters.title ?? ''))
  }, [titleInput, filters.title])

  useEffect(() => {
    setShowUserSearchButton(
      !!userSearch &&
        userSearch !== lastUserSearched &&
        userSearch !== '' &&
        userSearch !== filters.creator_id
    )
  }, [userSearch, lastUserSearched, filters.creator_id])

  useEffect(() => {
    setShowCreatorIdSearch(creatorIdInput !== (filters.creator_id ?? ''))
  }, [creatorIdInput, filters.creator_id])

  useEffect(() => {
    if (!showUserDropdown) return
    function handleClick(e: MouseEvent) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false)
      }
    }
    window.addEventListener('mousedown', handleClick)
    return () => window.removeEventListener('mousedown', handleClick)
  }, [showUserDropdown])

  useEffect(() => {
    if (filters.is_random === undefined) onFilterChange('is_random', true)
  }, [filters.is_random, onFilterChange])
  // Clear lọc
  const clearFilters = () => {
    onFilterChange('type', '')
    onFilterChange('title', '')
    onFilterChange('skills', '')
    onFilterChange('tags', '')
    onFilterChange('level', '')
    onFilterChange('status', '')
    onFilterChange('creator_id', '')
    onFilterChange('creator_role', '')
    onFilterChange('is_random', true)
    onFilterChange('is_owner', false)
    setTitleInput('')
    setUserSearch('')
    setLastUserSearched('')
    setCreatorIdInput('')
    setIsOwner(false)
  }
  const hasActiveFilters = !!(
    filters.type ||
    filters.title ||
    filters.skills ||
    filters.tags ||
    filters.level ||
    filters.status ||
    filters.creator_id ||
    filters.creator_role ||
    filters.is_owner
  )
  // Handle chọn user từ dropdown
  const handleSelectUser = (user: UserSearchResult) => {
    onFilterChange('creator_id', user.id)
    setUserSearch('')
    setLastUserSearched('')
    setShowUserDropdown(false)
    onSearch?.()
  }
  // Sync state với filters khi cha cập nhật
  useEffect(() => {
    setTitleInput(filters.title ?? '')
  }, [filters.title])
  useEffect(() => {
    setCreatorIdInput(filters.creator_id ?? '')
  }, [filters.creator_id])
  // UI
  return (
    <div className="flex flex-col h-full rounded-2xl border border-[#ddd] p-4 hover:border-[#52aaaf] relative">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-[#52aaa5]" />
          <h2 className="text-lg font-semibold text-[#2D3748]">Bộ lọc</h2>
        </div>
        {hasActiveFilters && (
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
      {/* BODY */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {/* Tiêu đề */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-[#2D3748]">Tiêu đề</label>
            {showTitleSearch && titleInput && (
              <button
                className="text-[#52aaaf] text-sm font-medium"
                onClick={() => {
                  onFilterChange('title', titleInput)
                  onSearch?.()
                  setShowTitleSearch(false)
                }}
                type="button"
              >
                Tìm kiếm
              </button>
            )}
          </div>
          <CustomInput
            value={titleInput}
            onChange={setTitleInput}
            className="transition-colors hover:border-[#52aaaf]"
          />
        </div>
        <CustomCombobox
          label="Loại khóa học"
          value={filters.type || ''}
          options={COURSE_TYPES}
          onChange={(val) => onFilterChange('type', val)}
        />
        <CustomCombobox
          label="Kỹ năng"
          value={filters.skills || ''}
          options={COURSE_SKILLS}
          onChange={(val) => onFilterChange('skills', val)}
        />
        <CustomCombobox
          label="Tags"
          value={filters.tags || ''}
          options={COURSE_TAGS}
          onChange={(val) => onFilterChange('tags', val)}
        />
        <CustomCombobox
          label="Cấp độ"
          value={filters.level || ''}
          options={LEVEL_LIST}
          onChange={(val) => onFilterChange('level', val)}
        />
        <CustomCombobox
          label="Trạng thái"
          value={filters.status || ''}
          options={STATUS_LIST}
          onChange={(val) => onFilterChange('status', val)}
        />

        {/* Toggle "Của tôi" */}
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
          <span className="text-sm text-[#718096]">Chỉ hiển thị các khóa học bạn tạo</span>
        </div>

        {/* Tìm kiếm người dùng */}
        <div className="relative" ref={userDropdownRef}>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-[#2D3748]">Tìm kiếm người dùng</label>
            {showUserSearchButton && !isOwner && (
              <button
                className="text-[#52aaaf] text-sm font-medium"
                type="button"
                onClick={async () => {
                  await refetchUsers()
                  setShowUserDropdown(!!userSearch)
                  setShowUserSearchButton(false)
                  setLastUserSearched(userSearch)
                }}
              >
                Tìm kiếm
              </button>
            )}
          </div>
          <CustomInput
            value={userSearch}
            onChange={!isOwner ? setUserSearch : () => {}}
            onFocus={() => !isOwner && setShowUserDropdown(!!userSearch)}
            className={`transition-colors hover:border-[#52aaaf] ${
              isOwner ? 'opacity-50 pointer-events-none bg-[#f5f6fa]' : ''
            }`}
          />
          {/* User Dropdown */}
          {!isOwner && showUserDropdown && users && users.length > 0 && (
            <div className="absolute left-0 right-0 z-20 top-[74px] bg-white border border-[#ddd] rounded-lg shadow-xl max-h-60 overflow-y-auto animate-fade-in">
              {isLoadingUsers && (
                <div className="flex items-center gap-2 px-3 py-2 text-[#2D3748]">
                  <Loader2 className="animate-spin h-4 w-4" /> Đang tìm kiếm...
                </div>
              )}
              {userError && <div className="px-3 py-2 text-red-500">Lỗi tìm kiếm người dùng</div>}
              {!isLoadingUsers &&
                (users ?? []).map((user) => (
                  <button
                    type="button"
                    key={user.id}
                    onClick={() => handleSelectUser(user)}
                    className="w-full px-3 py-2 text-left hover:bg-[#ebf8fa] transition-colors cursor-pointer"
                    tabIndex={0}
                  >
                    <div className="font-medium text-[#2D3748]">{user.username}</div>
                    <div className="text-xs text-[#718096]">{user.email}</div>
                  </button>
                ))}
              {!isLoadingUsers && (users ?? []).length === 0 && (
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
                  onSearch?.()
                  setShowCreatorIdSearch(false)
                }}
              >
                Tìm kiếm
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
        <CustomCombobox
          label="Vai trò người tạo"
          value={filters.creator_role || ''}
          options={CREATOR_ROLES}
          onChange={!isOwner ? (val) => onFilterChange('creator_role', val) : () => {}}
          className={isOwner ? 'opacity-50 pointer-events-none bg-[#f5f6fa]' : ''}
        />
      </div>
    </div>
  )
}
export default CourseFilter

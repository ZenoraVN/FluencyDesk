import { FC } from 'react'
import CourseCard from './CourseCard'
import { Course } from '../type/Course'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis
} from '../../../../components/ui/pagination'

interface CourseGridProps {
  courses: Course[]
  total: number
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
  onView?: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  loading?: boolean
  emptyMessage?: React.ReactNode
}

const CourseGrid: FC<CourseGridProps> = ({
  courses,
  total,
  currentPage,
  pageSize,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  loading,
  emptyMessage
}) => {
  // splits courses into [[row1, row2], ...] where each row contains up to 2
  const rows: Course[][] = []
  for (let i = 0; i < courses.length; i += 2) {
    rows.push(courses.slice(i, i + 2))
  }

  return (
    <div className="flex flex-col h-full">
      {loading ? (
        <div className="w-full flex-1 flex items-center justify-center text-[#52aaa5] animate-pulse text-lg py-8">
          Đang tải danh sách khóa học...
        </div>
      ) : courses.length === 0 ? (
        <div className="w-full flex-1 flex items-center justify-center py-12">
          {emptyMessage || (
            <>
              <div className="mb-2 text-xl font-semibold text-[#2D3748]">
                Không tìm thấy khóa học
              </div>
              <p className="text-[#718096]">Thử điều chỉnh bộ lọc tìm kiếm</p>
            </>
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="space-y-6">
            {rows.map((row, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {row.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
                {/* If odd, grid will auto stretch last item to 1 column */}
              </div>
            ))}
          </div>
        </div>
      )}
      {/* PAGINATION */}
      <div className="flex flex-col items-center justify-center py-6">
        {/* Custom pagination logic with shadcn/ui primitives */}
        {total > pageSize && (
          <Pagination>
            <PaginationContent>
              {/* Previous button */}
              <PaginationItem>
                <PaginationPrevious
                  aria-disabled={currentPage === 1}
                  tabIndex={currentPage === 1 ? -1 : undefined}
                  onClick={currentPage === 1 ? undefined : () => onPageChange(currentPage - 1)}
                />
              </PaginationItem>
              {/* First page */}
              {currentPage > 2 && (
                <>
                  <PaginationItem>
                    <PaginationLink onClick={() => onPageChange(1)} isActive={currentPage === 1}>
                      1
                    </PaginationLink>
                  </PaginationItem>
                  {currentPage > 3 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                </>
              )}
              {/* The pages around current */}
              {Array.from({ length: 3 }, (_, i) => currentPage - 1 + i)
                .filter((page) => page > 0 && page <= Math.ceil(total / pageSize))
                .map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => page !== currentPage && onPageChange(page)}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
              {/* Next/Last ellipsis logic */}
              {currentPage < Math.ceil(total / pageSize) - 1 && (
                <>
                  {currentPage < Math.ceil(total / pageSize) - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => onPageChange(Math.ceil(total / pageSize))}
                      isActive={currentPage === Math.ceil(total / pageSize)}
                    >
                      {Math.ceil(total / pageSize)}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}
              {/* Next button */}
              <PaginationItem>
                <PaginationNext
                  aria-disabled={currentPage === Math.ceil(total / pageSize)}
                  tabIndex={currentPage === Math.ceil(total / pageSize) ? -1 : undefined}
                  onClick={
                    currentPage === Math.ceil(total / pageSize)
                      ? undefined
                      : () => onPageChange(currentPage + 1)
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  )
}

export default CourseGrid

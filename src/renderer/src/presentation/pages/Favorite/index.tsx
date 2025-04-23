import { useState, useEffect } from 'react'
import { ArrowLeft, CloudOff, Heart } from 'lucide-react'
import FavoriteStats from './components/FavoriteStats'
import RecentActivities from './components/RecentActivities'
import FavoriteCourseCard from './components/FavoriteCourseCard'
import { favoriteCourses } from './data/mockData'
import { Card } from '../../../components/ui/card'

const FavoritePage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOfflineMode, setIsOfflineMode] = useState(false)

  const checkNetworkAndLoadData = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Uncomment to test empty state
      // setFavoriteCourses([])
    }, 1000)
  }

  useEffect(() => {
    checkNetworkAndLoadData()
  }, [])

  const handleCourseClick = (courseId: string) => {
    // Handle course click
    console.log('Navigate to course:', courseId)
  }

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 rounded-full bg-[#52aaa5]/10 p-6">
        <Heart className="h-16 w-16 text-[#52aaa5]" />
      </div>
      <h3 className="mb-3 text-xl font-semibold text-[#2D3748]">
        Chưa có khóa học yêu thích nào
      </h3>
      <p className="max-w-md text-sm text-[#718096]">
        Hãy thêm các khóa học yêu thích để dễ dàng truy cập và theo dõi tiến độ học tập của bạn
      </p>
    </div>
  )

  const renderOfflineBanner = () => (
    <div className="mb-4 rounded-2xl bg-[#52aaa5]/10 p-4">
      <div className="flex items-center gap-2">
        <CloudOff className="h-5 w-5 text-[#52aaa5]" />
        <span className="text-sm font-medium text-[#52aaa5]">
          Đang sử dụng dữ liệu ngoại tuyến
        </span>
      </div>
    </div>
  )

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-[400px] animate-pulse bg-gray-100" />
          ))}
        </div>
      )
    }

    if (error?.toLowerCase().includes('maintenance')) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="rounded-full bg-yellow-100 p-4">
            <span className="text-4xl">🔧</span>
          </div>
          <h3 className="text-xl font-semibold text-[#2D3748]">Đang bảo trì</h3>
          <p className="text-[#718096]">Vui lòng thử lại sau</p>
        </div>
      )
    }

    if (error === 'offline_not_found') {
      return (
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="rounded-full bg-red-100 p-4">
            <CloudOff className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-[#2D3748]">Không tìm thấy dữ liệu ngoại tuyến</h3>
          <p className="text-[#718096]">Vui lòng kết nối internet để tải dữ liệu</p>
        </div>
      )
    }

    if (favoriteCourses.length === 0) {
      return renderEmptyState()
    }

    return (
      <>
        {isOfflineMode && renderOfflineBanner()}
        
        {/* Stats Overview */}
        <FavoriteStats />

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Favorite Courses Grid */}
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-xl font-semibold text-[#2D3748]">Khóa học yêu thích</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {favoriteCourses.map((course) => (
                <FavoriteCourseCard
                  key={course.id}
                  course={course}
                  onClick={handleCourseClick}
                />
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div>
            <RecentActivities />
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-[#f6f6f0] p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center gap-4">
          <button 
            onClick={() => window.history.back()}
            className="rounded-2xl p-2 text-[#2D3748] hover:bg-[#52aaa5]/10"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-semibold text-[#2D3748]">Khóa học yêu thích</h1>
        </div>

        {renderContent()}
      </div>
    </div>
  )
}

export default FavoritePage
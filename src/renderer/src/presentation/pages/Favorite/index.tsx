import { useState, useEffect } from 'react'
import { Card } from '../../../components/ui/card'
import { Heart, CloudOff, ArrowLeft } from 'lucide-react'
import { courses } from '../Home/data'
import { Badge } from '../../../components/ui/badge'

const FavoritePage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOfflineMode, setIsOfflineMode] = useState(false)

  // Simulate some courses as favorites
  const favoriteCourses = courses.slice(0, 3)

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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="h-[300px] animate-pulse bg-gray-100" />
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favoriteCourses.map((course) => (
            <Card 
              key={course.id} 
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#52aaa5]/20 hover:ring-2 hover:ring-[#52aaa5]"
            >
              <div className="relative">
                <img
                  src={course.image_urls[0]}
                  alt={course.title}
                  className="aspect-square w-full object-cover"
                />
                <Badge 
                  variant="secondary" 
                  className="absolute right-3 top-3 bg-[#52aaa5] text-xs font-medium text-white"
                >
                  {course.band}
                </Badge>
                {/* Simulated progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                  <div 
                    className="h-full bg-[#52aaa5]" 
                    style={{ width: '60%' }}
                  />
                </div>
              </div>
              <div className="flex flex-col p-4">
                <h3 className="line-clamp-1 text-lg font-medium text-[#2D3748]">
                  {course.title}
                </h3>
                <div className="mt-2 flex-1">
                  <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
                    {course.skills.map((skill, index) => {
                      const colors = [
                        'bg-[#FF69B4]/20 text-[#FF69B4]',
                        'bg-[#4A90E2]/20 text-[#4A90E2]',
                        'bg-[#3CB371]/20 text-[#3CB371]',
                        'bg-[#9370DB]/20 text-[#9370DB]',
                        'bg-[#FF7F50]/20 text-[#FF7F50]',
                        'bg-[#FFD700]/20 text-[#FFD700]'
                      ];
                      return (
                        <Badge 
                          key={skill} 
                          variant="secondary" 
                          className={`${colors[index % colors.length]} shrink-0 text-xs font-medium`}
                        >
                          {skill}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
                <p className="mt-2 text-sm text-[#718096]">
                  60% hoàn thành
                </p>
              </div>
            </Card>
          ))}
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

// Add styles to hide scrollbar but keep functionality
const style = document.createElement('style');
style.textContent = `
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;
document.head.appendChild(style);

export default FavoritePage
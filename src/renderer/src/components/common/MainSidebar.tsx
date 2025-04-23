import { Link, useLocation } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import {
  Home,
  GraduationCap,
  Book,
  Settings,
  UserPlus,
  LogOut,
  RefreshCw,
  User,
  StickyNote,
  Wifi,
  Trophy,
  BarChart2,
  Bell
} from 'lucide-react'

const MainSidebar = () => {
  const location = useLocation()
  
  const isActive = (path: string) => {
    return location.pathname === path
  }

  // Fake user data
  const userData = {
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    lastSync: "2 phút trước",
    version: "v1.0.3",
    premium: true,
    progress: {
      coursesCompleted: 3,
      currentStreak: 7
    }
  }

  const navItems = [
    { path: '/', icon: Home, label: 'Trang chủ' },
    { path: '/favorite', icon: GraduationCap, label: 'Khóa học' },
    { path: '/notes', icon: StickyNote, label: 'Ghi chú' },
    { path: '/offline', icon: Wifi, label: 'Ngoại tuyến' },
    { path: '/competition', icon: Trophy, label: 'Thi đấu' },
    { path: '/statistics', icon: BarChart2, label: 'Thống kê' },
    { path: '/notifications', icon: Bell, label: 'Thông báo' },
    { path: '/notebook', icon: Book, label: 'Sổ tay' },
    { path: '/settings', icon: Settings, label: 'Cài đặt' },
  ]

  return (
    <aside className="fixed inset-y-0 left-0 w-72 border-r border-[#52aaa5]/10 bg-[#f6f6f0]">
      <div className="flex h-full flex-col p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2D3748]">Fluency</h1>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#52aaa5]/10">
              <User className="h-5 w-5 text-[#52aaa5]" />
            </div>
            <div>
              <p className="font-medium text-[#2D3748]">{userData.name}</p>
              <p className="text-sm text-[#718096]">{userData.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant={isActive(item.path) ? 'secondary' : 'ghost'}
                className={`w-full justify-start gap-3 rounded-2xl py-6 text-base transition-colors ${
                  isActive(item.path)
                    ? 'bg-[#52aaa5] text-white hover:bg-[#52aaa5]/90'
                    : 'text-[#2D3748] hover:bg-[#52aaa5]/10'
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive(item.path) ? 'text-white' : 'text-[#52aaa5]'}`} />
                {item.label}
              </Button>
            </Link>
          ))}
        </div>

        {/* User Stats */}
        <div className="mb-6 rounded-2xl bg-[#52aaa5]/5 p-4">
          <div className="mb-2 flex justify-between">
            <span className="text-sm text-[#2D3748]">Khóa học đã hoàn thành</span>
            <span className="font-medium text-[#52aaa5]">{userData.progress.coursesCompleted}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-[#2D3748]">Chuỗi ngày học</span>
            <span className="font-medium text-[#52aaa5]">{userData.progress.currentStreak} ngày</span>
          </div>
        </div>

        {/* Account Actions */}
        <div className="space-y-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 rounded-2xl text-base text-[#2D3748] hover:bg-[#52aaa5]/10"
          >
            <UserPlus className="h-5 w-5 text-[#52aaa5]" />
            Chuyển tài khoản
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 rounded-2xl text-base text-red-500 hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            Đăng xuất
          </Button>
        </div>

        {/* Footer Info */}
        <div className="mt-6 border-t border-[#52aaa5]/10 pt-4">
          <div className="flex items-center justify-between text-sm text-[#718096]">
            <div className="flex items-center gap-1">
              <RefreshCw className="h-4 w-4 text-[#52aaa5]" />
              <span>Đồng bộ {userData.lastSync}</span>
            </div>
            <span>{userData.version}</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default MainSidebar

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
  User
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
    { path: '/courses', icon: GraduationCap, label: 'Khóa học' },
    { path: '/notebook', icon: Book, label: 'Sổ tay' },
    { path: '/settings', icon: Settings, label: 'Cài đặt' },
  ]

  return (
    <nav className="w-72 border-r border-border bg-card p-6 flex flex-col h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Fluency</h1>
        <div className="mt-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{userData.name}</p>
            <p className="text-sm text-muted-foreground">{userData.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="space-y-2 flex-1">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <Button
              variant={isActive(item.path) ? 'secondary' : 'ghost'}
              className="w-full justify-start gap-3 text-base py-6"
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Button>
          </Link>
        ))}
      </div>

      {/* User Stats */}
      <div className="mb-6 p-4 bg-primary/5 rounded-lg">
        <div className="flex justify-between mb-2">
          <span className="text-sm">Khóa học đã hoàn thành</span>
          <span className="font-medium">{userData.progress.coursesCompleted}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Chuỗi ngày học</span>
          <span className="font-medium">{userData.progress.currentStreak} ngày</span>
        </div>
      </div>

      {/* Account Actions */}
      <div className="space-y-2">
        <Button variant="ghost" className="w-full justify-start gap-3 text-base">
          <UserPlus className="h-5 w-5" />
          Chuyển tài khoản
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-3 text-base text-destructive">
          <LogOut className="h-5 w-5" />
          Đăng xuất
        </Button>
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <RefreshCw className="h-4 w-4" />
            <span>Đồng bộ {userData.lastSync}</span>
          </div>
          <span>{userData.version}</span>
        </div>
      </div>
    </nav>
  )
}

export default MainSidebar

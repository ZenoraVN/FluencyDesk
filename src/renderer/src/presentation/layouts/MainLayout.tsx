import { Link, Outlet, useLocation } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { 
  Home,
  BookOpen,
  GraduationCap,
  Book,
  BookMarked,
  Settings
} from 'lucide-react'

const MainLayout = () => {
  const location = useLocation()
  
  const isActive = (path: string) => {
    return location.pathname === path
  }

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/courses', icon: BookOpen, label: 'Courses' },
    { path: '/lessons/current', icon: GraduationCap, label: 'Current Lesson' },
    { path: '/notebook', icon: Book, label: 'Notebook' },
    { path: '/wiki', icon: BookMarked, label: 'Wiki' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <main className="flex min-h-screen">
        {/* Sidebar */}
        <nav className="w-64 border-r border-border bg-card p-4">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Fluency</h1>
          </div>
          <div className="space-y-2">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? 'secondary' : 'ghost'}
                  className="w-full justify-start gap-2"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        </nav>
        
        {/* Main content */}
        <div className="flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default MainLayout
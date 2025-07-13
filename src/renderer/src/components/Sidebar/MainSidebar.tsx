import { useState } from 'react'
import { cn } from '../../shared/lib/utils'
import { Button } from '../ui/button'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  GraduationCap,
  Star,
  StickyNote,
  BarChart2,
  Bell,
  BookOpen,
  Settings,
  LogOut
} from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../../presentation/providers/theme-provider'

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const menuItems = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    iconClassName: 'text-[#52aaa5]', // teal
    href: '/'
  },
  {
    icon: GraduationCap,
    label: 'My Course',
    iconClassName: 'text-[#eab308]', // yellow-500
    href: '/my-course'
  },
  {
    icon: Star,
    label: 'Favorite Course',
    iconClassName: 'text-[#f59e42]', // orange
    href: '/favorite'
  },
  {
    icon: StickyNote,
    label: 'Note',
    iconClassName: 'text-[#f43f5e]', // pink
    href: '/note'
  },
  {
    icon: BarChart2,
    label: 'Analytic',
    iconClassName: 'text-[#28b4e0]', // blue
    href: '/analytics'
  },
  {
    icon: Bell,
    label: 'Notification',
    iconClassName: 'text-[#a855f7]', // purple
    href: '/notification'
  },
  {
    icon: BookOpen,
    label: 'Notebook',
    iconClassName: 'text-[#22c55e]', // green
    href: '/notebook'
  },
  {
    icon: Settings,
    label: 'Setting',
    iconClassName: 'text-[#f472b6]', // rose
    href: '/settings'
  }
]

const sidebarVariants = {
  hidden: { x: -300, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 20
    }
  }
}

export function Sidebar({ className }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  useTheme()
  const [activeItem, setActiveItem] = useState<string>(location.pathname)

  // Fake user data
  const fakeUser = {
    username: 'Nguyễn Văn A',
    email: 'nguyenvana@gmail.com'
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
      className={cn(
        'fixed inset-y-0 left-0 w-72 border-r border-[#52aaa5]/10',
        'flex flex-col p-6',
        className
      )}
    >
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2D3748]">Fluency</h1>
      </div>

      {/* Menu Items */}
      <div className="flex-1 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.label}>
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-start gap-3 rounded-2xl py-6 text-base transition-colors',
                activeItem === item.href
                  ? 'bg-[#52aaa5] text-white hover:bg-[#52aaa5]/90'
                  : 'text-[#2D3748] hover:bg-[#52aaa5]/10'
              )}
              onClick={() => {
                setActiveItem(item.href)
                item.href && navigate(item.href)
              }}
            >
              <item.icon
                className={cn(
                  'h-5 w-5',
                  activeItem === item.href ? 'text-white' : item.iconClassName
                )}
              />
              <span>{item.label}</span>
            </Button>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="space-y-2 pt-4 border-t border-[#52aaa5]/10">
        {/* User Info */}
        <div className="px-3 py-2">
          <p className="text-sm font-medium text-[#2D3748]">{fakeUser.username}</p>
          <p className="text-xs text-gray-500">{fakeUser.email}</p>
        </div>

        <div>
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start gap-3 rounded-2xl py-4',
              'text-red-500 hover:bg-red-50',
              'transition-colors'
            )}
          >
            <LogOut className="h-4 w-4" />
            <span>Đăng xuất</span>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

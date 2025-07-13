import { Heart, Bell } from 'lucide-react'
import { cn } from '../../shared/lib/utils'

const fakeUser = {
  username: 'Nguyễn Văn A',
  email: 'nguyenvana@gmail.com'
}

export default function MainNavbar() {
  return (
    <nav
      className={cn(
        'w-full h-12 flex items-center justify-between px-6',
        'border-b border-[#52aaa5]/10',
        'bg-background',
        'pl-0',
        'sticky top-0 z-30'
      )}
      style={{ minWidth: 0 }}
    >
      <div className="flex items-center gap-4 ml-auto">
        {/* Heart Icon */}
        <button
          className="rounded-full hover:bg-[#f59e4228] transition-colors p-1.5"
          type="button"
          aria-label="Favorites"
        >
          <Heart className="w-5 h-5 text-[#f59e42]" />
        </button>

        {/* Notification Icon */}
        <button
          className="rounded-full hover:bg-[#a855f728] transition-colors p-1.5"
          type="button"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-[#a855f7]" />
        </button>

        {/* User info */}
        <div className="flex flex-col items-end mr-2">
          <span className="font-medium text-sm text-[#2D3748] leading-none">
            {fakeUser.username}
          </span>
          <span className="text-[10px] text-gray-500 leading-tight">{fakeUser.email}</span>
        </div>

        {/* Avatar */}
        <div
          className="w-8 h-8 flex items-center justify-center"
          style={{
            background: '#52aaa5',
            color: '#fff',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 13
          }}
        >
          {fakeUser.username
            .split(' ')
            .map((x) => x[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()}
        </div>
      </div>
    </nav>
  )
}

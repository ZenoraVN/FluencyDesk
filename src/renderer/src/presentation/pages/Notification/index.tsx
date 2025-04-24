import { useState } from 'react'
import { Card } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import {
  Search,
  Filter,
  Bell,
  Volume2,
  Clock,
  Mail,
  Settings,
  GraduationCap,
  Calendar,
  User,
  CheckSquare
} from 'lucide-react'
import { Switch } from '../../../components/ui/switch'
import NotificationItem from './components/NotificationItem'
import { notifications } from './data/mockData'


const NotificationPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [notificationPrefs, setNotificationPrefs] = useState({
    pushEnabled: true,
    soundEnabled: true,
    scheduleEnabled: false,
    emailEnabled: true
  })

  const [typePrefs, setTypePrefs] = useState({
    system: true,
    learning: true,
    calendar: true,
    personal: true,
    task: true
  })

  const handlePrefChange = (key: keyof typeof notificationPrefs) => {
    setNotificationPrefs(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleTypePrefChange = (key: keyof typeof typePrefs) => {
    setTypePrefs(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleDeleteNotification = (id: string) => {
    console.log('Delete notification:', id)
  }

  const handleMarkAsRead = (id: string) => {
    console.log('Mark as read:', id)
  }

  const filterNotifications = (type: string) => {
    return notifications.filter((notification) => {
      const matchesSearch = searchQuery.toLowerCase() === '' || 
        notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesType = type === 'all' || notification.type === type

      return matchesSearch && matchesType
    })
  }

  return (
    <div className="min-h-screen bg-[#f6f6f0] p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#2D3748]">Thông Báo</h1>
        <p className="mt-2 text-[#718096]">
          Quản lý thông báo và theo dõi hoạt động của bạn
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card className="overflow-hidden">
            {/* Search and Filter */}
            <div className="border-b border-[#52aaa5]/10 p-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#718096]" />
                  <Input
                    className="pl-9"
                    placeholder="Tìm kiếm thông báo..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="gap-2 border-[#E2E8F0] hover:border-[#52aaa5]/20">
                  <Filter className="h-4 w-4" />
                  Lọc
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="all" className="w-full">
              <div className="border-b border-[#52aaa5]/10 px-4">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="all">Tất cả</TabsTrigger>
                  <TabsTrigger value="system">Hệ thống</TabsTrigger>
                  <TabsTrigger value="learning">Học tập</TabsTrigger>
                  <TabsTrigger value="calendar">Lịch</TabsTrigger>
                  <TabsTrigger value="personal">Cá nhân</TabsTrigger>
                  <TabsTrigger value="task">Nhiệm vụ</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="all" className="m-0">
                <div className="divide-y divide-[#52aaa5]/10">
                  {filterNotifications('all').map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onDelete={handleDeleteNotification}
                      onMarkAsRead={handleMarkAsRead}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="system" className="m-0">
                <div className="divide-y divide-[#52aaa5]/10">
                  {filterNotifications('system').map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onDelete={handleDeleteNotification}
                      onMarkAsRead={handleMarkAsRead}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="learning" className="m-0">
                <div className="divide-y divide-[#52aaa5]/10">
                  {filterNotifications('learning').map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onDelete={handleDeleteNotification}
                      onMarkAsRead={handleMarkAsRead}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="calendar" className="m-0">
                <div className="divide-y divide-[#52aaa5]/10">
                  {filterNotifications('calendar').map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onDelete={handleDeleteNotification}
                      onMarkAsRead={handleMarkAsRead}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="personal" className="m-0">
                <div className="divide-y divide-[#52aaa5]/10">
                  {filterNotifications('personal').map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onDelete={handleDeleteNotification}
                      onMarkAsRead={handleMarkAsRead}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="task" className="m-0">
                <div className="divide-y divide-[#52aaa5]/10">
                  {filterNotifications('task').map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onDelete={handleDeleteNotification}
                      onMarkAsRead={handleMarkAsRead}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* Notification Preferences Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-[#2D3748]">Cài Đặt Thông Báo</h2>
              <p className="mt-1 text-sm text-[#718096]">Tùy chỉnh cách bạn nhận thông báo</p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-[#52aaa5]" />
                  <div>
                    <p className="font-medium text-[#2D3748]">Thông báo đẩy</p>
                    <p className="text-sm text-[#718096]">Nhận thông báo trực tiếp</p>
                  </div>
                </div>
                <Switch
                  checked={notificationPrefs.pushEnabled}
                  onCheckedChange={() => handlePrefChange('pushEnabled')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Volume2 className="h-5 w-5 text-[#52aaa5]" />
                  <div>
                    <p className="font-medium text-[#2D3748]">Âm thanh</p>
                    <p className="text-sm text-[#718096]">Bật âm thanh thông báo</p>
                  </div>
                </div>
                <Switch
                  checked={notificationPrefs.soundEnabled}
                  onCheckedChange={() => handlePrefChange('soundEnabled')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-[#52aaa5]" />
                  <div>
                    <p className="font-medium text-[#2D3748]">Lịch trình</p>
                    <p className="text-sm text-[#718096]">Đặt thời gian nhận thông báo</p>
                  </div>
                </div>
                <Switch
                  checked={notificationPrefs.scheduleEnabled}
                  onCheckedChange={() => handlePrefChange('scheduleEnabled')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-[#52aaa5]" />
                  <div>
                    <p className="font-medium text-[#2D3748]">Email</p>
                    <p className="text-sm text-[#718096]">Nhận thông báo qua email</p>
                  </div>
                </div>
                <Switch
                  checked={notificationPrefs.emailEnabled}
                  onCheckedChange={() => handlePrefChange('emailEnabled')}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-[#2D3748]">Loại Thông Báo</h2>
              <p className="mt-1 text-sm text-[#718096]">Chọn loại thông báo bạn muốn nhận</p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-[#52aaa5]" />
                  <div>
                    <p className="font-medium text-[#2D3748]">Hệ thống</p>
                    <p className="text-sm text-[#718096]">Thông báo từ hệ thống</p>
                  </div>
                </div>
                <Switch
                  checked={typePrefs.system}
                  onCheckedChange={() => handleTypePrefChange('system')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-5 w-5 text-[#52aaa5]" />
                  <div>
                    <p className="font-medium text-[#2D3748]">Học tập</p>
                    <p className="text-sm text-[#718096]">Thông báo về hoạt động học tập</p>
                  </div>
                </div>
                <Switch
                  checked={typePrefs.learning}
                  onCheckedChange={() => handleTypePrefChange('learning')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-[#52aaa5]" />
                  <div>
                    <p className="font-medium text-[#2D3748]">Lịch</p>
                    <p className="text-sm text-[#718096]">Thông báo về lịch học và sự kiện</p>
                  </div>
                </div>
                <Switch
                  checked={typePrefs.calendar}
                  onCheckedChange={() => handleTypePrefChange('calendar')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-[#52aaa5]" />
                  <div>
                    <p className="font-medium text-[#2D3748]">Cá nhân</p>
                    <p className="text-sm text-[#718096]">Thông báo cá nhân</p>
                  </div>
                </div>
                <Switch
                  checked={typePrefs.personal}
                  onCheckedChange={() => handleTypePrefChange('personal')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckSquare className="h-5 w-5 text-[#52aaa5]" />
                  <div>
                    <p className="font-medium text-[#2D3748]">Nhiệm vụ</p>
                    <p className="text-sm text-[#718096]">Thông báo về nhiệm vụ</p>
                  </div>
                </div>
                <Switch
                  checked={typePrefs.task}
                  onCheckedChange={() => handleTypePrefChange('task')}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default NotificationPage
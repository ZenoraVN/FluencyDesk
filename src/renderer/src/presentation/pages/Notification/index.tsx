import { useState } from 'react'
import { Card } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import {
  Book,
  User,
  CheckSquare,
  Search,
  Filter,
} from 'lucide-react'
import NotificationItem from './components/NotificationItem'
import TaskItem from './components/TaskItem'
import { notifications, tasks } from './data/mockData'
import type { Notification } from './data/mockData'

const NotificationPage = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleDeleteNotification = (id: string) => {
    console.log('Delete notification:', id)
  }

  const handleMarkAsRead = (id: string) => {
    console.log('Mark as read:', id)
  }

  const handleTaskClick = (id: string) => {
    console.log('Task clicked:', id)
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

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
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

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Tasks */}
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-medium text-[#2D3748]">Nhiệm vụ</h2>
              <Button variant="ghost" size="sm" className="gap-2">
                <CheckSquare className="h-4 w-4" />
                Xem tất cả
              </Button>
            </div>
            <div className="space-y-4">
              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onClick={handleTaskClick}
                />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default NotificationPage
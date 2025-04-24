import { useState } from 'react'
import { Card } from '../../../../components/ui/card'
import { Switch } from '../../../../components/ui/switch'
import { Button } from '../../../../components/ui/button'
import { Bell, Clock, Trophy, BookOpen, MessageSquare, Settings2, ChevronRight } from 'lucide-react'
import { notificationSettings, learningPreferences } from '../data/mockData'
import { ReminderDialog } from './ReminderDialog'

const NotificationSection = () => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedTime, setSelectedTime] = useState(learningPreferences.studyReminders.time)
  const [selectedDays, setSelectedDays] = useState(learningPreferences.studyReminders.days)

  const handleSaveReminders = (time: string, days: string[]) => {
    setSelectedTime(time)
    setSelectedDays(days)
    // Here you would typically update this to your backend
    console.log('Saving reminder settings:', { time, days })
  }

  return (
    <Card className="overflow-hidden rounded-2xl border-[#52aaa5]/10 bg-white">
      <div className="border-b border-[#52aaa5]/10 p-6">
        <h2 className="text-base font-semibold text-[#2D3748]">Thông báo & Nhắc nhở</h2>
      </div>

      <div className="space-y-4 p-6">
        {/* Study Reminders */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#52aaa5]/10">
              <Clock className="h-5 w-5 text-[#52aaa5]" />
            </div>
            <div>
              <div className="font-medium text-[#2D3748]">Nhắc nhở học tập</div>
              <div className="text-sm text-[#718096]">Nhắc nhở bạn học tập mỗi ngày</div>
            </div>
          </div>
          <Switch checked={learningPreferences.studyReminders.enabled} />
        </div>

        {learningPreferences.studyReminders.enabled && (
          <div
            className="flex cursor-pointer items-center justify-between"
            onClick={() => setDialogOpen(true)}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#52aaa5]/10">
                <Settings2 className="h-5 w-5 text-[#52aaa5]" />
              </div>
              <div>
                <div className="font-medium text-[#2D3748]">Chỉnh sửa thời gian nhắc nhở</div>
                <div className="text-sm text-[#718096]">
                  {selectedTime} - {selectedDays.length} ngày đã chọn
                </div>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-[#718096]/50" />
          </div>
        )}

        <ReminderDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          selectedTime={selectedTime}
          selectedDays={selectedDays}
          onSave={handleSaveReminders}
        />

        {/* Other Notifications */}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#52aaa5]/10">
              <Trophy className="h-5 w-5 text-[#52aaa5]" />
            </div>
            <div>
              <div className="font-medium text-[#2D3748]">Thông báo thành tích</div>
              <div className="text-sm text-[#718096]">Khi đạt được mục tiêu học tập</div>
            </div>
          </div>
          <Switch checked={notificationSettings.achievementAlerts} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#52aaa5]/10">
              <BookOpen className="h-5 w-5 text-[#52aaa5]" />
            </div>
            <div>
              <div className="font-medium text-[#2D3748]">Báo cáo tiến độ</div>
              <div className="text-sm text-[#718096]">Nhận báo cáo học tập hàng tuần</div>
            </div>
          </div>
          <Switch checked={notificationSettings.weeklyReport} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#52aaa5]/10">
              <MessageSquare className="h-5 w-5 text-[#52aaa5]" />
            </div>
            <div>
              <div className="font-medium text-[#2D3748]">Mẹo học tập</div>
              <div className="text-sm text-[#718096]">Nhận các mẹo học tập hữu ích</div>
            </div>
          </div>
          <Switch checked={notificationSettings.studyTips} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#52aaa5]/10">
              <Bell className="h-5 w-5 text-[#52aaa5]" />
            </div>
            <div>
              <div className="font-medium text-[#2D3748]">Nội dung mới</div>
              <div className="text-sm text-[#718096]">Khi có khóa học hoặc tính năng mới</div>
            </div>
          </div>
          <Switch checked={notificationSettings.newContentAlerts} />
        </div>
      </div>
    </Card>
  )
}

export default NotificationSection
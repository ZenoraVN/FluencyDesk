import { Card } from '../../../../components/ui/card'
import { Switch } from '../../../../components/ui/switch'
import { Select } from '../../../../components/ui/select'
import { Bell, Clock, Trophy, BookOpen, MessageSquare } from 'lucide-react'
import { notificationSettings, learningPreferences } from '../data/mockData'

const NotificationSection = () => {
  const daysOfWeek = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật']

  return (
    <Card className="overflow-hidden rounded-2xl border-[#52aaa5]/10 bg-white">
      <div className="border-b border-[#52aaa5]/10 p-6">
        <h2 className="text-base font-semibold text-[#2D3748]">Thông báo & Nhắc nhở</h2>
      </div>

      {/* Study Reminders */}
      <div className="border-b border-[#52aaa5]/10 p-6">
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between">
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
            <div className="space-y-4 rounded-xl bg-[#52aaa5]/5 p-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#2D3748]">
                  Thời gian nhắc nhở
                </label>
                <Select defaultValue={learningPreferences.studyReminders.time}>
                  {Array.from({ length: 24 }).map((_, i) => (
                    <option key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                      {i.toString().padStart(2, '0')}:00
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#2D3748]">
                  Các ngày trong tuần
                </label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map((day, index) => {
                    const isSelected = learningPreferences.studyReminders.days.includes(day)
                    return (
                      <button
                        key={day}
                        className={`rounded-full px-3 py-1 text-sm transition-colors ${
                          isSelected
                            ? 'bg-[#52aaa5] text-white'
                            : 'bg-[#52aaa5]/10 text-[#52aaa5] hover:bg-[#52aaa5]/20'
                        }`}
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Other Notifications */}
      <div className="space-y-4 p-6">
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
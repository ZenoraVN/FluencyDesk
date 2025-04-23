import { Card } from '../../../components/ui/card'
import { Switch } from '../../../components/ui/switch'
import { Button } from '../../../components/ui/button'
import {
  Timer,
  Star,
  CheckCircle,
  Flame,
  ScrollText,
  Download,
  RefreshCw,
  Lock,
  Bell,
  Brain,
  Shield,
  Info,
  ChevronRight,
  WifiOff
} from 'lucide-react'

// Rest of the file remains the same, just replacing Notebook with ScrollText in the JSX
const SettingPage = () => {
  return (
    <div className="relative min-h-screen bg-[#f6f6f0] p-6">
      {/* Decorative Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#52aaa5]/5" />
        <div className="absolute -left-20 bottom-1/4 h-80 w-80 rounded-full bg-[#52aaa5]/7" />
        <div className="absolute right-1/4 top-1/4 h-72 w-72 rounded-3xl bg-[#52aaa5]/4 transform rotate-45" />
      </div>

      <div className="relative mx-auto max-w-4xl space-y-6">
        <h1 className="text-2xl font-semibold text-[#2D3748]">Settings</h1>

        {/* Learning Progress */}
        <Card className="overflow-hidden rounded-2xl border-[#52aaa5]/10 bg-white p-6">
          <h2 className="mb-5 text-base font-semibold text-[#2D3748]">Tiến độ học tập</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl bg-[#FF7F50]/5 p-5">
              <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-xl bg-[#FF7F50]/10">
                <Flame className="h-5 w-5 text-[#FF7F50]" />
              </div>
              <div className="text-center">
                <div className="mb-1 text-2xl font-semibold text-[#FF7F50]">
                  7 <span className="text-xs opacity-80">ngày</span>
                </div>
                <div className="text-xs text-[#718096]">Chuỗi Học Tập</div>
              </div>
            </div>

            <div className="rounded-2xl bg-[#52aaa5]/5 p-5">
              <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-xl bg-[#52aaa5]/10">
                <Timer className="h-5 w-5 text-[#52aaa5]" />
              </div>
              <div className="text-center">
                <div className="mb-1 text-2xl font-semibold text-[#52aaa5]">
                  2.5 <span className="text-xs opacity-80">giờ</span>
                </div>
                <div className="text-xs text-[#718096]">Thời gian học</div>
              </div>
            </div>

            <div className="rounded-2xl bg-[#22C55E]/5 p-5">
              <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-xl bg-[#22C55E]/10">
                <CheckCircle className="h-5 w-5 text-[#22C55E]" />
              </div>
              <div className="text-center">
                <div className="mb-1 text-2xl font-semibold text-[#22C55E]">
                  12 <span className="text-xs opacity-80">bài học</span>
                </div>
                <div className="text-xs text-[#718096]">Hoàn thành</div>
              </div>
            </div>

            <div className="rounded-2xl bg-[#EAB308]/5 p-5">
              <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-xl bg-[#EAB308]/10">
                <Star className="h-5 w-5 text-[#EAB308]" />
              </div>
              <div className="text-center">
                <div className="mb-1 text-2xl font-semibold text-[#EAB308]">
                  85 <span className="text-xs opacity-80">%</span>
                </div>
                <div className="text-xs text-[#718096]">Điểm trung bình</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Learning Storage */}
        <Card className="overflow-hidden rounded-2xl border-[#52aaa5]/10 bg-white p-6">
          <h2 className="mb-5 text-base font-semibold text-[#2D3748]">Lưu trữ</h2>
          <div className="space-y-4 divide-y divide-[#52aaa5]/5">
            <div className="flex cursor-pointer items-center gap-4 py-3 transition-colors hover:bg-[#52aaa5]/5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#52aaa5]/10">
                <ScrollText className="h-5 w-5 text-[#52aaa5]" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-[#2D3748]">Ghi chú của tôi</div>
                <div className="text-sm text-[#718096]">Quản lý tất cả ghi chú học tập của bạn</div>
              </div>
              <ChevronRight className="h-5 w-5 text-[#718096]/50" />
            </div>

            <div className="flex cursor-pointer items-center gap-4 py-3 transition-colors hover:bg-[#52aaa5]/5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#52aaa5]/10">
                <Download className="h-5 w-5 text-[#52aaa5]" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-[#2D3748]">Khóa học ngoại tuyến</div>
                <div className="text-sm text-[#718096]">Truy cập các khóa học đã tải xuống của bạn</div>
              </div>
              <ChevronRight className="h-5 w-5 text-[#718096]/50" />
            </div>

            <div className="flex cursor-pointer items-center gap-4 py-3 transition-colors hover:bg-[#52aaa5]/5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#52aaa5]/10">
                <RefreshCw className="h-5 w-5 text-[#52aaa5]" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-[#2D3748]">Đồng bộ hóa tài khoản</div>
                <div className="text-sm text-[#718096]">Sao lưu và khôi phục dữ liệu học tập</div>
              </div>
              <ChevronRight className="h-5 w-5 text-[#718096]/50" />
            </div>
          </div>
        </Card>

        {/* Account Security */}
        <Card className="overflow-hidden rounded-2xl border-[#52aaa5]/10 bg-white p-6">
          <h2 className="mb-5 text-base font-semibold text-[#2D3748]">Bảo mật tài khoản</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#52aaa5]/10">
                  <Lock className="h-5 w-5 text-[#52aaa5]" />
                </div>
                <div>
                  <div className="font-medium text-[#2D3748]">Xác thực hai yếu tố</div>
                  <div className="text-sm text-[#718096]">Bảo vệ tài khoản của bạn</div>
                </div>
              </div>
              <Switch />
            </div>
            <Button variant="outline" className="w-full border-[#52aaa5] text-[#52aaa5] hover:bg-[#52aaa5]/10">
              Đổi mật khẩu
            </Button>
          </div>
        </Card>

        {/* Personalized Learning */}
        <Card className="overflow-hidden rounded-2xl border-[#52aaa5]/10 bg-white p-6">
          <h2 className="mb-5 text-base font-semibold text-[#2D3748]">Cá nhân hóa học tập</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#52aaa5]/10">
                <Brain className="h-5 w-5 text-[#52aaa5]" />
              </div>
              <div className="flex-1">
                <div className="mb-2 font-medium text-[#2D3748]">Trình độ học tập</div>
                <select className="w-full rounded-xl border border-[#52aaa5]/20 bg-white px-3 py-2 text-[#2D3748]">
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="overflow-hidden rounded-2xl border-[#52aaa5]/10 bg-white p-6">
          <h2 className="mb-5 text-base font-semibold text-[#2D3748]">Thông báo & Nhắc nhở</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#52aaa5]/10">
                  <Bell className="h-5 w-5 text-[#52aaa5]" />
                </div>
                <div>
                  <div className="font-medium text-[#2D3748]">Nhắc nhở hàng ngày</div>
                  <div className="text-sm text-[#718096]">Nhận thông báo về mục tiêu học tập</div>
                </div>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#52aaa5]/10">
                  <Bell className="h-5 w-5 text-[#52aaa5]" />
                </div>
                <div>
                  <div className="font-medium text-[#2D3748]">Báo cáo tiến độ hàng tuần</div>
                  <div className="text-sm text-[#718096]">Nhận tổng kết học tập hàng tuần</div>
                </div>
              </div>
              <Switch />
            </div>
          </div>
        </Card>

        {/* Privacy & Security */}
        <Card className="overflow-hidden rounded-2xl border-[#52aaa5]/10 bg-white p-6">
          <h2 className="mb-5 text-base font-semibold text-[#2D3748]">Quyền riêng tư & Bảo mật</h2>
          <div className="space-y-4 divide-y divide-[#52aaa5]/5">
            <div className="flex cursor-pointer items-center gap-4 py-3 transition-colors hover:bg-[#52aaa5]/5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#52aaa5]/10">
                <Shield className="h-5 w-5 text-[#52aaa5]" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-[#2D3748]">Chính sách quyền riêng tư</div>
                <div className="text-sm text-[#718096]">Đọc chính sách quyền riêng tư của chúng tôi</div>
              </div>
              <ChevronRight className="h-5 w-5 text-[#718096]/50" />
            </div>

            <div className="flex cursor-pointer items-center gap-4 py-3 transition-colors hover:bg-[#52aaa5]/5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#52aaa5]/10">
                <Shield className="h-5 w-5 text-[#52aaa5]" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-[#2D3748]">Điều khoản dịch vụ</div>
                <div className="text-sm text-[#718096]">Đọc điều khoản dịch vụ của chúng tôi</div>
              </div>
              <ChevronRight className="h-5 w-5 text-[#718096]/50" />
            </div>
          </div>
        </Card>

        {/* About */}
        <Card className="overflow-hidden rounded-2xl border-[#52aaa5]/10 bg-white p-6">
          <h2 className="mb-5 text-base font-semibold text-[#2D3748]">Thông tin</h2>
          <div className="space-y-4 divide-y divide-[#52aaa5]/5">
            <div className="flex items-center gap-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#52aaa5]/10">
                <Info className="h-5 w-5 text-[#52aaa5]" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-[#2D3748]">Phiên bản</div>
                <div className="text-sm text-[#718096]">1.0.3</div>
              </div>
            </div>

            <div className="flex cursor-pointer items-center gap-4 py-3 transition-colors hover:bg-[#52aaa5]/5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#52aaa5]/10">
                <RefreshCw className="h-5 w-5 text-[#52aaa5]" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-[#2D3748]">Kiểm tra cập nhật</div>
                <div className="text-sm text-[#718096]">Đã kiểm tra: Hôm nay</div>
              </div>
              <ChevronRight className="h-5 w-5 text-[#718096]/50" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default SettingPage
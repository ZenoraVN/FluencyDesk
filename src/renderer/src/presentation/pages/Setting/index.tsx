import StorageSection from './components/StorageSection'
import SecuritySection from './components/SecuritySection'
import NotificationSection from './components/NotificationSection'
import AccessibilitySection from './components/AccessibilitySection'
import { Info, RefreshCw } from 'lucide-react'
import { Card } from '../../../components/ui/card'
import { appInfo } from './data/mockData'

const SettingPage = () => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'long'
    })
  }

  return (
    <div className="relative min-h-screen bg-[#f6f6f0] p-6">
      {/* Decorative Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#52aaa5]/5" />
        <div className="absolute -left-20 bottom-1/4 h-80 w-80 rounded-full bg-[#52aaa5]/7" />
        <div className="absolute right-1/4 top-1/4 h-72 w-72 rounded-3xl bg-[#52aaa5]/4 transform rotate-45" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-[#2D3748]">Cài đặt</h1>
          <div className="flex items-center gap-2 rounded-xl bg-[#52aaa5]/10 px-4 py-2 text-sm text-[#52aaa5]">
            <Info className="h-4 w-4" />
            <span>Phiên bản {appInfo.version}</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-8 lg:col-span-2">
            <StorageSection />
            <SecuritySection />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <NotificationSection />
            <AccessibilitySection />

            {/* App Info */}
            <Card className="overflow-hidden rounded-2xl border-[#52aaa5]/10 bg-white">
              <div className="border-b border-[#52aaa5]/10 p-6">
                <h2 className="text-base font-semibold text-[#2D3748]">Thông tin ứng dụng</h2>
              </div>
              <div className="space-y-4 divide-y divide-[#52aaa5]/5 p-6">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-[#718096]">Phiên bản</span>
                  <span className="font-medium text-[#2D3748]">{appInfo.version}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-[#718096]">Cập nhật gần nhất</span>
                  <span className="font-medium text-[#2D3748]">
                    {formatDate(appInfo.lastUpdate)}
                  </span>
                </div>
                <div className="flex cursor-pointer items-center gap-4 py-3 transition-colors hover:bg-[#52aaa5]/5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#52aaa5]/10">
                    <RefreshCw className="h-5 w-5 text-[#52aaa5]" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-[#2D3748]">Kiểm tra cập nhật</div>
                    <div className="text-sm text-[#718096]">
                      Đã kiểm tra: {formatDate(appInfo.lastUpdateCheck)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Release Notes */}
              {appInfo.releaseNotes.length > 0 && (
                <div className="border-t border-[#52aaa5]/10 p-6">
                  <h3 className="mb-4 text-sm font-medium text-[#2D3748]">
                    Thay đổi trong phiên bản {appInfo.releaseNotes[0].version}
                  </h3>
                  <ul className="space-y-2 text-sm text-[#718096]">
                    {appInfo.releaseNotes[0].changes.map((change, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-[#52aaa5]" />
                        {change}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingPage
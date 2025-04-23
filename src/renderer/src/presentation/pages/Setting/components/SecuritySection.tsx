import { Card } from '../../../../components/ui/card'
import { Switch } from '../../../../components/ui/switch'
import { Button } from '../../../../components/ui/button'
import { Lock, Shield, ChevronRight, Smartphone, AlertCircle } from 'lucide-react'
import { securitySettings } from '../data/mockData'

const SecuritySection = () => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Card className="overflow-hidden rounded-2xl border-[#52aaa5]/10 bg-white">
      <div className="border-b border-[#52aaa5]/10 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#2D3748]">Bảo mật tài khoản</h2>
          {securitySettings.twoFactorEnabled && (
            <div className="rounded-full bg-green-100 px-3 py-1">
              <span className="text-xs font-medium text-green-600">Đã bảo vệ</span>
            </div>
          )}
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="border-b border-[#52aaa5]/10 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#52aaa5]/10">
              <Lock className="h-5 w-5 text-[#52aaa5]" />
            </div>
            <div>
              <div className="font-medium text-[#2D3748]">Xác thực hai yếu tố</div>
              <div className="text-sm text-[#718096]">Bảo vệ tài khoản của bạn</div>
            </div>
          </div>
          <Switch checked={securitySettings.twoFactorEnabled} />
        </div>

        <Button 
          variant="outline" 
          className="w-full border-[#52aaa5] text-[#52aaa5] hover:bg-[#52aaa5]/10"
        >
          Đổi mật khẩu
        </Button>
        <p className="mt-2 text-center text-xs text-[#718096]">
          Đã thay đổi {formatDate(securitySettings.lastPasswordChange)}
        </p>
      </div>

      {/* Login History */}
      <div className="space-y-4 p-6">
        <h3 className="text-sm font-medium text-[#2D3748]">Lịch sử đăng nhập gần đây</h3>
        <div className="space-y-4">
          {securitySettings.loginHistory.map((login) => (
            <div 
              key={login.id}
              className="flex items-center justify-between rounded-xl bg-[#52aaa5]/5 p-4"
            >
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-[#52aaa5]" />
                <div>
                  <div className="font-medium text-[#2D3748]">{login.device}</div>
                  <div className="text-sm text-[#718096]">{login.location}</div>
                </div>
              </div>
              <div className="text-right text-sm text-[#718096]">
                {formatDate(login.timestamp)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy & Security Links */}
      <div className="space-y-4 divide-y divide-[#52aaa5]/5 p-6">
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
            <AlertCircle className="h-5 w-5 text-[#52aaa5]" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-[#2D3748]">Báo cáo vấn đề bảo mật</div>
            <div className="text-sm text-[#718096]">Thông báo cho chúng tôi về các vấn đề bảo mật</div>
          </div>
          <ChevronRight className="h-5 w-5 text-[#718096]/50" />
        </div>
      </div>
    </Card>
  )
}

export default SecuritySection
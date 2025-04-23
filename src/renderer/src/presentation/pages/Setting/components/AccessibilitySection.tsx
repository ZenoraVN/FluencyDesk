import { Card } from '../../../../components/ui/card'
import { Switch } from '../../../../components/ui/switch'
import { Select } from '../../../../components/ui/select'
import { Eye, Volume2, Monitor, Type, Subtitles } from 'lucide-react'
import { accessibilitySettings } from '../data/mockData'

const AccessibilitySection = () => {
  return (
    <Card className="overflow-hidden rounded-2xl border-[#52aaa5]/10 bg-white">
      <div className="border-b border-[#52aaa5]/10 p-6">
        <h2 className="text-base font-semibold text-[#2D3748]">Tùy chỉnh hiển thị</h2>
      </div>

      {/* Font Size */}
      <div className="border-b border-[#52aaa5]/10 p-6">
        <div className="mb-4 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#52aaa5]/10">
            <Type className="h-5 w-5 text-[#52aaa5]" />
          </div>
          <div>
            <div className="font-medium text-[#2D3748]">Cỡ chữ</div>
            <div className="text-sm text-[#718096]">Điều chỉnh kích thước văn bản</div>
          </div>
        </div>
        <Select defaultValue={accessibilitySettings.fontSize}>
          <option value="small">Nhỏ</option>
          <option value="medium">Vừa</option>
          <option value="large">Lớn</option>
          <option value="x-large">Rất lớn</option>
        </Select>
      </div>

      {/* Display Settings */}
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#52aaa5]/10">
              <Eye className="h-5 w-5 text-[#52aaa5]" />
            </div>
            <div>
              <div className="font-medium text-[#2D3748]">Độ tương phản cao</div>
              <div className="text-sm text-[#718096]">Tăng độ tương phản cho văn bản</div>
            </div>
          </div>
          <Switch checked={accessibilitySettings.highContrast} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#52aaa5]/10">
              <Monitor className="h-5 w-5 text-[#52aaa5]" />
            </div>
            <div>
              <div className="font-medium text-[#2D3748]">Giảm chuyển động</div>
              <div className="text-sm text-[#718096]">Giảm thiểu hiệu ứng chuyển động</div>
            </div>
          </div>
          <Switch checked={accessibilitySettings.reducedMotion} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#52aaa5]/10">
              <Volume2 className="h-5 w-5 text-[#52aaa5]" />
            </div>
            <div>
              <div className="font-medium text-[#2D3748]">Tự động phát âm thanh</div>
              <div className="text-sm text-[#718096]">Tự động phát âm thanh khi học</div>
            </div>
          </div>
          <Switch checked={accessibilitySettings.autoPlay} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#52aaa5]/10">
              <Subtitles className="h-5 w-5 text-[#52aaa5]" />
            </div>
            <div>
              <div className="font-medium text-[#2D3748]">Phụ đề</div>
              <div className="text-sm text-[#718096]">Hiển thị phụ đề trong video</div>
            </div>
          </div>
          <Switch checked={accessibilitySettings.subtitles} />
        </div>

        {/* Preview Text */}
        <div className="mt-8 rounded-xl bg-[#52aaa5]/5 p-4">
          <h3 className="mb-2 text-sm font-medium text-[#2D3748]">Xem trước văn bản</h3>
          <p className="text-[#718096]">
            Đây là ví dụ về cách văn bản sẽ hiển thị với các cài đặt hiện tại của bạn. 
            Điều chỉnh các tùy chọn trên để tìm cấu hình phù hợp nhất với bạn.
          </p>
        </div>
      </div>
    </Card>
  )
}

export default AccessibilitySection
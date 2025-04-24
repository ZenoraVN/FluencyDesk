import { useNavigate } from 'react-router-dom'
import { Card } from '../../../../components/ui/card'
import { Progress } from '../../../../components/ui/progress'
import { Button } from '../../../../components/ui/button'
import { ScrollText, Download, RefreshCw, ChevronRight, HardDrive } from 'lucide-react'
import { storageInfo, dataUsage } from '../data/mockData'

const StorageSection = () => {
  const navigate = useNavigate()
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatSize = (size: number) => {
    if (size < 1024) return `${size} MB`
    return `${(size / 1024).toFixed(1)} GB`
  }

  const storageUsagePercent = (storageInfo.offlineStorage.used / storageInfo.offlineStorage.total) * 100

  return (
    <Card className="overflow-hidden rounded-2xl border-[#52aaa5]/10 bg-white">
      <div className="border-b border-[#52aaa5]/10 p-6">
        <h2 className="text-base font-semibold text-[#2D3748]">Lưu trữ & Dữ liệu</h2>
      </div>

      {/* Storage Overview */}
      <div className="border-b border-[#52aaa5]/10 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-[#52aaa5]" />
            <span className="font-medium text-[#2D3748]">Dung lượng ngoại tuyến</span>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="border-[#52aaa5] text-[#52aaa5] hover:bg-[#52aaa5]/10"
          >
            Quản lý
          </Button>
        </div>

        <div className="mb-2">
          <Progress value={storageUsagePercent} className="h-2" />
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-[#718096]">
            {formatSize(storageInfo.offlineStorage.used)} / {formatSize(storageInfo.offlineStorage.total)}
          </span>
          <span className="text-[#52aaa5]">{Math.round(storageUsagePercent)}% đã sử dụng</span>
        </div>
      </div>

      {/* Data Usage */}
      <div className="border-b border-[#52aaa5]/10 p-6">
        <h3 className="mb-4 text-sm font-medium text-[#2D3748]">Sử dụng dữ liệu tháng này</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-[#52aaa5]/5 p-4">
            <div className="mb-2 text-sm text-[#718096]">Tải xuống</div>
            <div className="text-xl font-semibold text-[#52aaa5]">
              {formatSize(dataUsage.thisMonth.download)}
            </div>
          </div>
          <div className="rounded-xl bg-[#52aaa5]/5 p-4">
            <div className="mb-2 text-sm text-[#718096]">Tải lên</div>
            <div className="text-xl font-semibold text-[#52aaa5]">
              {formatSize(dataUsage.thisMonth.upload)}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4 divide-y divide-[#52aaa5]/5 p-6">
        <div className="flex cursor-pointer items-center gap-4 py-3 transition-colors hover:bg-[#52aaa5]/5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#52aaa5]/10">
            <ScrollText className="h-5 w-5 text-[#52aaa5]" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-[#2D3748]">Ghi chú của tôi</div>
            <div className="text-sm text-[#718096]">{storageInfo.totalNotes} ghi chú</div>
          </div>
          <ChevronRight className="h-5 w-5 text-[#718096]/50" />
        </div>

        <div className="flex cursor-pointer items-center gap-4 py-3 transition-colors hover:bg-[#52aaa5]/5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#52aaa5]/10">
            <Download className="h-5 w-5 text-[#52aaa5]" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-[#2D3748]">Khóa học ngoại tuyến</div>
            <div className="text-sm text-[#718096]">{storageInfo.downloadedCourses} khóa học</div>
          </div>
          <ChevronRight className="h-5 w-5 text-[#718096]/50" />
        </div>

        <div
          className="flex cursor-pointer items-center gap-4 py-3 transition-colors hover:bg-[#52aaa5]/5"
          onClick={() => navigate('/sync')}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#52aaa5]/10">
            <RefreshCw className="h-5 w-5 text-[#52aaa5]" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-[#2D3748]">Đồng bộ hóa</div>
            <div className="text-sm text-[#718096]">
              Lần cuối: {formatDate(storageInfo.lastSync)}
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-[#718096]/50" />
        </div>
      </div>
    </Card>
  )
}

export default StorageSection
import { useState } from 'react'
import { Card } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import {
  BarChart3,
  Calendar,
  Clock,
  Database,
  Download,
  HardDrive,
  History,
  Laptop,
  Smartphone,
  MoreVertical,
  RefreshCw,
  Trash2,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu'
import { syncVersions, syncStats, type SyncVersion } from './data/mockData'

const SyncPage = () => {
  const [isLoading, setIsLoading] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const handleSync = async (version?: string) => {
    setIsLoading(true)
    // Simulate sync delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

  const handleDelete = async (version: string) => {
    // Implement delete logic
    console.log('Delete version:', version)
  }

  return (
    <div className="min-h-screen bg-[#f6f6f0] p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#2D3748]">Đồng bộ hóa</h1>
        <p className="mt-2 text-[#718096]">
          Quản lý và đồng bộ hóa dữ liệu của bạn
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Sync Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-[#52aaa5]/10 p-3">
                  <Clock className="h-6 w-6 text-[#52aaa5]" />
                </div>
                <div>
                  <p className="text-sm text-[#718096]">Lần đồng bộ gần nhất</p>
                  <p className="mt-1 font-semibold text-[#2D3748]">
                    {formatDate(syncStats.lastSync)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-[#52aaa5]/10 p-3">
                  <Database className="h-6 w-6 text-[#52aaa5]" />
                </div>
                <div>
                  <p className="text-sm text-[#718096]">Dữ liệu đã đồng bộ</p>
                  <p className="mt-1 font-semibold text-[#2D3748]">
                    {formatFileSize(syncStats.totalDataSynced)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-[#52aaa5]/10 p-3">
                  <BarChart3 className="h-6 w-6 text-[#52aaa5]" />
                </div>
                <div>
                  <p className="text-sm text-[#718096]">Tỷ lệ thành công</p>
                  <p className="mt-1 font-semibold text-[#2D3748]">
                    {syncStats.successRate}%
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Sync History */}
          <Card>
            <div className="border-b border-[#52aaa5]/10 p-6">
              <h2 className="text-lg font-medium text-[#2D3748]">Lịch sử đồng bộ</h2>
              <p className="mt-1 text-sm text-[#718096]">
                Quản lý các phiên bản đồng bộ của bạn
              </p>
            </div>

            <div className="divide-y divide-[#52aaa5]/10">
              {syncVersions.map((version) => (
                <div
                  key={version.version}
                  className="flex items-center justify-between p-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-xl bg-[#52aaa5]/10 p-3">
                      {version.device === 'Desktop App' ? (
                        <Laptop className="h-5 w-5 text-[#52aaa5]" />
                      ) : (
                        <Smartphone className="h-5 w-5 text-[#52aaa5]" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-[#2D3748]">
                          {version.version}
                        </p>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs ${
                            version.status === 'success'
                              ? 'bg-green-100 text-green-700'
                              : version.status === 'failed'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {version.status === 'success'
                            ? 'Thành công'
                            : version.status === 'failed'
                            ? 'Thất bại'
                            : 'Đang xử lý'}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-sm text-[#718096]">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(version.created_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <HardDrive className="h-4 w-4" />
                          {formatFileSize(version.size)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleSync(version.version)}
                        className="gap-2"
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span>Đồng bộ từ phiên bản này</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(version.version)}
                        className="gap-2 text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Xóa phiên bản này</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Sync Info */}
          <Card className="p-6">
            <h2 className="text-lg font-medium text-[#2D3748]">Thông tin đồng bộ</h2>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#718096]">Tổng số lần đồng bộ</span>
                <span className="font-medium text-[#2D3748]">{syncStats.totalSyncs}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#718096]">Đồng bộ tự động</span>
                <span className="font-medium text-[#2D3748]">{syncStats.autoSyncs}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#718096]">Đồng bộ thủ công</span>
                <span className="font-medium text-[#2D3748]">{syncStats.manualSyncs}</span>
              </div>
            </div>
          </Card>

          {/* Download Info */}
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#52aaa5]/10 p-3">
                <Download className="h-5 w-5 text-[#52aaa5]" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-[#2D3748]">Tải xuống</h2>
                <p className="mt-1 text-sm text-[#718096]">
                  Tải xuống dữ liệu đã đồng bộ
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => handleSync()}
              >
                <History className="h-4 w-4" />
                Tải xuống phiên bản gần nhất
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default SyncPage
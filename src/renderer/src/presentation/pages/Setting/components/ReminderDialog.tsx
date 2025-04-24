import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../../components/ui/dialog'
import { Button } from '../../../../components/ui/button'
import { ScrollArea } from '../../../../components/ui/scroll-area'
import { cn } from '../../../../shared/utils/cn'

interface ReminderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedTime: string
  selectedDays: string[]
  onSave: (time: string, days: string[]) => void
}

export function ReminderDialog({
  open,
  onOpenChange,
  selectedTime,
  selectedDays,
  onSave,
}: ReminderDialogProps) {
  const [tempTime, setTempTime] = useState(selectedTime)
  const [tempDays, setTempDays] = useState(selectedDays)

  const daysOfWeek = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật']
  const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`)

  const handleSave = () => {
    onSave(tempTime, tempDays)
    onOpenChange(false)
  }

  const toggleDay = (day: string) => {
    setTempDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa thời gian nhắc nhở</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div>
            <h4 className="mb-4 text-sm font-medium text-[#2D3748]">Thời gian</h4>
            <ScrollArea className="h-[200px] rounded-md border border-[#52aaa5]/10">
              <div className="p-4">
                {hours.map(hour => (
                  <div
                    key={hour}
                    className={cn(
                      'cursor-pointer rounded-lg px-4 py-2 transition-colors',
                      tempTime === hour
                        ? 'bg-[#52aaa5] text-white'
                        : 'hover:bg-[#52aaa5]/10'
                    )}
                    onClick={() => setTempTime(hour)}
                  >
                    {hour}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-medium text-[#2D3748]">Các ngày trong tuần</h4>
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map(day => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={cn(
                    'rounded-full px-3 py-1 text-sm transition-colors',
                    tempDays.includes(day)
                      ? 'bg-[#52aaa5] text-white'
                      : 'bg-[#52aaa5]/10 text-[#52aaa5] hover:bg-[#52aaa5]/20'
                  )}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Hủy
          </Button>
          <Button onClick={handleSave}>
            Lưu thay đổi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
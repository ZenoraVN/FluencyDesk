import { FC, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '../../../../..//components/ui/form'
import { Button } from '../../../../..//components/ui/button'
import { Plus, Minus } from 'lucide-react'
import { RichtextchtEditor } from '../../../../..//components/Input/CustomRichtext'

// Type definitions
export interface OpenParagraphFormData {
  open_paragraph: {
    example_paragraph: string
    mean_example_paragraph: string
    tips?: string[]
  }
}
interface OpenParagraphFormProps {
  initialData?: OpenParagraphFormData
}

export const OpenParagraphForm: FC<OpenParagraphFormProps> = ({ initialData }) => {
  const form = useFormContext<OpenParagraphFormData>()
  const [tips, setTips] = useState<string[]>(initialData?.open_paragraph?.tips || [])

  const addTip = () => {
    const newTips = [...tips, '']
    setTips(newTips)
    form.setValue('open_paragraph.tips', newTips)
  }

  const removeTip = (index: number) => {
    const newTips = tips.filter((_, i) => i !== index)
    setTips(newTips)
    form.setValue('open_paragraph.tips', newTips)
  }

  const updateTip = (index: number, value: string) => {
    const newTips = [...tips]
    newTips[index] = value
    setTips(newTips)
    form.setValue('open_paragraph.tips', newTips)
  }

  return (
    <Form {...form}>
      <div className="space-y-6">
        {/* Example Paragraph */}
        <div className="rounded-lg">
          <FormField
            control={form.control}
            name="open_paragraph.example_paragraph"
            rules={{
              required: 'Vui lòng nhập đoạn văn mẫu',
              validate: (v?: string) =>
                v?.replace(/<[^>]*>/g, '').trim() ? true : 'Vui lòng nhập đoạn văn mẫu'
            }}
            render={({ field, fieldState: { error } }) => (
              <FormItem>
                <FormLabel className="text-[#2D3748] font-medium">Đoạn văn mẫu</FormLabel>
                <FormControl>
                  <RichtextchtEditor
                    value={field.value || ''}
                    onChange={field.onChange}
                    placeholder="Nhập đoạn văn mẫu bằng tiếng Anh..."
                    className="hover:border-[#52aaaf]"
                  />
                </FormControl>
                {error && <div className="text-sm text-red-500 mt-1">{error.message}</div>}
              </FormItem>
            )}
          />
        </div>

        {/* Mean Example Paragraph */}
        <div className="rounded-lg ">
          <FormField
            control={form.control}
            name="open_paragraph.mean_example_paragraph"
            rules={{
              required: 'Vui lòng nhập nghĩa đoạn văn mẫu',
              validate: (v?: string) =>
                v?.replace(/<[^>]*>/g, '').trim() ? true : 'Vui lòng nhập nghĩa đoạn văn mẫu'
            }}
            render={({ field, fieldState: { error } }) => (
              <FormItem>
                <FormLabel className="text-[#2D3748] font-medium">Nghĩa đoạn văn mẫu</FormLabel>
                <FormControl>
                  <RichtextchtEditor
                    value={field.value || ''}
                    onChange={field.onChange}
                    placeholder="Nhập nghĩa tiếng Việt của đoạn văn mẫu..."
                    className="hover:border-[#52aaaf]"
                  />
                </FormControl>
                {error && <div className="text-sm text-red-500 mt-1">{error.message}</div>}
              </FormItem>
            )}
          />
        </div>

        {/* Tips Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-gray-200">
            <h4 className="text-sm font-medium text-[#2D3748]">Mẹo viết (không bắt buộc)</h4>
            <Button
              type="button"
              onClick={addTip}
              className="flex items-center gap-2 px-4 py-1.5 text-sm bg-[#52aaa5]/10 text-[#52aaa5] hover:bg-[#52aaa5]/20 rounded-lg"
            >
              <Plus className="h-4 w-4" />
              Thêm mẹo
            </Button>
          </div>
          <div className="flex flex-col gap-4">
            {tips.map((tip, index) => (
              <div key={index} className="relative rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h5 className="text-sm font-medium text-[#2D3748]">Mẹo {index + 1}</h5>
                  <Button
                    type="button"
                    onClick={() => removeTip(index)}
                    className="flex items-center gap-2 px-3 h-[34px] text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded-lg"
                  >
                    <Minus className="h-4 w-4" /> Xóa
                  </Button>
                </div>
                <RichtextchtEditor
                  value={tip}
                  onChange={(val) => updateTip(index, val)}
                  placeholder={`Nhập mẹo viết ${index + 1}...`}
                  className="hover:border-[#52aaaf]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Form>
  )
}

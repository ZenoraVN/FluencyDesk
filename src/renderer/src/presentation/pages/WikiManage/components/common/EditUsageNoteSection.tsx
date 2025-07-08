import { useState, useMemo } from 'react'
import { RichtextView } from '../../../../../componentscommon/RichtextView'
import { RichtextchtEditor } from '../../../../../componentsInput/CustomRichtext'
import { Button } from '../../../../components/ui/button'
import { Plus, Minus, Pencil, Check, X, Loader2 } from 'lucide-react'

interface UsageNoteSectionProps {
  usageNoteInput: string
  setUsageNoteInput: (val: string) => void
  usageNotes: string[]
  setUsageNotes: (notes: string[]) => void
  title?: string
  onSaveNotes?: (notes: string[]) => Promise<void> // <-- bổ sung prop này!
}

export function EditUsageNoteSection({
  usageNoteInput,
  setUsageNoteInput,
  usageNotes,
  setUsageNotes,
  title = 'Ghi chú sử dụng',
  onSaveNotes
}: UsageNoteSectionProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [editingIdx, setEditingIdx] = useState<number | null>(null)
  const [editContent, setEditContent] = useState<string>('')
  const [unsavedNotes, setUnsavedNotes] = useState<string[] | null>(null)

  const notes = useMemo(
    () => (unsavedNotes !== null ? unsavedNotes : usageNotes),
    [unsavedNotes, usageNotes]
  )

  const handleEditNote = (idx: number) => {
    setEditingIdx(idx)
    setEditContent(notes[idx])
  }

  const handleCancelEdit = () => {
    setEditingIdx(null)
    setEditContent('')
  }

  const handleSaveEdit = () => {
    if (editingIdx === null) return
    const updated = [...notes]
    updated[editingIdx] = editContent
    setUnsavedNotes(updated)
    setEditingIdx(null)
    setEditContent('')
  }

  const handleAddUsageNote = () => {
    if (usageNoteInput.trim()) {
      setUnsavedNotes([...(unsavedNotes ?? usageNotes), usageNoteInput])
      setUsageNoteInput('')
    }
  }

  const handleRemoveUsageNote = (index: number) => {
    const updated = [...notes]
    updated.splice(index, 1)
    setUnsavedNotes(updated)
    if (editingIdx === index) handleCancelEdit()
  }

  const handleSaveAll = async () => {
    if (unsavedNotes !== null) {
      setIsSaving(true)
      try {
        if (onSaveNotes) await onSaveNotes(unsavedNotes)
        setUsageNotes(unsavedNotes)
        setUnsavedNotes(null)
        setEditingIdx(null)
      } finally {
        setIsSaving(false)
      }
    }
  }

  const handleResetAll = () => {
    setUnsavedNotes(null)
    setEditingIdx(null)
    setEditContent('')
    setUsageNoteInput('')
  }

  const hasChanges =
    unsavedNotes !== null &&
    (unsavedNotes.length !== usageNotes.length || unsavedNotes.some((u, i) => u !== usageNotes[i]))

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-2">
        <h3 className="text-[#2D3748] font-medium">{title}</h3>
        <div className="flex gap-2">
          {hasChanges && (
            <>
              <Button
                onClick={handleSaveAll}
                variant="outline"
                size="sm"
                className="flex items-center border bg-green-50 text-green-700 hover:bg-green-100"
                type="button"
                disabled={isSaving}
              >
                {isSaving && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
                <Check className="h-4 w-4 mr-2" /> Lưu thay đổi
              </Button>
              <Button
                onClick={handleResetAll}
                variant="ghost"
                size="sm"
                className="flex items-center border bg-gray-100 text-gray-600 hover:bg-gray-200"
                type="button"
              >
                <X className="h-4 w-4 mr-2" /> Xóa thay đổi
              </Button>
            </>
          )}
          <Button
            onClick={handleAddUsageNote}
            variant="outline"
            size="sm"
            className="bg-[#52aaa5]/10 text-[#52aaa5] hover:bg-[#52aaa5]/20"
            type="button"
            disabled={!usageNoteInput.trim()}
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm ghi chú
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        <RichtextchtEditor
          value={usageNoteInput}
          onChange={setUsageNoteInput}
          className="hover:border-[#52aaa5]"
        />
        {notes.length === 0 && <div className="text-gray-400 px-1">Chưa có ghi chú nào</div>}
        {notes.map((note, index) => (
          <div
            key={index}
            className="group relative rounded-lg border border-[#52aaa5]/10 p-4 hover:outline hover:outline-[#52aaa5] hover:outline-1 transition-all"
          >
            {editingIdx === index ? (
              <div>
                <RichtextchtEditor value={editContent} onChange={setEditContent} className="mb-2" />
                <div className="flex gap-2 mt-2">
                  <Button
                    onClick={handleSaveEdit}
                    variant="outline"
                    size="sm"
                    className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                    type="button"
                  >
                    <Check className="h-4 w-4 mr-1" /> Lưu
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    variant="ghost"
                    size="sm"
                    className="bg-gray-50 text-gray-600 hover:bg-gray-200"
                    type="button"
                  >
                    <X className="h-4 w-4 mr-1" /> Hủy
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <RichtextView content={note} className="text-[#2D3748]" />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1 transition pointer-events-auto">
                  <Button
                    onClick={() => handleEditNote(index)}
                    variant="ghost"
                    size="sm"
                    className="text-white bg-blue-500 focus:bg-blue-600 transition-colors duration-150"
                    type="button"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => handleRemoveUsageNote(index)}
                    variant="ghost"
                    size="sm"
                    className="text-white bg-red-500 focus:bg-red-600 transition-colors duration-150"
                    type="button"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

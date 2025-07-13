import { FC, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../../../../../components/ui/form'
import { Button } from '../../../../../components/ui/button'
import { CustomInput } from '../../../../../components/Input/CustomInput'
import { GeminiWordService } from '../../../WikiManage/services/GeminiWordService'
import ApiService from '../../../../../service/ApiService'
import { Loader2, Sparkles } from 'lucide-react'
import { ViewWordDrawer } from '../../../WikiManage/components/Word/View/ViewWordDrawer'

export interface WikiWordDetailResponse {
  code: number
  message: string
  data: WikiWordDetail // Định nghĩa kiểu này bên dưới!
}

export interface WikiWordDetail {
  id: string
  word: string
  pronunciation: string
  frequency: string
  image_urls: string[]
  usage_notes: string[]
  language_level: string
  created_at: string
  updated_at: string
  definitions: Array<{
    id: string
    parts_of_speech: string
    definition: string
    is_main_definition: boolean
    examples: Array<{
      id: string
      example_sentence: string
      mean_example_sentence: string
      created_at: string
      updated_at: string
    }>
    created_at: string
    updated_at: string
  }>
  relationships: Array<{
    id: string
    related_id: string
    related_type: 'word' | 'phrase'
    relationship_type: string
    word: string
    created_at: string
    updated_at: string
  }>
}

export interface WordRepetitionFormData {
  word: string
}

interface WordRepetitionFormProps {
  initialData?: WordRepetitionFormData
  lessonId: string
  sequence: number
  onClose?: () => void
}

interface WikiWordWithQuestion {
  id: string
  word?: string
  pronunciation?: string
  definitions?: any[]
}

type FetchStatus = 'idle' | 'loading' | 'found' | 'not_found' | 'error'
type CreateStatus = 'idle' | 'loading' | 'success' | 'error'
type AddQuestionStatus = 'idle' | 'loading' | 'success' | 'error'

export const WordRepetitionForm: FC<WordRepetitionFormProps> = ({
  lessonId,
  sequence,
  onClose
}) => {
  const form = useFormContext<WordRepetitionFormData>()
  form.watch()

  const [fetchStatus, setFetchStatus] = useState<FetchStatus>('idle')
  const [wikiData, setWikiData] = useState<{
    wikiWord?: WikiWordWithQuestion
    questionId?: string
    questionSkill?: string
  } | null>(null)

  const [fetchError, setFetchError] = useState<string>('')
  const [createStatus, setCreateStatus] = useState<CreateStatus>('idle')
  const [createError, setCreateError] = useState<string>('')
  const [addStatus, setAddStatus] = useState<AddQuestionStatus>('idle')
  const [addError, setAddError] = useState<string>('')

  // Drawer state
  const [showDrawer, setShowDrawer] = useState(false)
  const [wordDrawerData, setWordDrawerData] = useState<any>(null)
  const [drawerLoading, setDrawerLoading] = useState(false)
  const [drawerError, setDrawerError] = useState<string>('')

  // Kiểm tra từ đã tồn tại với câu hỏi chưa
  const handleCheck = async () => {
    setFetchStatus('loading')
    setWikiData(null)
    setFetchError('')
    setDrawerError('')

    try {
      const result = await ApiService.get<any>(
        `/wiki/words/find-with-question?query=${encodeURIComponent(form.getValues('word'))}`
      )
      if (result?.code === 200 && result.data?.word_repetition?.wiki_word) {
        setWikiData({
          wikiWord: result.data.word_repetition.wiki_word,
          questionId: result.data.id,
          questionSkill: result.data.skill
        })
        setFetchStatus('found')
      } else {
        setFetchStatus('not_found')
      }
    } catch (err: any) {
      setFetchError('Đã xảy ra lỗi khi kiểm tra.')
      setFetchStatus('error')
    }
  }

  // Nếu chưa có: Tạo nhanh từ vựng với Gemini rồi gọi bulk + query lại như trên
  const handleQuickCreate = async () => {
    setCreateStatus('loading')
    setCreateError('')
    try {
      const wordInput = form.getValues('word')
      const wordData = await GeminiWordService.generateWordDetails(wordInput)
      // Thay thế đoạn này
      const normWord = _normalizeWikiWordReq({
        word: wordInput,
        ...wordData
      })
      const formData = new FormData()
      formData.append('data', JSON.stringify(normWord))
      await ApiService.post('/wiki/words/bulk', formData, true, true)
      setCreateStatus('success')
      await handleCheck()
    } catch (err: any) {
      setCreateError('Không thể tạo từ vựng. (Lỗi: ' + (err?.message || 'unknown') + ')')
      setCreateStatus('error')
    } finally {
      setTimeout(() => setCreateStatus('idle'), 1200)
    }
  }

  // ---- Utilities fix trường pronunciation & is_main_definition ---
  const _normalizeWikiWordReq = (wordObj: any) => {
    if (wordObj.pronunciation) {
      wordObj.pronunciation = wordObj.pronunciation.replace(/\//g, '').trim()
    }
    if (Array.isArray(wordObj.definitions)) {
      wordObj.definitions = wordObj.definitions.map((def: any, idx: number) => ({
        ...def,
        is_main_definition:
          typeof def.is_main_definition === 'boolean' ? def.is_main_definition : idx === 0
      }))
    }
    return wordObj
  }

  // Thêm câu hỏi vào bài học
  const handleAddToLesson = async () => {
    const qId = wikiData?.questionId
    const qSkill = wikiData?.questionSkill || 'speaking'
    if (!qId) return
    setAddStatus('loading')
    setAddError('')
    try {
      await ApiService.post('/lesson-question', {
        lesson_id: lessonId,
        sequence,
        question_id: qId,
        question_type: 'word_repetition',
        question_skill: qSkill
      })
      if (typeof onClose === 'function') onClose()
      setAddStatus('success')
    } catch (err: any) {
      setAddError('Không thể thêm câu hỏi vào bài học.')
      setAddStatus('error')
    } finally {
      setTimeout(() => setAddStatus('idle'), 1200)
    }
  }

  const handleOpenWordDrawer = async () => {
    setDrawerLoading(true)
    setDrawerError('')
    setWordDrawerData(null)
    let ignore = false
    try {
      const wikiWordId = wikiData?.wikiWord?.id
      if (!wikiWordId) {
        setDrawerError('Không tìm thấy id từ vựng.')
        return
      }
      const response = await ApiService.get<WikiWordDetailResponse>(`/wiki/words/${wikiWordId}`)
      if (!ignore) {
        if (response && response.code === 200 && response.data) {
          setWordDrawerData(response.data) // Tại đây TS biết chắc có data!
          setShowDrawer(true)
        } else {
          setDrawerError('Không thể lấy dữ liệu chi tiết từ vựng.')
        }
      }
    } catch {
      if (!ignore) setDrawerError('Lỗi khi lấy dữ liệu chi tiết.')
    } finally {
      if (!ignore) setDrawerLoading(false)
    }
    // Cleanup nếu component bị unmount khi loading
    return () => {
      ignore = true
    }
  }

  return (
    <>
      <Form {...form}>
        <div className="space-y-6">
          <div className="rounded-lg space-y-4">
            <FormField
              control={form.control}
              name="word"
              rules={{ required: 'Vui lòng nhập từ cần luyện tập' }}
              render={({ field, fieldState: { error } }) => (
                <FormItem>
                  <FormLabel className="text-[#2D3748] font-medium">Từ cần luyện tập</FormLabel>
                  <FormControl>
                    <CustomInput
                      value={field.value || ''}
                      onChange={field.onChange}
                      className={`w-full bg-transparent text-[#2D3748] min-h-[40px] py-1.5 my-1 ${
                        error
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-[#52aaa5] hover:border-[#52aaa5] focus:border-[#52aaa5] focus:ring-2 focus:ring-[#52aaa5]/20'
                      }`}
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-500 mt-1" />

                  {/* Button: Kiểm tra */}
                  <div className="flex flex-row items-center gap-2 mt-2">
                    <Button
                      variant="default"
                      onClick={handleCheck}
                      type="button"
                      className="bg-[#52aaa5] hover:bg-[#319c93] text-white font-semibold shadow active:scale-95 transition-all duration-150 min-w-[110px]"
                      disabled={
                        fetchStatus === 'loading' || !field.value || field.value.trim() === ''
                      }
                    >
                      {fetchStatus === 'loading' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-1" />
                          Đang kiểm tra...
                        </>
                      ) : (
                        'Kiểm tra'
                      )}
                    </Button>

                    {/* Nếu chưa có dữ liệu, cho phép tạo nhanh */}
                    {fetchStatus === 'not_found' && (
                      <Button
                        variant="default"
                        onClick={handleQuickCreate}
                        type="button"
                        className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold shadow active:scale-95 transition-all duration-150 min-w-[150px]"
                        disabled={
                          createStatus === 'loading' || !field.value || field.value.trim() === ''
                        }
                      >
                        {createStatus === 'loading' ? (
                          <>
                            <Sparkles className="w-4 h-4 animate-spin mr-1" />
                            Đang tạo nhanh...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-1" />
                            Tạo nhanh từ vựng
                          </>
                        )}
                      </Button>
                    )}

                    {/* Nếu từ đã có, hiển thị cho phép thêm vào bài học */}
                    {fetchStatus === 'found' && wikiData?.questionId && (
                      <Button
                        variant="default"
                        onClick={handleAddToLesson}
                        type="button"
                        disabled={addStatus === 'loading'}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow active:scale-95 transition-all duration-150 min-w-[180px]"
                      >
                        {addStatus === 'loading' ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-1" />
                            Đang thêm...
                          </>
                        ) : (
                          'Thêm câu hỏi vào bài học'
                        )}
                      </Button>
                    )}
                  </div>

                  {/* UI trạng thái & thông báo */}
                  {fetchStatus === 'error' && (
                    <div className="mt-2 text-red-500 text-xs">{fetchError}</div>
                  )}
                  {fetchStatus === 'not_found' && (
                    <div className="mt-2 text-yellow-700 text-xs">
                      Không tìm thấy từ này trong hệ thống. Bạn có thể tạo nhanh từ vựng bằng AI.
                    </div>
                  )}
                  {createStatus === 'error' && (
                    <div className="mt-2 text-red-500 text-xs">{createError}</div>
                  )}
                  {createStatus === 'success' && (
                    <div className="mt-2 text-green-500 text-xs">
                      Đã tạo nhanh từ vựng thành công!
                    </div>
                  )}
                  {addStatus === 'error' && (
                    <div className="mt-2 text-red-500 text-xs">{addError}</div>
                  )}
                  {addStatus === 'success' && (
                    <div className="mt-2 text-green-500 text-xs">Đã thêm câu hỏi vào bài học!</div>
                  )}

                  {/* Khi tìm thấy word, chỉ hiện nút "Xem thông tin từ" */}
                  {fetchStatus === 'found' && wikiData?.wikiWord && (
                    <div className="mt-2 flex flex-col gap-1">
                      <Button
                        onClick={handleOpenWordDrawer}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow"
                        disabled={drawerLoading}
                        type="button"
                      >
                        {drawerLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-1" />
                            Đang tải...
                          </>
                        ) : (
                          'Xem thông tin từ'
                        )}
                      </Button>
                      {drawerError && <div className="text-red-500 text-xs">{drawerError}</div>}
                    </div>
                  )}

                  {/* Nếu muốn check hiển thị nhanh demo: */}
                  {/* {fetchStatus === "found" && wikiData?.wikiWord && (
                    <WikiWordDetails {...(wikiData?.wikiWord as any)} />
                  )} */}
                </FormItem>
              )}
            />
          </div>
        </div>
      </Form>

      {/* Drawer hiển thị chi tiết từ vựng */}
      {showDrawer && wordDrawerData && (
        <ViewWordDrawer
          open={showDrawer}
          onClose={() => setShowDrawer(false)}
          data={wordDrawerData}
        />
      )}
    </>
  )
}

export default WordRepetitionForm

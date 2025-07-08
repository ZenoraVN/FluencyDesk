import { GeminiService } from '../../../../service/GeminiService'

export interface FillInBlankAIData {
  instruction: string
  topic: string[]
  tags: string[]
  level: string
  fill_in_the_blank_question: { question: string }
  fill_in_the_blank_answers: Array<{
    answer: string
    explain: string
  }>
}

const buildPrompt = (message: string, transcriptOrPassage?: string) => `
Bạn là chuyên gia giáo dục tiếng Anh.
Người dùng nhập bên dưới có thể là bất kỳ chỉ dẫn hoặc yêu cầu học thuật nào.
${transcriptOrPassage ? '- Sử dụng/ưu tiên thông tin sau khi người dùng cung cấp transcript hoặc passage:\n' : ''}
Yêu cầu:
- Chuyển thông tin thành MỘT bài tập tiếng Anh dạng "Điền vào chỗ trống".
- Có field "instruction" là mô tả/tóm tắt ngắn nội dung câu hỏi (tiếng Anh).
- Trả về JSON đúng chuẩn (có thể để trong code block \`\`\`json):
{
"instruction": "<Tóm tắt yêu cầu nội dung câu hỏi bằng tiếng Việt>",
"topic": ["<string>", ...],
"tags": ["<string>", ...],
"level": "beginner|intermediate|advanced",
"fill_in_the_blank_question": { "question": "<câu hỏi với ***1***, ***2***...>" },
"fill_in_the_blank_answers": [
{ "answer": "<đáp án>", "explain": "<giải thích tiếng Việt, nêu rõ lý do chọn đáp án>" }
]
}
Chú ý: Các trường "explain" luôn luôn giải thích lý do chọn đáp án và phải viết bằng tiếng Việt.
Đầu vào của người dùng:
"""
${message}
${transcriptOrPassage ? `\nTRANSCRIPT_OR_PASSAGE:\n${transcriptOrPassage}` : ''}
"""
`

function parseAIJson(text: string): FillInBlankAIData | null {
  try {
    const jsonBlock = text.match(/```json\s*([\s\S]+?)\s*```/)
    let rawJson = ''
    if (jsonBlock && jsonBlock[1]) {
      rawJson = jsonBlock[1].trim()
    } else if (text.trim().startsWith('{')) {
      rawJson = text.trim()
    } else {
      const jsonStart = text.indexOf('{')
      if (jsonStart >= 0) {
        rawJson = text.slice(jsonStart).trim()
      }
    }
    if (!rawJson) return null
    return JSON.parse(rawJson)
  } catch {
    return null
  }
}

export async function getFillInBlankAIGemini(
  message: string,
  transcriptOrPassage?: string
): Promise<FillInBlankAIData> {
  const apiKey = await GeminiService.getNextApiKey()
  if (!apiKey) throw new Error('Chưa cấu hình Gemini API Key')
  const prompt = buildPrompt(message || 'General English', transcriptOrPassage)

  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  )

  if (!resp.ok) {
    throw new Error('Gemini API lỗi: ' + resp.statusText)
  }

  const result = await resp.json()
  const text =
    result.candidates?.[0]?.content?.parts?.[0]?.text ||
    result.candidates?.[0]?.content?.parts?.[0] ||
    result.candidates?.[0]?.content?.text ||
    result.text ||
    ''
  const data = parseAIJson(text)
  if (!data) throw new Error('Gemini trả về dữ liệu không hợp lệ!')
  return data
}

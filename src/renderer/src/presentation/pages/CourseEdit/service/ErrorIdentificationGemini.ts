import { GeminiService } from '../../../../service/GeminiService'

export interface ErrorIdentificationAIData {
  instruction: string
  topic: string[]
  tags: string[]
  level: string
  error_identification_question: { question: string }
  error_identification_answers: Array<{
    error_word: string
    correct_word: string
    explain: string
  }>
}

const buildPrompt = (message: string) => `
Bạn là giáo viên tiếng Anh. Đầu vào bên dưới là chỉ dẫn/chủ đề bài luyện tập error identification.

YÊU CẦU:
- Tạo một bài tập Error Identification (tìm lỗi và sửa lỗi trong 1 hoặc nhiều câu tiếng Anh).
- Có trường "instruction": tóm tắt ngắn đề bài bằng tiếng Việt.
- "error_identification_question": object duy nhất với field "question", là câu/lỗi, mỗi lỗi ghi dạng ***n*** tại vị trí lỗi (n = 1,2,3...).
  (VD: "He go to ***1*** school every day.")
- "error_identification_answers": list đáp án đúng thứ tự, mỗi item gồm:
    + "error_word": từ/cụm từ sai,
    + "correct_word": đáp án đúng,
    + "explain": lý do tại sao (viết tiếng Việt).
- Đáp án số/chỗ trống phải tương ứng thứ tự/số lượng.
- Trả về **DUY NHẤT một code block \`\`\`json như ví dụ này**:
\`\`\`json
{
  "instruction": "Xác định và sửa các lỗi ngữ pháp sau.",
  "topic": ["error identification", "grammar"],
  "tags": ["mistake", "edit"],
  "level": "elementary",
  "error_identification_question": { "question": "He go to ***1*** school every day." },
  "error_identification_answers": [
    { 
      "error_word": "go",
      "correct_word": "goes",
      "explain": "Chủ ngữ He nên dùng động từ ngôi thứ 3 số ít là 'goes'."
    }
  ]
}
\`\`\`
Chỉ trả về object JSON bên trong code block \`\`\`json, không chú thích ngoài.

Đầu vào:
"""
${message}
"""
`

function parseAIJson(text: string): ErrorIdentificationAIData | null {
  try {
    const jsonBlock = text.match(/```json\s*([\s\S]+?)\s*```/)
    let rawJson = jsonBlock?.[1]?.trim() ?? ''
    if (!rawJson && text.trim().startsWith('{')) rawJson = text.trim()
    else if (!rawJson) {
      const jsonStart = text.indexOf('{')
      if (jsonStart >= 0) rawJson = text.slice(jsonStart).trim()
    }
    if (!rawJson) return null
    return JSON.parse(rawJson)
  } catch {
    return null
  }
}

export async function getErrorIdentificationAIGemini(
  message: string
): Promise<ErrorIdentificationAIData> {
  const apiKey = await GeminiService.getNextApiKey()
  if (!apiKey) throw new Error('Chưa cấu hình Gemini API Key')
  const prompt = buildPrompt(message)
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
  if (!resp.ok) throw new Error('Gemini API lỗi: ' + resp.statusText)
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

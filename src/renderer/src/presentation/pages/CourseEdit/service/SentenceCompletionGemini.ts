import { GeminiService } from '../../../../service/GeminiService'

export interface SentenceCompletionAIData {
  instruction: string
  topic: string[]
  tags: string[]
  level: string
  sentence_completions: Array<{
    original_sentence: string
    start_phrase: string
    middle_phrase: string | null
    end_phrase: string | null
    true_sentences: string[]
    explain: string
  }>
}

const buildPrompt = (message: string) => `
Bạn là giáo viên tiếng Anh. Đầu vào dưới đây là chủ đề hoặc chỉ dẫn tạo bài tập hoàn thành câu (sentence completion).

YÊU CẦU:
- Sinh ra ít nhất 1 bài tập hoàn thành câu tiếng Anh.
- "sentence_completions": mỗi item gồm:
    + "original_sentence": câu hoàn chỉnh đúng ngữ pháp/nghĩa,
    + "start_phrase": phần đầu (nếu có) đưa cho học sinh (vd: "If I"),
    + "middle_phrase": phần giữa (nếu có), hoặc null,
    + "end_phrase": phần cuối (nếu có), hoặc null,
    + "true_sentences": các đáp án đúng học sinh có thể viết (list >=1 item),
    + "explain": giải thích (tiếng Việt, rõ ràng).
- Có trường "instruction": tiếng Việt mô tả yêu cầu.
- Trả về 1 code block \`\`\`json ví dụ:
\`\`\`json
{
  "instruction": "Hoàn thành các câu điều kiện loại 2.",
  "topic": ["conditional", "grammar"],
  "tags": ["sentence-completion"],
  "level": "intermediate",
  "sentence_completions": [
    {
      "original_sentence": "If I won the lottery, I would travel the world.",
      "start_phrase": "If I",
      "middle_phrase": null,
      "end_phrase": "I would travel the world.",
      "true_sentences": [
        "If I won the lottery, I would travel the world."
      ],
      "explain": "Câu điều kiện loại 2: mệnh đề if ở thì quá khứ đơn, mệnh đề chính dùng would + V."
    }
  ]
}
\`\`\`
Chỉ trả về object JSON duy nhất bên trong code block, không chú thích ngoài.

Đầu vào:
"""
${message}
"""
`

function parseAIJson(text: string): SentenceCompletionAIData | null {
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

export async function getSentenceCompletionAIGemini(
  message: string
): Promise<SentenceCompletionAIData> {
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

import { GeminiService } from '../../../../service/GeminiService'
export interface OpenConversationAIData {
  instruction: string
  topic: string[]
  tags: string[]
  level: string
  open_conversation: {
    title: string
    overview: string
    example_conversation: string
  }
}
const buildPrompt = (message: string) => `
Bạn là giáo viên tiếng Anh. Đầu vào là chủ đề hoặc chỉ dẫn tạo hội thoại mở (Open Conversation).
YÊU CẦU:
- Hội thoại sẽ có 2-5 người: các ký tự là A, B, C, D và You (You là người học).
- Luôn bắt đầu với A và phải có You (vai "You" đại diện người học).
- "instruction": tiếng Việt, mô tả ngắn tình huống hội thoại và yêu cầu bài tập.
- "open_conversation": gồm:
+ "title": tiêu đề hội thoại.
+ "overview": tóm tắt chủ đề và mục tiêu luyện tập (tiếng Việt).
+ "example_conversation": hội thoại hoàn chỉnh, định dạng như sau:
  - Hội thoại gồm nhiều lượt, mỗi dòng bắt đầu bằng ký hiệu người (A: ...), tiếp theo là nội dung từng lượt.
  - **YÊU CẦU: Trong field "example_conversation" tất cả dấu xuống dòng giữa các lượt phải là ký tự escape \\\\n chứ KHÔNG phải là dấu xuống dòng thực tế.**
  - Không cần dịch nghĩa từng câu.
  - Nên dùng max 3 vai, và tổng hội thoại 6-12 lượt phù hợp chủ đề.
- Trả về 1 code block \`\`\`json như dưới đây:
\`\`\`json
{
"instruction": "Luyện nói: Hội thoại về đặt bàn ở nhà hàng.",
"topic": ["restaurant", "reservation", "open-conversation"],
"tags": ["speaking", "practice"],
"level": "intermediate",
"open_conversation": {
"title": "Booking a Table",
"overview": "Cuộc hội thoại đặt chỗ tại nhà hàng.",
"example_conversation": "A: Good evening, I'd like a table for two.\\nB: Certainly, do you have a reservation?\\nA: No, is there a table available now?\\nB: Let me check. Yes, please follow me."
}
}
\`\`\`
Chỉ trả về object JSON trong code block \`\`\`json ở trên.
Đầu vào:
"""
${message}
"""
`

function parseAIJson(text: string): OpenConversationAIData | null {
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
  } catch (e) {
    console.error('Gemini parse lỗi:', e, text)
    return null
  }
}

export async function getOpenConversationAIGemini(
  message: string
): Promise<OpenConversationAIData> {
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
  if (!data) {
    console.error('Gemini trả về dữ liệu không hợp lệ!', text)
    throw new Error('Gemini trả về dữ liệu không hợp lệ!')
  }
  return data
}

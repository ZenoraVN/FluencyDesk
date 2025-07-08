import { GeminiService } from '../../../../service/GeminiService'

interface SuggestTagsInput {
  title: string
  overview: string
  skills: string[]
  level: string
  type: string
}

export async function suggestCourseTags({
  title,
  overview,
  skills,
  level,
  type
}: SuggestTagsInput): Promise<string[]> {
  // Compose system prompt
  const prompt = `
Dựa trên các thông tin sau về một khóa học tiếng Anh, hãy đưa ra list các tags giúp phân loại hoặc tìm kiếm khóa học này dễ dàng hơn. Danh sách trả về chỉ gồm các tags, ngăn cách bằng dấu phẩy, mỗi tag là 1 từ/nhóm từ (tối ưu <=10 tags), không bao gồm tiêu đề khóa học, ngôn ngữ tag là tiếng Anh hoặc từ mượn thông dụng, không trùng lặp tag.

Thông tin:
- Title: ${title}
- Overview: ${overview}
- Skills: ${skills.join(', ')}
- Level: ${level}
- Type: ${type}

Trả về format: tag1, tag2, tag3, ...
`

  try {
    const apiKey = await GeminiService.getNextApiKey()
    if (!apiKey) throw new Error('Không tìm thấy API Key Gemini AI')
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ],
          safetySettings: [
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
          ],
          generationConfig: { temperature: 0.3, maxOutputTokens: 128 }
        })
      }
    )
    if (!response.ok) {
      const err = await response.json()
      throw new Error(err?.error?.message || 'Gemini API error')
    }
    const data = await response.json()

    // Gemini response (see API doc), thường trả về
    // { candidates: [ { content: { parts: [ { text: "tag1, tag2..." } ]}} ]}
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    // Tách tags từ string
    return text
      .split(',')
      .map((t: string) => t.trim())
      .filter(Boolean)
  } catch (e) {
    throw new Error(
      'Không thể gợi ý tags với Gemini: ' + (e instanceof Error ? e.message : 'Unknown error')
    )
  }
}

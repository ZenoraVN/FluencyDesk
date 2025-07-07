import { GeminiService } from "@/service/GeminiService";
export interface MatchingAIData {
    instruction: string;
    topic: string[];
    tags: string[];
    level: string;
    matchings: Array<{ question: string; answer: string; explain: string }>;
}

const buildPrompt = (message: string, transcriptOrPassage?: string) => `
Bạn là giáo viên tiếng Anh. Đầu vào là yêu cầu/chủ đề/passage.
${transcriptOrPassage ? "- Ưu tiên dùng thông tin passage hoặc đoạn transcript BÊN DƯỚI nếu có." : ""}
Yêu cầu:
- Sinh ra 1 bài tập MATCHING PAIRS (ghép nối) cho tiếng Anh.
- Trường "matchings": list 2-10 cặp, mỗi cặp gồm:
  - "question": từ/cum từ/câu tiếng Anh
  - "answer": đáp án đúng cần ghép
  - "explain": giải thích vì sao ghép như vậy, viết bằng tiếng Việt, rõ ràng.
- Có trường "instruction" tiếng Việt, mô tả đề bài.
- Trả về **chỉ 1 code block \`\`\`json với object dữ liệu** như ví dụ sau:
\`\`\`json
{
  "instruction": "Ghép từ/cụm từ ở cột A với nghĩa tiếng Việt tương ứng.",
  "topic": ["phrasal verbs", "vocabulary"],
  "tags": ["matching", "meaning"],
  "level": "beginner",
  "matchings": [
    {
      "question": "give up",
      "answer": "bỏ cuộc",
      "explain": "‘Give up’ có nghĩa là từ bỏ một việc gì đó."
    },
    {
      "question": "run out of",
      "answer": "hết, cạn kiệt",
      "explain": "‘Run out of’ nghĩa là không còn cái gì nữa."
    }
  ]
}
\`\`\`
CHỈ trả về object như trên, KHÔNG ghi gì ngoài code block.
Đầu vào:
"""
${message}
${transcriptOrPassage ? `\nTRANSCRIPT_OR_PASSAGE:\n${transcriptOrPassage}` : ""}
"""
`;

function parseAIJson(text: string): MatchingAIData | null {
    try {
        const jsonBlock = text.match(/```json\s*([\s\S]+?)\s*```/);
        let rawJson = jsonBlock?.[1]?.trim() ?? '';
        if (!rawJson && text.trim().startsWith("{")) rawJson = text.trim();
        else if (!rawJson) {
            const jsonStart = text.indexOf("{");
            if (jsonStart >= 0) rawJson = text.slice(jsonStart).trim();
        }
        if (!rawJson) return null;
        return JSON.parse(rawJson);
    } catch {
        return null;
    }
}

export async function getMatchingAIGemini(
    message: string,
    transcriptOrPassage?: string
): Promise<MatchingAIData> {
    const apiKey = await GeminiService.getNextApiKey();
    if (!apiKey) throw new Error("Chưa cấu hình Gemini API Key");
    const prompt = buildPrompt(message, transcriptOrPassage);
    const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
            }),
        }
    );
    if (!resp.ok) throw new Error("Gemini API lỗi: " + resp.statusText);
    const result = await resp.json();
    const text =
        result.candidates?.[0]?.content?.parts?.[0]?.text ||
        result.candidates?.[0]?.content?.parts?.[0] ||
        result.candidates?.[0]?.content?.text ||
        result.text ||
        "";
    const data = parseAIJson(text);
    if (!data) throw new Error("Gemini trả về dữ liệu không hợp lệ!");
    return data;
}

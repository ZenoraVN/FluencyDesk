import { GeminiService } from "@/service/GeminiService";

export interface OpenParagraphAIData {
    instruction: string;
    topic: string[];
    tags: string[];
    level: string;
    open_paragraph: {
        example_paragraph: string;
        mean_example_paragraph: string;
        tips?: string[];
    };
}

const buildPrompt = (message: string) => `
Bạn là giáo viên tiếng Anh. Đầu vào dưới đây là chủ đề hoặc chỉ dẫn tạo bài tập viết đoạn văn mở (Open Paragraph).

YÊU CẦU:
- Sinh ra một bài mẫu Open Paragraph.
- Field "instruction": tiếng Việt mô tả/giới thiệu bài tập.
- "open_paragraph": gồm:
  + "example_paragraph": đoạn văn mẫu tiếng Anh.
  + "mean_example_paragraph": nghĩa tiếng Việt đoạn mẫu.
  + "tips": list mẹo hướng dẫn viết đoạn (không bắt buộc, có thể bỏ qua nếu không có ý, trả về mảng rỗng hoặc không trả về field này).

- Trả về **1 code block \`\`\`json duy nhất** như dưới đây:
\`\`\`json
{
  "instruction": "Viết một đoạn văn giới thiệu bản thân bằng tiếng Anh.",
  "topic": ["introduction", "writing"],
  "tags": ["open-paragraph"],
  "level": "elementary",
  "open_paragraph": {
    "example_paragraph": "My name is Hoa. I am ten years old. I live in Hanoi. I like cats.",
    "mean_example_paragraph": "Tên tôi là Hoa. Tôi 10 tuổi. Tôi sống ở Hà Nội. Tôi thích mèo.",
    "tips": [
      "Nêu họ tên, tuổi, sở thích và nơi ở.",
      "Viết ngắn gọn, rõ ý."
    ]
  }
}
\`\`\`
Chỉ trả về object JSON trong code block \`\`\`json.

Đầu vào:
"""
${message}
"""
`;

function parseAIJson(text: string): OpenParagraphAIData | null {
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

export async function getOpenParagraphAIGemini(
    message: string
): Promise<OpenParagraphAIData> {
    const apiKey = await GeminiService.getNextApiKey();
    if (!apiKey) throw new Error("Chưa cấu hình Gemini API Key");
    const prompt = buildPrompt(message);
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

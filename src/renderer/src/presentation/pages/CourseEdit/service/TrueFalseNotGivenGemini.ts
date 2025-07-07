import { GeminiService } from "@/service/GeminiService";

export interface TrueFalseNotGivenAIData {
    instruction: string;
    topic: string[];
    tags: string[];
    level: string;
    true_false_not_givens: Array<{
        question: string;
        answer: "TRUE" | "FALSE" | "NOT_GIVEN";
        explain: string;
    }>;
}

const buildPrompt = (message: string, transcriptOrPassage?: string) => `
Bạn là giảng viên tiếng Anh. Đầu vào: chỉ dẫn hoặc passage.
${transcriptOrPassage ? "- Nếu có transcript/passage, hãy sử dụng nội dung này ưu tiên." : ""}
Sinh ra 2~10 câu hỏi TRUE/FALSE/NOT GIVEN:
- Mỗi item gồm: question (nội dung đầy đủ), answer (TRUE/FALSE/NOT_GIVEN), explain (tiếng Việt rõ ràng vì sao đúng/sai).
- Có trường "instruction": mô tả ngắn về nội dung bài.
- Output là JSON duy nhất nằm trong code block \`\`\`json như sau:
{
  "instruction": "...",
  "topic": [...],
  "tags": [...],
  "level": "...",
  "true_false_not_givens": [
    {"question": "...", "answer": "...", "explain": "..."}
  ]
}
Đầu vào:
"""
${message}
${transcriptOrPassage ? `\nTRANSCRIPT_OR_PASSAGE:\n${transcriptOrPassage}` : ""}
"""
`;

function parseAIJson(text: string): TrueFalseNotGivenAIData | null {
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

export async function getTrueFalseNotGivenAIGemini(
    message: string,
    transcriptOrPassage?: string
): Promise<TrueFalseNotGivenAIData> {
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

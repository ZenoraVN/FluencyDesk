import { GeminiService } from "@/service/GeminiService";

export interface ChoiceOneAIData {
    instruction: string;
    topic: string[];
    tags: string[];
    level: string;
    choice_one_question: { question: string; explain: string };
    choice_one_options: Array<{
        option: string;
        is_correct: boolean;
    }>;
}

// Prompt
const buildPrompt = (message: string, transcriptOrPassage?: string) => `
Bạn là chuyên gia giáo dục tiếng Anh.
Người dùng nhập bên dưới là chỉ dẫn hoặc đề tài cần ra đề.
${transcriptOrPassage ? "- Ưu tiên sử dụng thông tin transcript/passage sau nếu có:\n" : ""}
Yêu cầu:
- Sinh ra 1 câu hỏi trắc nghiệm tiếng Anh 1 đáp án đúng (choice_one).
- Có trường "instruction" mô tả/tóm tắt nội dung câu hỏi (tiếng Anh).
- Trả về JSON như sau trong code block \`\`\`json:
{
  "instruction": "<Tóm tắt yêu cầu nội dung câu hỏi bằng tiếng Việt>",
  "topic": ["<chủ đề>", ...],
  "tags": ["<tag>", ...],
  "level": "beginner|intermediate|advanced",
  "choice_one_question": { "question": "<nội dung câu hỏi>", "explain": "<giải thích đáp án đúng, tiếng Việt>" },
  "choice_one_options": [
    { "option": "<đáp án A>", "is_correct": true/false },
    ...
  ]
}
Lưu ý: "is_correct" chỉ đúng với 1 đáp án. "explain" luôn phải viết bằng tiếng Việt.

Đầu vào người dùng:
"""
${message}
${transcriptOrPassage ? `\nTRANSCRIPT_OR_PASSAGE:\n${transcriptOrPassage}` : ""}
"""
`;

function parseAIJson(text: string): ChoiceOneAIData | null {
    try {
        const jsonBlock = text.match(/```json\s*([\s\S]+?)\s*```/);
        let rawJson = "";
        if (jsonBlock && jsonBlock[1]) {
            rawJson = jsonBlock[1].trim();
        } else if (text.trim().startsWith("{")) {
            rawJson = text.trim();
        } else {
            const jsonStart = text.indexOf("{");
            if (jsonStart >= 0) rawJson = text.slice(jsonStart).trim();
        }
        if (!rawJson) return null;
        return JSON.parse(rawJson);
    } catch {
        return null;
    }
}

export async function getChoiceOneAIGemini(
    message: string,
    transcriptOrPassage?: string
): Promise<ChoiceOneAIData> {
    const apiKey = await GeminiService.getNextApiKey();
    if (!apiKey) throw new Error("Chưa cấu hình Gemini API Key");
    const prompt = buildPrompt(message || "General English", transcriptOrPassage);

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

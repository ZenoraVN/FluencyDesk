import { GeminiService } from "@/service/GeminiService";
export interface ChoiceMultiAIData {
    instruction: string;
    topic: string[];
    tags: string[];
    level: string;
    choice_multi_question: { question: string; explain: string };
    choice_multi_options: Array<{ option: string; is_correct: boolean }>;
}

const buildPrompt = (message: string, transcriptOrPassage?: string) => `
Bạn là chuyên gia giáo dục tiếng Anh.
Người dùng nhập bên dưới là chỉ dẫn/chủ đề hoặc một passage để tạo bài tập.
${transcriptOrPassage ? "- Ưu tiên sử dụng/diễn giải từ transcript/passage bên dưới nếu có." : ""}
Yêu cầu:
- Tạo 1 câu hỏi trắc nghiệm nhiều đáp án đúng (choice_multi) bằng tiếng Anh.
- Trường "choice_multi_question" gồm:
  - "question": Nội dung câu hỏi bằng tiếng Anh.
  - "explain": Giải thích tại sao (bằng tiếng Việt, rõ ràng, chi tiết).
- "choice_multi_options": Danh sách 3 đến 10 lựa chọn, trong đó:
  - Ít nhất 2 lựa chọn đúng ("is_correct": true)
  - Ít nhất 1 lựa chọn sai ("is_correct": false)
  - Không lặp lại nội dung giữa các lựa chọn.
- Có trường "instruction" tiếng Việt mô tả ngắn yêu cầu hoặc mục tiêu của câu hỏi.
- Trả về **JSON đúng chuẩn trong code block \`\`\`json duy nhất**, ví dụ như sau:
\`\`\`json
{
  "instruction": "Chọn tất cả các đáp án đúng cho chủ đề thì hiện tại hoàn thành.",
  "topic": ["present perfect", "grammar"],
  "tags": ["tense", "multi-choice"],
  "level": "intermediate",
  "choice_multi_question": {
    "question": "Which of the following sentences use present perfect tense?",
    "explain": "Các câu đúng sử dụng cấu trúc thì hiện tại hoàn thành (have/has + V3)."
  },
  "choice_multi_options": [
    { "option": "She has finished her homework.", "is_correct": true },
    { "option": "They went to the cinema.", "is_correct": false },
    { "option": "We have seen that movie.", "is_correct": true }
  ]
}
\`\`\`
LƯU Ý: Chỉ trả về code block \`\`\`json chứa 1 object như trên, không ghi chú/thuyết minh ở ngoài hoặc lồng code khác.
Đầu vào người dùng:
"""
${message}
${transcriptOrPassage ? `\nTRANSCRIPT_OR_PASSAGE:\n${transcriptOrPassage}` : ""}
"""
`;

function parseAIJson(text: string): ChoiceMultiAIData | null {
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

export async function getChoiceMultiAIGemini(
    message: string,
    transcriptOrPassage?: string
): Promise<ChoiceMultiAIData> {
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

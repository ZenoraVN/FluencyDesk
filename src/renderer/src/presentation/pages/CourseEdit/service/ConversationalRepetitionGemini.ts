import { GeminiService } from "@/service/GeminiService";

export interface ConversationalRepetitionAIData {
    instruction: string;
    topic: string[];
    tags: string[];
    level: string;
    conversational_repetition: { title: string; overview: string };
    conversational_repetition_qa: Array<{
        question: string;
        answer: string;
        mean_of_question: string;
        mean_of_answer: string;
    }>;
}

const buildPrompt = (message: string) => `
Bạn là giáo viên tiếng Anh. Đầu vào dưới đây là chủ đề hoặc chỉ dẫn tạo bài luyện tập hội thoại lặp lại (Conversational Repetition).

YÊU CẦU:
- Tạo một bài hội thoại ngắn, có nhiều lượt hỏi đáp.
- Field "instruction": tiếng Việt mô tả ngắn bài tập.
- "conversational_repetition": gồm "title" (tiêu đề hội thoại) và "overview" (tổng quan tiếng Việt mục tiêu/ngữ cảnh).
- "conversational_repetition_qa": list 2-5 cặp, mỗi cặp gồm:
  + "question": câu tiếng Anh
  + "answer": câu trả lời tiếng Anh phù hợp
  + "mean_of_question": nghĩa tiếng Việt của câu hỏi
  + "mean_of_answer": nghĩa tiếng Việt của câu trả lời

- Trả về 1 code block \`\`\`json duy nhất như sau:
\`\`\`json
{
  "instruction": "Luyện tập hỏi đáp thông dụng trong lớp học.",
  "topic": ["classroom", "conversation"],
  "tags": ["dialogue", "practice"],
  "level": "elementary",
  "conversational_repetition": {
    "title": "Classroom Greetings",
    "overview": "Hội thoại mẫu giữa giáo viên và học sinh về chào hỏi trong lớp học."
  },
  "conversational_repetition_qa": [
    {
      "question": "Good morning, class.",
      "answer": "Good morning, teacher.",
      "mean_of_question": "Chào buổi sáng lớp học.",
      "mean_of_answer": "Chào buổi sáng cô giáo/thầy giáo."
    },
    {
      "question": "How are you today?",
      "answer": "We are fine, thank you.",
      "mean_of_question": "Hôm nay các em thế nào?",
      "mean_of_answer": "Chúng em khỏe, cảm ơn cô/thầy."
    }
  ]
}
\`\`\`
Chỉ trả về object JSON trong code block như trên.

Đầu vào:
"""
${message}
"""
`;

function parseAIJson(text: string): ConversationalRepetitionAIData | null {
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

export async function getConversationalRepetitionAIGemini(
    message: string
): Promise<ConversationalRepetitionAIData> {
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

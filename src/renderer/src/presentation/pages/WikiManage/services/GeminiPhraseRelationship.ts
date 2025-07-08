import { GeminiService } from '../../../../service/GeminiService';

interface RelationshipSuggestion {
  wiki_word_id: string;
  text: string;
  mean_vietnamese?: string;
  explanation?: string;
  related_type: 'word' | 'phrase';
  relationship_type: 'synonym' | 'antonym' | 'word_synonym' | 'word_antonym';
}

interface PhraseRelationship {
  id: string;
  related_id: string;
  related_type: 'word' | 'phrase';
  relationship_type: string;
  phrase?: string;
  word?: string; // thêm word để xử lý trường hợp relationship từ word
  created_at: string;
  updated_at: string;
}

const normalized = (str?: string) => (str || '').trim().toLowerCase();

export class GeminiPhraseRelationship {
  static async suggestRelationships(
    phraseId: string,
    phraseText: string,
    existingRelationships: PhraseRelationship[]
  ): Promise<RelationshipSuggestion[]> {
    try {
      // FIX: Lấy cả phrase và word làm key so sánh trùng lặp
      const existingTexts = existingRelationships.map(r =>
        normalized(r.phrase || (r as any).word)
      );
      const prompt = `
Analyze the English phrase "${phraseText}" and suggest new single-word or phrase relationships of type word_synonym, word_antonym, synonym or antonym that don't exist yet. Current relationships: ${existingRelationships.map(r => r.phrase || (r as any).word).join(', ')}
Return ONLY a JSON array of new relationships in this format, without any explanation or markdown:
[
{
"text": "related word or phrase",
"mean_vietnamese": "nghĩa tiếng Việt",
"explanation": "A clear, 1-2 sentence explanation of HOW "${phraseText}" and this related word/phrase are connected as <relationship_type>. The explanation MUST mention BOTH the original phrase and the related word/phrase, describe in context WHY they are <relationship_type>, and, if applicable, give a short usage scenario.",
"related_type": "word" or "phrase",
"relationship_type": "word_synonym or word_antonym or synonym or antonym"
}
]
Guidance for "explanation" field:
- Must be written in Vietnamese.
- Do NOT just define the word or phrase.
- Explain their connection and provide a brief contextual scenario.
- For example, Do:
"‘Call it a day’ và ‘quit’ đều nói về việc dừng lại công việc đang làm. Khi ai đó nói 'Let's call it a day', ý là hãy cùng nhau nghỉ và kết thúc công việc giống như ‘quit’, nhưng nhẹ nhàng hơn."
Available relationship types:
For phrase-to-word relationships (when related_type is "word"):
- word_synonym (single word equivalent to the phrase, e.g., "die" ↔ "kick the bucket", "surrender" ↔ "give up")
- word_antonym (single word opposite to the phrase, e.g., "remember" ↔ "lose track of", "struggle" ↔ "make ends meet")
For phrase-to-phrase relationships (when related_type is "phrase"):
- synonym (phrases equivalent in meaning, e.g., "call it a day" ↔ "wrap things up", "in the nick of time" ↔ "at the last minute")
- antonym (phrases opposite in meaning, e.g., "call it a day" ↔ "get the ball rolling", "in the black" ↔ "in the red")
Requirements:
- Do not suggest any relationships that already exist in the current list
- Ensure suggestions are natural and commonly used
- Focus on meaningful relationships that help understand usage
- Return an empty array [] if no new relationships are needed
- Limit total suggestions to 10 items
- All suggestions must be in English
`.trim();

      const settings = await GeminiService.getSettings();
      if (!settings) {
        console.log('[GeminiPhraseRelationship] No Gemini settings found');
        return [];
      }
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${settings.model}:generateContent?key=${settings.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
          }),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        console.error('[GeminiPhraseRelationship] API error:', error);
        throw new Error(error.error?.message || `Failed to generate relationships: ${response.status}`);
      }
      const data = await response.json();
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        console.error('[GeminiPhraseRelationship] Invalid response format:', data);
        throw new Error('Invalid response format from Gemini API');
      }
      const rawText = data.candidates[0].content.parts[0].text;
      // Try to extract JSON from markdown if present
      const jsonMatch = rawText.match(/```json\n([\s\S]*?)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : rawText;
      const suggestions: Array<{
        text: string;
        mean_vietnamese?: string;
        explanation?: string;
        related_type: 'word' | 'phrase';
        relationship_type: RelationshipSuggestion['relationship_type'];
      }> = JSON.parse(jsonString);

      // Validate relationship types
      const validatedSuggestions = suggestions.filter(suggestion => {
        const isValid = [
          'word_synonym', 'word_antonym', 'synonym', 'antonym'
        ].includes(suggestion.relationship_type);
        if (!isValid) {
          console.warn(
            `Invalid relationship type: ${suggestion.relationship_type} for ${suggestion.related_type}`
          );
        }
        return isValid;
      });

      // Transform suggestions to include phrase ID
      const enrichedSuggestions = validatedSuggestions.map(suggestion => ({
        ...suggestion,
        wiki_word_id: phraseId
      }));

      // Loại bỏ suggestion text đã tồn tại (không phân biệt hoa thường, thừa khoảng trắng)
      return enrichedSuggestions.filter(
        s => !existingTexts.includes(normalized(s.text))
      );
    } catch (error) {
      console.error('Error suggesting relationships:', error);
      return [];
    }
  }
}

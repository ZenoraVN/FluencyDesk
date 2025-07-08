import { GeminiService } from '../../../../service/GeminiService';

export type PhrasePartOfSpeech =
  | 'noun_phrase'
  | 'verb_phrase'
  | 'adjective_phrase'
  | 'adverb_phrase'
  | 'prepositional_phrase'
  | 'gerund_phrase'
  | 'infinitive_phrase'
  | 'participial_phrase'
  | 'absolute_phrase'
  | 'appositive_phrase'
  | 'phrasal_verb'
  | 'idiom'
  | 'collocation'
  | 'fixed_expression'
  | string; // fallback nếu Gemini trả về gì đó mới

interface PhraseSuggestion {
  pronunciation: string;
  frequency: 'high' | 'medium' | 'low';
  language_level: 'beginner' | 'intermediate' | 'advanced';
  usage_notes: string[];
  definitions: Array<{
    parts_of_speech: PhrasePartOfSpeech;
    definition: string;
    examples: Array<{
      example_sentence: string;
      mean_example_sentence: string;
    }>;
  }>;
}

const generatePrompt = (phrase: string) => {
  return `Generate detailed information for the English phrase "${phrase}". Return ONLY the raw JSON without any markdown formatting or explanation, in the following format:
{
  "pronunciation": "IPA pronunciation",
  "frequency": "high/medium/low (how commonly the phrase is used)",
  "language_level": "beginner/intermediate/advanced",
  "usage_notes": [],
  "definitions": [
    {
      "parts_of_speech": "noun_phrase/verb_phrase/adjective_phrase/adverb_phrase/prepositional_phrase/gerund_phrase/infinitive_phrase/participial_phrase/absolute_phrase/appositive_phrase/phrasal_verb/idiom/collocation/fixed_expression",
      "definition": "Định nghĩa đầy đủ và chi tiết bằng tiếng Việt có dấu",
      "examples": [
        {
          "example_sentence": "first natural english example sentence",
          "mean_example_sentence": "Nghĩa của câu ví dụ thứ nhất bằng tiếng Việt có dấu"
        }
      ]
    }
  ]
}
Requirements:
- Pronunciation must be in IPA format
- Allowed parts_of_speech (phrase types): noun_phrase, verb_phrase, adjective_phrase, adverb_phrase, prepositional_phrase, gerund_phrase, infinitive_phrase, participial_phrase, absolute_phrase, appositive_phrase, phrasal_verb, idiom, collocation, fixed_expression
- All Vietnamese text must contain proper diacritical marks
- Usage notes are optional but if provided must be practical Vietnamese explanations
- Definitions must be comprehensive and clear Vietnamese explanations
- Each definition must have at least one example, but prefer providing multiple examples
- Try to provide multiple definitions if the phrase has different meanings or uses
- Examples should be natural, diverse, and show different contexts
- All Vietnamese content must be grammatically correct with proper diacritical marks
- Focus on idiomatic meanings and common usage patterns
- Always aim to provide the most complete and detailed information possible`
};

export const GeminiPhraseService = {
  async generatePhraseDetails(phrase: string): Promise<PhraseSuggestion | null> {
    console.log('[GeminiPhraseService] Starting phrase generation for:', phrase);
    const settings = await GeminiService.getSettings();
    if (!settings) {
      console.log('[GeminiPhraseService] No Gemini settings found');
      return null;
    }
    try {
      const prompt = generatePrompt(phrase);
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${settings.model}:generateContent?key=${settings.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }]
          })
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `Failed to generate phrase details: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response format from Gemini API');
      }
      const rawText = data.candidates[0].content.parts[0].text;
      // Try to extract JSON from markdown if present
      const jsonMatch = rawText.match(/```json\n([\s\S]*?)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : rawText;
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('[GeminiPhraseService] Error generating phrase details:', error);
      return null;
    }
  },
};

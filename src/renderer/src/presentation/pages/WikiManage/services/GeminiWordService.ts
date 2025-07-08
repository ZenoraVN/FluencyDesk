import { GeminiService } from '../../../../service/GeminiService';

export type PartsOfSpeech =
  | 'verb'
  | 'noun'
  | 'adjective'
  | 'adverb'
  | 'article'
  | 'pronoun'
  | 'preposition'
  | 'conjunction'
  | 'determiner'
  | 'interjection'
  | 'auxiliary'
  | 'numeral'
  | 'particle'
  | 'exclamative'
  | string;

interface WordSuggestion {
  pronunciation: string;
  frequency: 'high' | 'medium' | 'low';
  language_level: 'beginner' | 'intermediate' | 'advanced';
  usage_notes: string[];
  definitions: Array<{
    parts_of_speech: PartsOfSpeech;
    definition: string;
    examples: Array<{
      example_sentence: string;
      mean_example_sentence: string;
    }>;
  }>;
  topic?: string[];
  tags?: string[];
  score?: number;
}

const generatePrompt = (word: string) => {
  return `Generate detailed information for the English word "${word}". Return ONLY the raw JSON without any markdown formatting or explanation, in the following format:
{
  "pronunciation": "IPA pronunciation",
  "frequency": "high/medium/low (how commonly the word is used)",
  "language_level": "beginner/intermediate/advanced",
  "usage_notes": [], // Có thể là mảng rỗng hoặc chứa các ghi chú sử dụng bằng tiếng Việt
  "topic": ["main topic 1", "main topic 2"],
  "tags": ["tag1", "tag2", "tag3"],
  "score": 10-100, // must be a multiple of 10
  "definitions": [
    {
      "parts_of_speech": "verb / noun / adjective / adverb / article / pronoun / preposition / conjunction / determiner / interjection / auxiliary / numeral / particle / exclamative",
      "definition": "Định nghĩa đầy đủ và chi tiết bằng tiếng Việt có dấu",
      "examples": [
        {
          "example_sentence": "first natural english example sentence",
          "mean_example_sentence": "Nghĩa của câu ví dụ thứ nhất bằng tiếng Việt có dấu"
        },
        {
          "example_sentence": "second english example showing different usage",
          "mean_example_sentence": "Nghĩa của câu ví dụ thứ hai thể hiện cách dùng khác"
        }
      ]
    },
    {
      "parts_of_speech": "another_part_of_speech",
      "definition": "Định nghĩa khác nếu từ có nhiều nghĩa",
      "examples": [
        {
          "example_sentence": "Example for another meaning",
          "mean_example_sentence": "Ví dụ cho nghĩa khác của từ"
        }
      ]
    }
  ]
}

Requirements:
- Pronunciation must be in IPA format
- Allowed parts_of_speech: verb, noun, adjective, adverb, article, pronoun, preposition, conjunction, determiner, interjection, auxiliary, numeral, particle, exclamative
- All Vietnamese text must contain proper diacritical marks
- Usage notes are optional but if provided must be practical Vietnamese explanations
- Definitions must be comprehensive and clear Vietnamese explanations
- Each definition must have at least one example, but prefer providing multiple examples
- Try to provide multiple definitions if the word has different meanings or uses
- Examples should be natural, diverse, and show different contexts
- All Vietnamese content must be grammatically correct with proper diacritical marks  
- Always aim to provide the most complete and detailed information possible`.trim();
};

export const GeminiWordService = {
  async generateWordDetails(word: string): Promise<WordSuggestion | null> {
    console.log('[GeminiWordService] Starting word generation for:', word);
    const settings = await GeminiService.getSettings();
    if (!settings) {
      console.log('[GeminiWordService] No Gemini settings found');
      return null;
    }
    console.log('[GeminiWordService] Using model:', settings.model);
    try {
      console.log('[GeminiWordService] Generating prompt...');
      const prompt = generatePrompt(word);
      console.log('[GeminiWordService] Prompt generated, length:', prompt.length);
      console.log('[GeminiWordService] Making API request...');
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
      console.log('[GeminiWordService] API response status:', response.status);
      if (!response.ok) {
        const error = await response.json();
        console.error('[GeminiWordService] API error:', error);
        throw new Error(error.error?.message || `Failed to generate word details: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log('[GeminiWordService] Raw API response:', data);
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response format from Gemini API');
      }
      const rawText = data.candidates[0].content.parts[0].text;
      console.log('[GeminiWordService] Raw text from API:', rawText);
      // Try to extract JSON from markdown if present
      const jsonMatch = rawText.match(/```json\n([\s\S]*?)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : rawText;
      console.log('[GeminiWordService] Extracted JSON string:', jsonString);
      const parsedData = JSON.parse(jsonString);
      console.log('[GeminiWordService] Successfully parsed JSON:', parsedData);
      return parsedData;
    } catch (error) {
      console.error('[GeminiWordService] Error generating word details:', error);
      return null;
    }
  },
};

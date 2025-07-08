import { GeminiService } from "../../../../service/GeminiService";

interface Relationship {
  id: string;
  related_id: string;
  related_type: "word" | "phrase";
  relationship_type: string;
  word?: string;
  phrase?: string;
  created_at: string;
  updated_at: string;
}

interface RelationshipSuggestion {
  wiki_word_id: string;
  text: string;
  mean_vietnamese?: string;
  related_type: "word" | "phrase";
  relationship_type:
    | "synonym"
    | "antonym"
    | "inflection"
    | "rhyme"
    | "hypernym"
    | "collocation";
  explanation?: string;
}

const normalized = (str?: string) => (str || "").trim().toLowerCase();

export class GeminiWordRelationship {
  static async suggestRelationships(
    wordId: string,
    word: string,
    existingRelationships: Relationship[]
  ): Promise<RelationshipSuggestion[]> {
    try {
      const existingTexts = existingRelationships.map((r) =>
        normalized(r.word || r.phrase)
      );
      const prompt = `
Analyze the English word "${word}" and suggest new relationships that don't exist yet. Current relationships: ${existingRelationships
        .map((r) => r.word || r.phrase || "")
        .join(", ")}
Return ONLY a JSON array of new relationships in this format, without any explanation or markdown:
[
{
"text": "related word or phrase",
"mean_vietnamese": "nghĩa tiếng Việt",
"related_type": "word or phrase",
"relationship_type": "synonym | antonym | inflection | rhyme | hypernym | collocation",
"explanation": "A clear, 1-2 sentence explanation of HOW '${word}' and this related word/phrase are connected as <relationship_type>. MUST mention BOTH the original word and the related word/phrase, describe in context WHY they are <relationship_type>, and if applicable, a short usage scenario. (Explanation MUST be in Vietnamese, and DO NOT just define the word/phrase. Explain their connection and give a context/scenario.)"
}
]
Guidance for "explanation" field:
- Must be written in Vietnamese.
- Do NOT just define the word or phrase.
- Explain their connection and provide a brief contextual scenario.
- For example, Do:
"‘Run’ và ‘ran’ là các dạng khác nhau (inflection) của cùng một động từ, dùng trong các thì khác nhau. ‘Run’ là nguyên thể, còn ‘ran’ là dạng quá khứ."
Available relationship types:
For word-to-word relationships (when related_type is "word"):
- synonym (similar meaning, e.g., "big" ↔ "large")
- antonym (opposite meaning, e.g., "hot" ↔ "cold")
- inflection (different forms, e.g., "run" → "runs/ran/running")
- rhyme (similar ending sound, e.g., "cat" ↔ "hat")
- hypernym (more general term, e.g., "vehicle" → "car")
For word-to-phrase relationships (when related_type is "phrase"):
- collocation (common word combinations, e.g., "make a decision", "heavy rain")
Requirements:
- Do not suggest any relationships that already exist in the current list.
- Ensure suggestions are natural and commonly used.
- For inflections, include all relevant grammatical forms.
- For collocations, focus on frequent combinations.
- Return an empty array [] if no new relationships are needed.
- Limit to 10 suggestions max.
- All suggestions must be in English.
`.trim();

      const settings = await GeminiService.getSettings();
      if (!settings) {
        console.log("[GeminiWordRelationship] No Gemini settings found");
        return [];
      }
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${settings.model}:generateContent?key=${settings.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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
        console.error("[GeminiWordRelationship] API error:", error);
        throw new Error(
          error.error?.message ||
            `Failed to generate relationships: ${response.status}`
        );
      }
      const data = await response.json();
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        console.error(
          "[GeminiWordRelationship] Invalid response format:",
          data
        );
        throw new Error("Invalid response format from Gemini API");
      }
      const rawText = data.candidates[0].content.parts[0].text;
      // Try to extract JSON from markdown if present
      const jsonMatch = rawText.match(/```json\n([\s\S]*?)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : rawText;
      const suggestions: Array<{
        text: string;
        mean_vietnamese?: string;
        explanation?: string;
        related_type: "word" | "phrase";
        relationship_type: RelationshipSuggestion["relationship_type"];
      }> = JSON.parse(jsonString);

      // Validate relationship types
      const validTypes = [
        "synonym",
        "antonym",
        "inflection",
        "rhyme",
        "hypernym",
        "collocation",
      ];

      const validatedSuggestions = suggestions.filter((suggestion) => {
        const isValid = validTypes.includes(suggestion.relationship_type);
        if (!isValid) {
          console.warn(
            `Invalid relationship type: ${suggestion.relationship_type} for ${suggestion.related_type}`
          );
        }
        return isValid;
      });

      // Enrich with wordId/key
      const enrichedSuggestions = validatedSuggestions.map((suggestion) => ({
        ...suggestion,
        wiki_word_id: wordId,
      }));

      // Filter out duplicates (by text, normalize...)
      return enrichedSuggestions.filter(
        (s) => !existingTexts.includes(normalized(s.text))
      );
    } catch (error) {
      console.error(
        "[GeminiWordRelationship] Error generating relationships:",
        error
      );
      return [];
    }
  }
}

import { EvaluationResult, BandScores } from './types'

/**
 * Remove instructional lines from a writing prompt.
 */
export function stripWritingPromptInstructions(input: string): string {
  const lines = input
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
  const instructionPatterns = [
    /^(\*\*[^*]+\*\*)$/,
    /you should spend about/i,
    /write at least/i,
    /write about the following topic/i,
    /write about the following chart/i,
    /give reasons for your answer/i,
    /include any relevant examples/i,
    /discuss both sides/i,
    /discuss both views/i,
    /give your own opinion/i,
    /write no more than/i,
    /write your answer in/i,
    /your answer should be/i,
    /please write your response/i,
    /use specific reasons and examples/i,
    /make sure to/i,
    /be sure to/i,
    /this is a/i,
    /remember to/i,
    /you are required to/i,
    /your essay should/i,
    /support your arguments/i,
    /provide examples/i,
    /at least \d+ words/i,
    /between \d+ and \d+ words/i,
    /around \d+ words/i,
    /approximately \d+ words/i,
    /you have \d+ minutes/i,
    /spend no more than \d+ minutes/i,
    /spend about \d+ minutes/i,
    /^task \d+:$/i,
    /^ielts writing task \d+$/i,
    /^toefl (integrated|independent) writing$/i,
    /^cefr writing$/i,
    /^toeic writing$/i,
    /^#\s+/,
    /You should write at least \d+ words/i,
    /You do not need to include your name or addresses/i,
    /Your response will be evaluated in terms of/i,
    /Task fulfillment, Organization, Vocabulary, and Grammar/i
  ]
  const filtered = lines.filter(
    (line) => !instructionPatterns.some((pattern) => pattern.test(line))
  )
  const cleaned = filtered.map((line) => line.replace(/^\*\*|\*\*$/g, '').trim())
  return cleaned.join('\n').trim()
}

/**
 * Count paragraphs by blocks separated by empty lines.
 */
export function countParagraphs(text: string): number {
  const lines = text.split('\n').map((line) => line.trim())
  let count = 0
  let inParagraph = false
  for (const line of lines) {
    if (line.length > 0) {
      if (!inParagraph) {
        count++
        inParagraph = true
      }
    } else {
      inParagraph = false
    }
  }
  return count
}

/**
 * Build the Gemini evaluation prompt given question and answer.
 */
export function buildEvaluationPrompt(question: string, answer: string): string {
  return `
You are an expert English writing examiner. Please evaluate the following essay according to the main criteria of IELTS, TOEFL, and VSTEP academic English writing tasks and return the result as a JSON object.

**Prompt:**
${question}

**Student's Answer:**
${answer}

**Evaluation Instructions:**
1. Assign an overall band score (0-9), AND 4 separate band scores (0-9, using .0 or .5 steps) for:
   - Task Response (TR): (how well the answer meets requirements)
   - Coherence & Cohesion (CC): (organization and flow)
   - Lexical Resource (LR): (vocabulary range and accuracy)
   - Grammatical Range & Accuracy (GRA): (grammar and structures)
2. Return these scores as a JSON object under the key "bandScores" with keys: overall, TR, CC, GRA, LR (all must be numbers).
3. Give an overall comment.
4. Provide detailed feedback for each criterion:
   - Task Achievement (How well the answer meets requirements)
   - Coherence & Cohesion (Organization and flow)
   - Lexical Resource (Vocabulary range and accuracy)
   - Grammatical Range & Accuracy (Grammar and structures)
5. List any spelling errors (with corrections/suggestions)
6. List any grammar errors (with explanation and correction)
7. Provide vocabulary suggestions for improvement (synonyms, more academic/formal words)
8. Statistics:
   - Word count
   - Sentence count
   - Lexical diversity (unique words/total words)
   - Grammar complexity (simple, intermediate, advanced)
9. Suggest 3-5 specific tips for overall improvement

10. **PARAGRAPH OPTIMIZATION (Important for this evaluation!):**
   - For each paragraph, return an object with:
     - paragraphIndex (number, e.g. 1 for first paragraph)
     - paragraphType: string, either "introduction", "body", or "conclusion" (identify what kind of paragraph this is)
     - original: the original paragraph text
     - optimized: rewrite the paragraph in improved/optimized English (focus on fluency, structure, and conciseness)
     - explanation: (brief, high-level summary of improvements in this paragraph)
     - errors: a list/array, where for each relevant sentence in the paragraph with issues, include:
         - original: the original sentence (as in the user's writing)
         - suggestion: an improved version of the sentence (if needed)
         - explanation: explain why it needs improvement or what was corrected

**Output format (JSON):**
{ ... }  // Only valid JSON, no extra formatting
`
}

function getBandScoreValue(bandObj: any, keys: string[], defaultValue = 0): number {
  for (const key of keys) {
    if (bandObj && bandObj[key] != null) {
      const val = bandObj[key]
      return typeof val === 'string' ? parseFloat(val) : Number(val)
    }
    const found = bandObj
      ? Object.keys(bandObj).find((k) => k.toLowerCase() === key.toLowerCase())
      : undefined
    if (found && bandObj[found] != null) {
      const val = bandObj[found]
      return typeof val === 'string' ? parseFloat(val) : Number(val)
    }
  }
  return defaultValue
}

/**
 * Parse the JSON result from Gemini evaluation.
 */
export function parseEvaluationResult(text: string): EvaluationResult {
  try {
    const jsonStart = text.indexOf('{')
    const jsonEnd = text.lastIndexOf('}') + 1
    const jsonString = text.substring(jsonStart, jsonEnd)
    const result = JSON.parse(jsonString)
    console.log('Parsed errors:', result.errors)
    console.log('Parsed paragraphOptimizations:', result.paragraphOptimizations)
    console.log('Parsed vocabularyHighlights:', result.vocabularyHighlights)

    // Flexible band score parsing
    const bandObj = result.bandScores || result.bandScore || result.band_scores || {}

    const extract = (keys: string[]) => getBandScoreValue(bandObj, keys, 0)

    return {
      score: result.score ?? 0,
      bandScores: {
        overall:
          typeof result.score === 'number' ? result.score : extract(['overall', 'total', 'band']),
        TR: extract(['TR', 'tr', 'taskResponse', 'task_response']),
        CC: extract(['CC', 'cc', 'coherenceCohesion', 'coherence_cohesion']),
        GRA: extract(['GRA', 'gra', 'grammaticalRangeAccuracy', 'grammar', 'grammatical']),
        LR: extract(['LR', 'lr', 'lexicalResource', 'lexical_resource'])
      },
      overallFeedback: result.overallFeedback ?? '',
      errors: result.errors ?? [],
      paragraphOptimizations: result.paragraphOptimizations ?? [],
      vocabularyHighlights: result.vocabularyHighlights ?? [],
      sentenceDiversifications: result.sentenceDiversifications ?? [],
      sampleEssays: result.sampleEssays ?? []
    }
  } catch (e) {
    console.error('Raw text that caused parsing error:', text)
    console.error('Error parsing evaluation result:', e)
    return {
      score: 0,
      bandScores: {
        overall: 0,
        TR: 0,
        CC: 0,
        GRA: 0,
        LR: 0
      },
      overallFeedback: 'Could not parse evaluation result',
      errors: [],
      paragraphOptimizations: [],
      vocabularyHighlights: [],
      sentenceDiversifications: [],
      sampleEssays: []
    }
  }
}

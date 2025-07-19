import { EvaluationResult } from './types'
import type { WritingError } from './types'

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
You are an expert English writing examiner. Please evaluate the following essay and return the result as a JSON object.

**Prompt:**
${question}

**Student's Answer:**
${answer}

**Evaluation Instructions:**
1. Assign an overall band score (0-9), AND 4 separate band scores (0-9, using .0 or .5 steps) for:
   - Task Response (TR)
   - Coherence & Cohesion (CC)
   - Lexical Resource (LR)
   - Grammatical Range & Accuracy (GRA)
   Return these scores under "bandScores" with keys: overall, TR, CC, GRA, LR (all numbers).

2. Analyze errors at different levels:
   A. WORD-LEVEL ERRORS (mark minimal spans):
      - Spelling: Incorrectly spelled words
      - Vocabulary: Wrong word choice, incorrect collocations
      - Punctuation: Missing/extra commas, periods, etc.
      - Grammar: Verb tense, subject-verb agreement, articles, etc.
   
   B. SENTENCE-LEVEL ERRORS (mark entire sentences only when):
      - Multiple word errors in one sentence
      - Structural issues requiring complete rewrite
      - Missing/extra sentences in paragraphs

   C. PARAGRAPH-LEVEL ISSUES (mark entire paragraphs only when):
      - Multiple problematic sentences
      - Missing paragraphs
      - Completely off-topic paragraphs

3. For each error, create an object with:
   - "id": Unique integer
   - "type": Error category
   - "original": Original text span
   - "corrected": Suggested correction
   - "explanation": Brief reason
   - "level": 'word', 'sentence', or 'paragraph'

4. Include an "annotatedText" field with:
   - <ERR id="{id}" type="{type}">error text</ERR> tags around errors
   - For paragraph-level issues: [Placeholder] tags
- Ensure <ERR> IDs start from 1 and follow the annotatedText sequence, so the first <ERR> tag in the text has id 1.
- Do not nest &lt;ERR&gt; tags; ensure tags do not overlap—use adjacent tags (&lt;ERR&gt;…&lt;/ERR&gt;&lt;ERR&gt;…&lt;/ERR&gt;) instead of nesting.

5. Error prioritization:
   - Prefer word-level marking when possible
   - Only mark sentence/paragraph when absolutely necessary
   - For overlapping errors, mark the largest meaningful unit

**Output format (JSON):**
{
  "bandScores": { ... },
  "errors": [ ... ],
  "annotatedText": "...",
  "overallFeedback": "...",
  ... // other fields
}

**Important:**
- Output ONLY valid JSON, no additional text
- For word-level errors, mark ONLY the affected word(s)
- For sentence/paragraph errors, ENTIRE unit must be marked
- Use exact text matching from student's answer
**Important:**
  - For overlapping errors, report ONLY the most significant error
  - Avoid reporting multiple errors on the same text span
  - Prioritize sentence-level errors over word-level errors when appropriate
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
export function parseEvaluationResult(text: string, answer: string): EvaluationResult {
  try {
    // Extract JSON from optional ```json``` fences or raw text
    const fenceMatch = text.match(/```json\s*([\s\S]*?)\s*```/i)
    let jsonString = fenceMatch ? fenceMatch[1] : text
    // Strip backticks and control characters, then fix trailing commas
    jsonString = jsonString
      .replace(/`/g, '')
      .replace(/[\u0000-\u001F]+/g, ' ')
      .replace(/,\s*([}\]])/g, '$1')
    const result = JSON.parse(jsonString)

    // Merge spellingErrors and grammarErrors into a single array of WritingError
    const spellingErrorsRaw: any[] = result.spellingErrors ?? []
    const grammarErrorsRaw: any[] = result.grammarErrors ?? []
    const combinedErrors: WritingError[] = []
    let idCounter = 1

    spellingErrorsRaw.forEach((e) => {
      const originalText = e.original ?? e.error ?? ''
      const correctedText = e.suggestion ?? e.correction ?? ''
      combinedErrors.push({
        id: idCounter++,
        type: 'spelling',
        original: originalText,
        corrected: correctedText,
        explanation: e.explanation || 'Spelling error',
        startPos: 0,
        endPos: originalText.length
      })
    })
    grammarErrorsRaw.forEach((e) => {
      const originalText = e.original ?? e.error ?? ''
      const correctedText = e.suggestion ?? e.correction ?? ''
      combinedErrors.push({
        id: idCounter++,
        type: 'grammar',
        original: originalText,
        corrected: correctedText,
        explanation: e.explanation || 'Grammar error',
        startPos: 0,
        endPos: originalText.length
      })
    })
    // Include any other errors array entries
    if (Array.isArray(result.errors)) {
      result.errors.forEach((e: WritingError) => combinedErrors.push(e))
    }
    console.log('Parsed errors:', result.errors)
    console.log('Parsed paragraphOptimizations:', result.paragraphOptimizations)
    console.log('Parsed vocabularyHighlights:', result.vocabularyHighlights)

    // Keep all errors as provided without merging by span/type
    const processedErrors: WritingError[] = combinedErrors.slice()

    // Compute actual start/end positions based on the original answer string
    processedErrors.forEach((error) => {
      const pos = answer.indexOf(error.original)
      if (pos >= 0) {
        error.startPos = pos
        error.endPos = pos + error.original.length
      }
    })

    // Debug: log each error's computed position
    console.log('parseEvaluationResult — total errors:', processedErrors.length)
    processedErrors.forEach((e) =>
      console.log(`Error id=${e.id} original="${e.original}" start=${e.startPos} end=${e.endPos}`)
    )

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
      errors: processedErrors,
      paragraphOptimizations: result.paragraphOptimizations ?? [],
      vocabularyHighlights: result.vocabularyHighlights ?? [],
      sentenceDiversifications: result.sentenceDiversifications ?? [],
      sampleEssays: result.sampleEssays ?? [],
      // Include annotatedText if provided by the evaluation result
      annotatedText: typeof result.annotatedText === 'string' ? result.annotatedText : undefined
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

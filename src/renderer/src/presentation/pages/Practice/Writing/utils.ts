import { EvaluationResult } from './types'
import type { WritingError } from './types'

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
 * IELTS Task 1 Prompt Builder (chart description).
 */
export function buildIeltsTask1EvaluationPrompt(question: string, answer: string): string {
  return `
CRITICAL INSTRUCTIONS FOR TASK 1 WRITING EVALUATION

You are an expert IELTS Writing Task 1 examiner with 10+ years experience. Evaluate the report STRICTLY following these rules:

### 1. SCORING (0-9 scale, .5 increments)
- Overall Band: Holistic assessment
- Task Achievement: Addresses task fully? Accurate overview and data comparison.
- Coherence & Cohesion: Logical flow, grouping, and linking words.
- Lexical Resource: Range and accuracy of vocabulary.
- Grammatical Accuracy: Sentence structures and correctness.

Output as NUMBERS:
{
  "bandScores": {
    "overall": 6.5,
    "TaskAchievement": 7.0,
    "CC": 6.0,
    "LR": 6.5,
    "GRA": 5.5
  }
}

### 2. ERROR MARKING PROTOCOL (STRICT HIERARCHY)
- Use same word-level and sentence-level rules as Task 2.

### 3. OUTPUT FORMAT (STRICT JSON ONLY)
{
  "bandScores": { ... },
  "errors": [ ... ],
  "annotatedText": "...",
  "overallFeedback": "...",
  "vocabularyHighlights": [...],
  "sentenceDiversifications": [...]
}

**Prompt:**
${question}

**Student's Answer:**
${answer}

BEGIN EVALUATION NOW:
`
}

/**
 * IELTS Task 2 Prompt Builder (essay).
 */
export function buildIeltsTask2EvaluationPrompt(question: string, answer: string): string {
  return `
IELTS TASK 2 WRITING EVALUATION - COMPREHENSIVE ERROR DETECTION SYSTEM

You are an expert IELTS examiner with 15+ years of experience evaluating Vietnamese learners' essays. Follow this detailed protocol:

## SECTION 1: SYSTEMATIC ERROR CATEGORIES WITH EXAMPLES

### A. SPELLING ERRORS (Type: "spelling")
**Common patterns from Vietnamese learners:**
- Double letters: "yearss" → "years", "programms" → "programs"
- Letter confusion: "mandetory" → "mandatory", "recieve" → "receive" 
- Omissions: "comunication" → "communication", "problmes" → "problems"
- Compound words: "highschool" → "high school", "lifeskills" → "life skills"
- Capitalization: "i" → "I"

### B. GRAMMAR ERRORS (Type: "grammar")
**High-priority patterns:**
1. **Subject-verb agreement**: 
   - "service equip students" → "service equips students"
   - "Participating in volunteer work foster" → "fosters"
2. **Article errors**:
   - "should be mandetory part" → "should be a mandatory part"
   - "helping eldery" → "helping the elderly"
3. **Missing prepositions/conjunctions**:
   - "agree integrate" → "agree with integrating" / "agree that integrating"
   - "argued that forcing" → "argue that forcing"
4. **Infinitive structures**:
   - "encourages them take" → "encourages them to take"
   - "could volunteers" → "could volunteer"
5. **Pronoun case**:
   - "prepare they better" → "prepare them better"
6. **Possessive markers**:
   - "students interest" → "students' interests"
7. **Comma usage**:
   - "However with proper planning" → "However, with proper planning"
8. **Relative clauses**:
   - "programs match students interest" → "programs that match students' interests"

### C. VOCABULARY ERRORS (Type: "vocabulary") 
**Word form and choice issues:**
- Word form: "academical" → "academic", "voluntar" → "volunteer"
- Plural forms: "benefit" → "benefits", "peoples" → "people"
- Compound adjectives: "well rounded" → "well-rounded"
- Collocation: "big rain" → "heavy rain", "real world problmes" → "real-world issues"

### D. PUNCTUATION ERRORS (Type: "punctuation")
- Missing commas after conjunctive adverbs: "However with" → "However, with"
- Missing commas in compound sentences
- Incorrect apostrophe usage

## SECTION 2: SAMPLE EVALUATION DEMONSTRATION

**Sample Text:** "In recent yearss there is growing debates about whether unpaid community servise should be mandetory part of education."

**Sample Analysis:**
\\\`\\\`\\\`json
{
  "errors": [
    {
      "id": 1,
      "type": "spelling",
      "original": "yearss",
      "corrected": "years",
      "explanation": "extra 's' - double letter error",
      "level": "word"
    },
    {
      "id": 2,
      "type": "grammar", 
      "original": "there is growing debates",
      "corrected": "there are growing debates",
      "explanation": "subject-verb disagreement - 'debates' is plural",
      "level": "word"
    },
    {
      "id": 3,
      "type": "spelling",
      "original": "servise",
      "corrected": "service",
      "explanation": "incorrect spelling - 'c' not 's'",
      "level": "word"
    },
    {
      "id": 4,
      "type": "grammar",
      "original": "should be mandetory part",
      "corrected": "should be a mandatory part",
      "explanation": "missing indefinite article 'a'",
      "level": "word"
    }
  ],
  "annotatedText": "In recent <ERR id=\\"1\\" type=\\"spelling\\">yearss</ERR> <ERR id=\\"2\\" type=\\"grammar\\">there is growing debates</ERR> about whether unpaid community <ERR id=\\"3\\" type=\\"spelling\\">servise</ERR> <ERR id=\\"4\\" type=\\"grammar\\">should be mandetory part</ERR> of education."
}
\\\`\\\`\\\`

## SECTION 3: DETAILED ANNOTATION RULES

### ERROR IDENTIFICATION PROTOCOL:
1. **Confidence threshold**: Mark errors only with 98%+ certainty
2. **Minimal span principle**: Mark ONLY the smallest text containing the error
3. **Original text preservation**: Use EXACT case-sensitive text from student essay
4. **Error type assignment**: Choose ONE most appropriate type per error
5. **Correction principle**: Fix ONLY the specific error, don't rephrase

### ANNOTATED TEXT FORMATTING:
- **Correct format**: <ERR id="1" type="spelling">mispeled</ERR>
- **Rules**:
  - Use sequential numbering (1, 2, 3...)
  - NO nested tags
  - NO overlapping spans
  - Preserve ALL original spacing, line breaks, punctuation
  - Use double quotes for attributes

### ERROR EXPLANATION GUIDELINES:
- **Spelling**: "extra letter", "missing 'c'", "wrong vowel"
- **Grammar**: "subject-verb disagreement", "missing article", "wrong preposition"
- **Vocabulary**: "wrong word form", "incorrect collocation", "word choice"
- **Punctuation**: "missing comma", "incorrect apostrophe"

## SECTION 4: SYSTEMATIC ERROR PATTERNS TO PRIORITIZE
...

## SECTION 5: BAND SCORE CORRELATION
...

## SECTION 6: OUTPUT FORMAT REQUIREMENTS

**MANDATORY JSON STRUCTURE:**
\\\`\\\`\\\`json
{
  "bandScores": {
    "overall": 6.5,
    "TR": 7.0,
    "CC": 6.0, 
    "LR": 6.5,
    "GRA": 5.5
  },
  "errors": [
    {
      "id": 1,
      "type": "spelling|grammar|vocabulary|punctuation",
      "original": "exact text from essay",
      "corrected": "minimal correction",
      "explanation": "brief reason (3-8 words)",
      "level": "word"
    }
  ],
  "annotatedText": "Full essay with <ERR> tags",
  "overallFeedback": "2-3 specific improvement suggestions",
  "vocabularyHighlights": ["3-5 well-used advanced words"],
  "sentenceDiversifications": ["1-2 specific sentence improvement suggestions"]
}
\\\`\\\`\\\`

## SECTION 7: QUALITY ASSURANCE CHECKLIST
...

---

**Essay Prompt:** 
${question}

**Student Essay to Analyze:**
${answer}

**BEGIN COMPREHENSIVE ANALYSIS - RETURN VALID JSON ONLY:**
`
}

/**
 * TOEIC Task 1 Prompt Builder (Email/Letter).
 */
export function buildToeicTask1EvaluationPrompt(question: string, answer: string): string {
  return `
CRITICAL INSTRUCTIONS FOR TOEIC WRITING TASK 1 (EMAIL/LETTER)

You are an expert TOEIC Writing examiner. Evaluate the email/letter STRICTLY following these rules:

### 1. SCORING (0-5 scale)
- Content: Completeness of response (all points addressed)
- Organization: Logical structure and paragraphing
- Vocabulary: Appropriateness and range
- Grammar: Accuracy and sentence structures

Output as NUMBERS:
{
  "bandScores": {
    "overall": 4.0,
    "Content": 4.0,
    "Organization": 3.5,
    "Vocabulary": 4.5,
    "Grammar": 3.0
  }
}

### 2. ERROR MARKING (SAME AS IELTS)
- Use same word/sentence level rules as IELTS Task 2

### 3. SPECIAL FOCUS FOR EMAIL/LETTER
✓ Appropriate greeting and closing
✓ Clear purpose statement
✓ Formal/informal tone consistency
✓ Paragraph structure (intro-body-conclusion)

**Prompt:**
${question}

**Student's Answer:**
${answer}

BEGIN EVALUATION NOW:
`
}

/**
 * TOEIC Task 2 Prompt Builder (Opinion Essay).
 */
export function buildToeicTask2EvaluationPrompt(question: string, answer: string): string {
  return `
CRITICAL INSTRUCTIONS FOR TOEIC WRITING TASK 2 (OPINION ESSAY)

You are an expert TOEIC Writing examiner. Evaluate the opinion essay STRICTLY following these rules:

### 1. SCORING (0-5 scale)
- Content: Relevance to prompt and argument development
- Organization: Logical flow and cohesion
- Vocabulary: Range and appropriateness
- Grammar: Accuracy and complexity

### 2. SPECIAL REQUIREMENTS
✓ Clear position statement
✓ 2-3 supporting arguments
✓ Counterargument (if appropriate)
✓ Concluding summary

**Prompt:**  
${question}

**Student's Answer:**  
${answer}

BEGIN EVALUATION NOW:
`
}

/**
 * TOEFL Task 1 Prompt Builder (Integrated).
 */
export function buildToeflTask1EvaluationPrompt(question: string, answer: string): string {
  return `
CRITICAL INSTRUCTIONS FOR TOEFL INTEGRATED WRITING

You are an expert TOEFL Writing examiner. Evaluate the integrated response STRICTLY following these rules:

### 1. SCORING (0-5 scale)
- Content: Accuracy in summarizing lecture and relationship to reading
- Organization: Logical structure and coherence
- Vocabulary: Academic appropriateness
- Grammar: Accuracy in complex sentences

### 2. SPECIAL FOCUS
✓ Accurate representation of lecture points
✓ Clear connection to reading passage
✓ Paraphrasing (not copying)
✓ Synthesis of information

**Prompt:**
${question}

**Student's Answer:**
${answer}

BEGIN EVALUATION NOW:
`
}

/**
 * TOEFL Task 2 Prompt Builder (Independent).
 */
export function buildToeflTask2EvaluationPrompt(question: string, answer: string): string {
  return `
CRITICAL INSTRUCTIONS FOR TOEFL INDEPENDENT WRITING

You are an expert TOEFL Writing examiner. Evaluate the independent essay STRICTLY following these rules:

### 1. SCORING (0-5 scale)
- Development: Depth of ideas and examples
- Organization: Logical structure and transitions
- Language: Vocabulary range and accuracy
- Grammar: Sentence structure variety

### 2. SPECIAL REQUIREMENTS
✓ Clear thesis statement
✓ Well-developed paragraphs with specific examples
✓ Academic vocabulary
✓ Varied sentence structures

**Prompt:**
${question}

**Student's Answer:**
${answer}

BEGIN EVALUATION NOW:
`
}

/**
 * PTE Task 1 Prompt Builder (Summarize Written Text).
 */
export function buildPteTask1EvaluationPrompt(question: string, answer: string): string {
  return `
CRITICAL INSTRUCTIONS FOR PTE SUMMARIZE WRITTEN TEXT

You are an expert PTE Writing examiner. Evaluate the summary STRICTLY following these rules:

### 1. SCORING CRITERIA
- Content: Inclusion of main points
- Form: Single sentence (5-75 words)
- Vocabulary: Appropriate word choice
- Grammar: Correct sentence structure

### 2. SPECIAL FOCUS
✓ One sentence only
✓ Includes all key points
✓ Proper academic vocabulary
✓ Grammatically complex sentence

**Prompt:**
${question}

**Student's Answer:**
${answer}

BEGIN EVALUATION NOW:
`
}

/**
 * PTE Task 2 Prompt Builder (Essay).
 */
export function buildPteTask2EvaluationPrompt(question: string, answer: string): string {
  return `
CRITICAL INSTRUCTIONS FOR PTE ESSAY WRITING

You are an expert PTE Writing examiner. Evaluate the essay STRICTLY following these rules:

### 1. SCORING (0-3 scale per criterion)
- Content: Relevance to prompt
- Form: 200-300 words
- Development: Structure and coherence
- Grammar: Accuracy and range
- Vocabulary: Appropriateness and range
- Spelling: Correct spelling

### 2. SPECIAL REQUIREMENTS
✓ Strict word count adherence
✓ Clear position and arguments
✓ Academic style
✓ Error-free sentences

**Prompt:**
${question}

**Student's Answer:**
${answer}

BEGIN EVALUATION NOW:
`
}

/**
 * VSTEP Task 1 Prompt Builder (Letter).
 */
export function buildVstepTask1EvaluationPrompt(question: string, answer: string): string {
  return `
CRITICAL INSTRUCTIONS FOR VSTEP LETTER WRITING (B1-B2 LEVEL)

You are an expert VSTEP examiner. Evaluate the letter STRICTLY following these rules:

### 1. SCORING (0-10 scale)
- Task Fulfillment: Complete all required points
- Organization: Logical paragraph structure
- Language: Appropriate vocabulary and grammar
- Register: Formal/informal consistency

### 2. SPECIAL FOCUS
✓ Appropriate opening/closing
✓ Clear purpose statement
✓ Vietnamese cultural context awareness
✓ Error tolerance (B1 level)

**Prompt:**
${question}

**Student's Answer:**
${answer}

BEGIN EVALUATION NOW:
`
}

/**
 * VSTEP Task 2 Prompt Builder (Essay).
 */
export function buildVstepTask2EvaluationPrompt(question: string, answer: string): string {
  return `
CRITICAL INSTRUCTIONS FOR VSTEP ESSAY WRITING (B1-C1 LEVEL)

You are an expert VSTEP examiner. Evaluate the essay STRICTLY following these rules:

### 1. SCORING (0-10 scale)
- Content: Relevance and development
- Organization: Logical structure
- Vocabulary: Range and accuracy
- Grammar: Complexity and accuracy
- Mechanics: Spelling and punctuation

### 2. LEVEL ADJUSTMENT
✓ B1: Basic arguments, simple sentences
✓ B2: Developed arguments, compound sentences
✓ C1: Complex arguments, advanced structures

**Prompt:**
${question}

**Student's Answer:**
${answer}

BEGIN EVALUATION NOW:
`
}

/**
 * Mapping of all prompt builders.
 */
export const evaluationPromptBuilders: Record<
  string,
  (question: string, answer: string) => string
> = {
  IELTS_task1: buildIeltsTask1EvaluationPrompt,
  IELTS_task2: buildIeltsTask2EvaluationPrompt,
  TOEIC_task1: buildToeicTask1EvaluationPrompt,
  TOEIC_task2: buildToeicTask2EvaluationPrompt,
  TOEFL_task1: buildToeflTask1EvaluationPrompt,
  TOEFL_task2: buildToeflTask2EvaluationPrompt,
  PTE_task1: buildPteTask1EvaluationPrompt,
  PTE_task2: buildPteTask2EvaluationPrompt,
  VSTEP_task1: buildVstepTask1EvaluationPrompt,
  VSTEP_task2: buildVstepTask2EvaluationPrompt
}

/**
 * Build an evaluation prompt dynamically based on task key.
 */
export function buildEvaluationPrompt(taskKey: string, question: string, answer: string): string {
  const builder = evaluationPromptBuilders[taskKey] || buildIeltsTask2EvaluationPrompt
  return builder(question, answer)
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
    console.log('Raw AI output:', text)
    // Extract JSON from optional ```json``` fences or raw text
    const fenceMatch = text.match(/```json\s*([\s\S]*?)\s*```/i)
    let jsonString = fenceMatch ? fenceMatch[1] : text
    // Strip backticks and control characters, then fix trailing commas
    jsonString = jsonString
      .replace(/`/g, '')
      .replace(/[\u0000-\u001F]+/g, ' ')
      .replace(/,\s*([}\]])/g, '$1')
    const result = JSON.parse(jsonString)
    console.log('Parsed AI JSON result:', result)

    // Build errors from annotatedText if available, else fallback to raw result.errors
    const rawErrors: WritingError[] = Array.isArray(result.errors)
      ? (result.errors as WritingError[])
      : []
    let errors: WritingError[] = []
    if (typeof result.annotatedText === 'string') {
      const annErrors: WritingError[] = []
      const tagRe = /<ERR id="(\d+)" type="(\w+)">([\s\S]*?)<\/ERR>/g
      let match: RegExpExecArray | null
      while ((match = tagRe.exec(result.annotatedText))) {
        const id = Number(match[1])
        const type = match[2] as WritingError['type']
        const original = match[3]
        const detail = rawErrors.find((e) => e.id === id)
        const pos = answer.indexOf(original)
        annErrors.push({
          id,
          type,
          original,
          corrected: detail?.corrected ?? '',
          explanation: detail?.explanation ?? '',
          startPos: pos >= 0 ? pos : 0,
          endPos: pos >= 0 ? pos + original.length : original.length
        })
      }
      errors = annErrors
    } else {
      errors = rawErrors.map((e) => {
        const pos = answer.indexOf(e.original)
        return {
          ...e,
          startPos: pos >= 0 ? pos : 0,
          endPos: pos >= 0 ? pos + e.original.length : e.original.length
        }
      })
    }

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
        GRA: extract(['GRA', 'gra', 'grammaticalRangeAccuracy', 'grammar']),
        LR: extract(['LR', 'lr', 'lexicalResource', 'lexical_resource'])
      },
      overallFeedback: result.overallFeedback ?? '',
      errors,
      paragraphOptimizations: result.paragraphOptimizations ?? [],
      vocabularyHighlights: result.vocabularyHighlights ?? [],
      sentenceDiversifications: result.sentenceDiversifications ?? [],
      sampleEssays: result.sampleEssays ?? [],
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
      sampleEssays: [],
      annotatedText: undefined
    }
  }
}

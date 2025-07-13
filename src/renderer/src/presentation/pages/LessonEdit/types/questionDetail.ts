export interface ChoiceOneOption {
  id: string
  is_correct: boolean
  option: string
}
export interface ChoiceOneQuestion {
  id: string
  question: string
  explain: string
}

export interface ChoiceMultiOption {
  id: string
  is_correct: boolean
  option: string
}
export interface ChoiceMultiQuestion {
  id: string
  question: string
  explain: string
}

export interface ListeningQuestionDetail {
  audio_url?: string
  image_urls?: string[]
  transcript?: string
}

export interface ReadingQuestionDetail {
  title?: string
  passage?: string
  image_urls?: string[]
}

export interface FillInBlankQuestion {
  question: string
}
export interface FillInBlankAnswer {
  answer: string
  explain: string
}

export interface MatchingItem {
  question: string
  answer: string
  explain: string
}

export type TrueFalseNotGivenAnswer = 'TRUE' | 'FALSE' | 'NOT_GIVEN'
export interface TrueFalseNotGivenItem {
  question: string
  answer: TrueFalseNotGivenAnswer
  explain: string
}

export interface ErrorIdentificationQuestion {
  question: string
}
export interface ErrorIdentificationAnswer {
  error_word: string
  correct_word: string
  explain: string
}

export interface SentenceCompletionItem {
  original_sentence: string
  start_phrase: string
  middle_phrase: string | null
  end_phrase: string | null
  true_sentences: string[]
  explain: string
}

export interface ConversationalRepetition {
  title: string
  overview: string
}
export interface ConversationalRepetitionQAItem {
  question: string
  answer: string
  mean_of_question: string
  mean_of_answer: string
}

export interface OpenConversation {
  title: string
  overview: string
  example_conversation: string
}

export interface OpenParagraph {
  example_paragraph: string
  mean_example_paragraph: string
  tips?: string[]
}

export interface ReadingDetail {
  title?: string
  passage: string
  image_urls?: string[]
}

export interface QuestionDetail {
  id: string
  creator_id: string
  creator_role: string
  status: string
  skill: SkillType
  type: QuestionType
  level: LevelType
  score: number
  topic: string[]
  tags: string[]
  version: number

  // Choice One
  choice_one_options?: ChoiceOneOption[]
  choice_one_question?: ChoiceOneQuestion

  // Choice Multi
  choice_multi_options?: ChoiceMultiOption[]
  choice_multi_question?: ChoiceMultiQuestion

  // Listening
  listening_question_detail?: ListeningQuestionDetail

  // Reading
  reading_question_detail?: ReadingQuestionDetail

  // Fill in the blank
  fill_in_the_blank_question?: FillInBlankQuestion
  fill_in_the_blank_answers?: FillInBlankAnswer[]

  // Matching
  matchings?: MatchingItem[]

  // True/False/Not Given
  true_false_not_givens?: TrueFalseNotGivenItem[]

  // Error Identification
  error_identification_question?: ErrorIdentificationQuestion
  error_identification_answers?: ErrorIdentificationAnswer[]

  // Sentence Completion
  sentence_completions?: SentenceCompletionItem[]

  // Conversational Repetition
  conversational_repetition?: ConversationalRepetition
  conversational_repetition_qa?: ConversationalRepetitionQAItem[]

  // Open Conversation
  open_conversation?: OpenConversation

  // Open Paragraph
  open_paragraph?: OpenParagraph
}

export type SkillType = 'listening' | 'reading' | 'grammar' | 'speaking' | 'writing' | 'vocabulary'

export type QuestionType =
  | 'fill_in_the_blank'
  | 'choice_one'
  | 'choice_multi'
  | 'matching'
  | 'true_false_not_given'
  | 'error_identification'
  | 'sentence_completion'
  | 'word_repetition'
  | 'phrase_repetition'
  | 'conversational_repetition'
  | 'open_conversation'
  | 'open_paragraph'

export type LevelType = 'beginner' | 'intermediate' | 'advanced'

interface Skill {
  value: string
  label: string
  color: string
  description: string
}
export const SKILLS: Skill[] = [
  {
    value: 'listening',
    label: 'Listening',
    color: '#FF6B6B',
    description: 'Practice listening and understanding audio content'
  },
  {
    value: 'reading',
    label: 'Reading',
    color: '#4ECDC4',
    description: 'Improve reading comprehension and vocabulary'
  },
  {
    value: 'grammar',
    label: 'Grammar',
    color: '#6366F1',
    description: 'Master grammar rules and structures'
  },
  {
    value: 'speaking',
    label: 'Speaking',
    color: '#96CEB4',
    description: 'Develop speaking fluency and pronunciation'
  },
  {
    value: 'writing',
    label: 'Writing',
    color: '#45B7D1',
    description: 'Enhance writing skills and coherence'
  },
  {
    value: 'vocabulary',
    label: 'Vocabulary',
    color: '#FBBF24',
    description: 'Expand and master vocabulary usage'
  }
]

export interface QuestionTypeInfo {
  label: string
  overview: string
}
export const QUESTION_TYPES: Record<QuestionType, QuestionTypeInfo> = {
  fill_in_the_blank: {
    label: 'Fill in the blank',
    overview: 'Điền từ thích hợp vào chỗ trống để hoàn thành câu'
  },
  choice_one: {
    label: 'Single choice',
    overview: 'Chọn một đáp án đúng từ nhiều lựa chọn'
  },
  choice_multi: {
    label: 'Multiple choice',
    overview: 'Chọn nhiều đáp án đúng từ các lựa chọn'
  },
  matching: {
    label: 'Matching',
    overview: 'Ghép nối các cặp thông tin tương ứng'
  },
  true_false_not_given: {
    label: 'True/False/Not Given',
    overview: 'Xác định tính đúng sai của câu dựa trên thông tin cho trước'
  },
  error_identification: {
    label: 'Error Identification',
    overview: 'Xác định lỗi ngữ pháp trong câu'
  },
  sentence_completion: {
    label: 'Sentence Completion',
    overview: 'Hoàn thành câu với cấu trúc phù hợp'
  },
  word_repetition: {
    label: 'Word Repetition',
    overview: 'Lặp lại từ theo phát âm chuẩn'
  },
  phrase_repetition: {
    label: 'Phrase Repetition',
    overview: 'Lặp lại cụm từ theo phát âm chuẩn'
  },
  conversational_repetition: {
    label: 'Conversation Repetition',
    overview: 'Lặp lại đoạn hội thoại theo phát âm chuẩn'
  },
  open_conversation: {
    label: 'Open Conversation',
    overview: 'Thực hành hội thoại tự do về chủ đề cho trước'
  },
  open_paragraph: {
    label: 'Open Paragraph',
    overview: 'Viết đoạn văn về chủ đề cho trước'
  }
}
export const LEVELS: { value: LevelType; label: string; color: string }[] = [
  { value: 'beginner', label: 'Cơ bản', color: '#FF6B6B' },
  { value: 'intermediate', label: 'Trung cấp', color: '#4ECDC4' },
  { value: 'advanced', label: 'Nâng cao', color: '#45B7D1' }
]
// Type for rich question definition
export interface QuestionDefinition {
  type: string
  name: string
  skills: SkillType[]
  purpose: string
  icon: string
  color: string
}

// Rich definitions of 25 question types as in requirements
export const QUESTION_DEFINITIONS: QuestionDefinition[] = [
  {
    type: 'fill_in_the_blank',
    name: 'Fill in the Blank',
    skills: ['listening', 'reading', 'grammar'],
    purpose: 'Test vocabulary, grammar, and detailed listening comprehension.',
    icon: 'LucideDot',
    color: '#FFA500'
  },
  {
    type: 'choice_one',
    name: 'Multiple Choice - Single Answer',
    skills: ['listening', 'reading', 'grammar'],
    purpose: 'Assess context understanding, vocabulary, and basic grammar knowledge.',
    icon: 'LucideCircleDot',
    color: '#007BFF'
  },
  {
    type: 'choice_multi',
    name: 'Multiple Choice - Multi Answer',
    skills: ['listening', 'reading'],
    purpose: 'Develop skills for analyzing multi-faceted information.',
    icon: 'LucideListTodo',
    color: '#4ECDC4'
  },
  {
    type: 'true_false_not_given',
    name: 'True/False/Not Given',
    skills: ['listening', 'reading'],
    purpose: 'Practice reasoning and information verification skills.',
    icon: 'LucideCheckCheck',
    color: '#16A34A'
  },
  {
    type: 'matching',
    name: 'Matching',
    skills: ['listening', 'reading'],
    purpose: 'Practice connecting ideas, vocabulary, or images with definitions.',
    icon: 'LucideLink2',
    color: '#6366F1'
  },
  {
    type: 'error_identification',
    name: 'Error Identification',
    skills: ['grammar', 'writing'],
    purpose: 'Improve accuracy in grammar and sentence structure.',
    icon: 'LucideBug',
    color: '#EF4444'
  },
  {
    type: 'sentence_rearrangement',
    name: 'Sentence Rearrangement',
    skills: ['reading', 'writing'],
    purpose: 'Understand paragraph structure and logical idea organization.',
    icon: 'LucideMoveUpRight',
    color: '#F59E42'
  },
  {
    type: 'summarization',
    name: 'Summarization',
    skills: ['reading', 'writing'],
    purpose: 'Practice filtering and briefly presenting information.',
    icon: 'LucideFileText',
    color: '#38BDF8'
  },
  {
    type: 'dictation',
    name: 'Dictation',
    skills: ['listening', 'writing'],
    purpose: 'Practice attentive listening and accurate writing.',
    icon: 'LucideClipboardEdit',
    color: '#F472B6'
  },
  {
    type: 'shadowing',
    name: 'Shadowing',
    skills: ['speaking', 'listening'],
    purpose: 'Improve pronunciation, intonation, and listening-speaking response.',
    icon: 'LucideMic',
    color: '#6366F1'
  },
  {
    type: 'role_play',
    name: 'Role-play',
    skills: ['speaking'],
    purpose: 'Develop communication skills for real-life scenarios.',
    icon: 'LucideUsersRound',
    color: '#52AAA5'
  },
  {
    type: 'picture_description',
    name: 'Picture Description',
    skills: ['speaking', 'writing'],
    purpose: 'Boost observation and descriptive language skills.',
    icon: 'LucideImage',
    color: '#FBBF24'
  },
  {
    type: 'debate',
    name: 'Debate',
    skills: ['speaking', 'listening'],
    purpose: 'Practice critical thinking and persuasion.',
    icon: 'LucideGavel',
    color: '#2563EB'
  },
  {
    type: 'storytelling',
    name: 'Storytelling',
    skills: ['speaking', 'writing'],
    purpose: 'Develop creativity and coherent storytelling.',
    icon: 'LucideBookOpen',
    color: '#F9A8D4'
  },
  {
    type: 'paraphrasing',
    name: 'Paraphrasing',
    skills: ['writing', 'reading'],
    purpose: 'Deepen understanding and express content flexibly.',
    icon: 'LucideRepeat2',
    color: '#7C3AED'
  },
  {
    type: 'translation',
    name: 'Translation',
    skills: ['reading', 'writing'],
    purpose: 'Increase knowledge of language and cultural differences.',
    icon: 'LucideLanguages',
    color: '#E11D48'
  },
  {
    type: 'word_form',
    name: 'Word Form',
    skills: ['grammar'],
    purpose: 'Master the use of word forms (noun, verb, adjective, etc).',
    icon: 'LucideAtom',
    color: '#94A3B8'
  },
  {
    type: 'synonym_antonym',
    name: 'Synonym/Antonym',
    skills: ['vocabulary'],
    purpose: 'Expand vocabulary and flexible word usage.',
    icon: 'LucideShuffle',
    color: '#FBBF24'
  },
  {
    type: 'conversation_completion',
    name: 'Conversation Completion',
    skills: ['speaking', 'listening'],
    purpose: 'Practice real-time communication in everyday contexts.',
    icon: 'LucideMessageCircle',
    color: '#059669'
  },
  {
    type: 'pronunciation_check',
    name: 'Pronunciation Check',
    skills: ['speaking'],
    purpose: 'Correct pronunciation errors and practice standard speaking.',
    icon: 'LucideVolume2',
    color: '#EAB308'
  },
  {
    type: 'grammar_transformation',
    name: 'Grammar Transformation',
    skills: ['grammar'],
    purpose: 'Master complex grammar structures.',
    icon: 'LucideFunctionSquare',
    color: '#6366F1'
  },
  {
    type: 'contextual_cloze',
    name: 'Contextual Cloze',
    skills: ['reading', 'vocabulary'],
    purpose: 'Understand word use in specific contexts.',
    icon: 'LucideAlignJustify',
    color: '#14B8A6'
  },
  {
    type: 'listening_for_gist',
    name: 'Listening for Gist',
    skills: ['listening'],
    purpose: 'Develop listening skills for main ideas.',
    icon: 'LucideEar',
    color: '#A3E635'
  },
  {
    type: 'listening_for_details',
    name: 'Listening for Details',
    skills: ['listening'],
    purpose: 'Practice listening for specific details (numbers, names, etc).',
    icon: 'LucideListMusic',
    color: '#6366F1'
  },
  {
    type: 'inference_questions',
    name: 'Inference Questions',
    skills: ['reading', 'listening'],
    purpose: 'Practice reasoning from implicit information.',
    icon: 'LucideHelpCircle',
    color: '#F59E42'
  }
]

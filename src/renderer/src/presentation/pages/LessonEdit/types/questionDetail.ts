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

export type SkillType =
  | 'reading'
  | 'listening'
  | 'writing'
  | 'grammar'
  | 'social'
  | 'vocabulary'
  | 'speaking'

export type QuestionType =
  | 'shadow_words'
  | 'shadow_script_dialogue'
  | 'gap_in_dialogue'
  | 'choice_dialogue'
  | 'chatting'
  | 'translate'
  | 'reverse_translation'
  | 'gap_fill_listening'
  | 'gap_fill_reading'
  | 'choice_one_listening'
  | 'choice_one_reading'
  | 'choice_multi_listening'
  | 'choice_multi_reading'
  | 'matching_listening'
  | 'matching_reading'
  | 'true_false_not_given_listening'
  | 'true_false_not_given_reading'
  | 'ipa_assembly'
  | 'lexical_fix'
  | 'grammar_transformation'
  | 'pronunciation_verification'
  | 'dictation'
  | 'ipa_reconstruction'
  | 'writing_task'
  | 'speaking_task'
  | 'sentence_puzzle'

export type LevelType = 'beginner' | 'intermediate' | 'advanced'

interface Skill {
  value: string
  label: string
  color: string
  description: string
}
export const SKILLS: Skill[] = [
  {
    value: 'reading',
    label: 'Reading',
    color: '#4ECDC4',
    description: 'Improve reading comprehension and vocabulary'
  },
  {
    value: 'listening',
    label: 'Listening',
    color: '#FF6B6B',
    description: 'Practice listening and understanding audio content'
  },
  {
    value: 'writing',
    label: 'Writing',
    color: '#45B7D1',
    description: 'Enhance writing skills and coherence'
  },
  {
    value: 'grammar',
    label: 'Grammar',
    color: '#6366F1',
    description: 'Master grammar rules and structures'
  },
  {
    value: 'social',
    label: 'Social',
    color: '#F59E42',
    description: 'Develop social and dialogue skills'
  },
  {
    value: 'vocabulary',
    label: 'Vocabulary',
    color: '#FBBF24',
    description: 'Expand and master vocabulary usage'
  },
  {
    value: 'speaking',
    label: 'Speaking',
    color: '#96CEB4',
    description: 'Develop speaking fluency and pronunciation'
  }
]

export interface QuestionTypeInfo {
  label: string
  overview: string
}
export const QUESTION_TYPES: Record<QuestionType, QuestionTypeInfo> = {
  shadow_words: { label: 'Shadow Words', overview: 'Lặp lại chính xác từ/cụm từ/câu/đoạn' },
  shadow_script_dialogue: {
    label: 'Shadow Script Dialogue',
    overview:
      'Đóng vai theo kịch bản hội thoại, lặp lại câu thoại của người dùng trong ngữ cảnh giao tiếp'
  },
  gap_in_dialogue: {
    label: 'Gap In Dialogue',
    overview: 'Điền từ/cụm từ còn thiếu vào chỗ trống trong câu hội thoại dựa trên ngữ cảnh'
  },
  choice_dialogue: {
    label: 'Choice One Dialogue',
    overview: 'Chọn 1 câu trả lời phù hợp nhất trong các lựa chọn để hoàn thành đoạn hội thoại'
  },
  chatting: {
    label: 'Chatting',
    overview: 'Thực hành giao tiếp tự do theo chủ đề, không giới hạn kịch bản'
  },
  translate: {
    label: 'Translate',
    overview: 'Dịch từ/cụm từ/câu/đoạn từ tiếng Anh sang tiếng mẹ đẻ'
  },
  reverse_translation: {
    label: 'Reverser Translation',
    overview: 'Dịch ngược từ/cụm từ/câu/đoạn từ tiếng mẹ đẻ sang tiếng Anh'
  },
  gap_fill_listening: {
    label: 'Gap Fill (Listening)',
    overview:
      'Nghe audio và điền từ vào chỗ trống: có thể điền ngay khi nghe (real-time) hoặc sau khi nghe toàn bộ'
  },
  gap_fill_reading: {
    label: 'Gap Fill (Reading)',
    overview:
      'Đọc văn bản và điền từ vào chỗ trống: có thể điền ngay khi đọc hoặc sau khi đọc toàn bộ'
  },
  choice_one_listening: {
    label: 'Choice One (Listening)',
    overview:
      'Nghe audio và chọn 1 đáp án đúng từ các lựa chọn: làm theo từng câu hỏi nhỏ hoặc sau khi nghe toàn bộ'
  },
  choice_one_reading: {
    label: 'Choice One (Reading)',
    overview:
      'Đọc văn bản và chọn 1 đáp án đúng từ các lựa chọn: làm theo từng câu hỏi nhỏ hoặc sau khi đọc toàn bộ'
  },
  choice_multi_listening: {
    label: 'Choice Multi (Listening)',
    overview: 'Nghe audio và chọn nhiều đáp án đúng từ các lựa chọn (dạng câu hỏi đa lựa chọn)'
  },
  choice_multi_reading: {
    label: 'Choice Multi (Reading)',
    overview: 'Đọc văn bản và chọn nhiều đáp án đúng từ các lựa chọn (dạng câu hỏi đa lựa chọn)'
  },
  matching_listening: {
    label: 'Matching (Listening)',
    overview: 'Nghe audio và ghép các cặp thông tin phù hợp (ví dụ: nối câu hỏi với câu trả lời)'
  },
  matching_reading: {
    label: 'Matching (Reading)',
    overview: 'Đọc văn bản và ghép các cặp thông tin phù hợp (ví dụ: nối ý chính với đoạn văn)'
  },
  true_false_not_given_listening: {
    label: 'True/False/Not Given (Listening)',
    overview: 'Nghe audio và xác định thông tin là Đúng/Sai/Không có trong bài'
  },
  true_false_not_given_reading: {
    label: 'True/False/Not Given (Reading)',
    overview: 'Đọc văn bản và xác định thông tin là Đúng/Sai/Không có trong bài'
  },
  ipa_assembly: {
    label: 'IPA Assembly',
    overview: 'Nghe từ và sắp xếp các ký hiệu IPA để tạo thành phiên âm chính xác của từ đó'
  },
  lexical_fix: {
    label: 'Lexical Fix',
    overview: 'Phát hiện và sửa lỗi từ vựng (từ dùng sai, collocation sai) trong câu/đoạn văn'
  },
  grammar_transformation: {
    label: 'Grammar Transformation',
    overview: 'Chuyển hóa ngữ pháp cụ thể từ câu cũ sang câu mới'
  },
  pronunciation_verification: {
    label: 'Pronunciation Verification',
    overview: 'Nghe máy phát âm từ/cụm từ và xác nhận tính chính xác (đúng/sai) và sửa nếu sai'
  },
  dictation: { label: 'Dictation', overview: 'Gõ lại chính xác toàn bộ nội dung đã nghe từ audio' },
  ipa_reconstruction: {
    label: 'IPA Reconstruction',
    overview: 'Nhìn phiên âm IPA và đoán từ gốc tiếng Anh tương ứng'
  },
  writing_task: {
    label: 'Writing Task',
    overview:
      'Viết bài luận/đoạn văn (tối thiểu 100 từ) theo chủ đề hoặc yêu cầu giống đề thi IELTS/TOEIC'
  },
  speaking_task: {
    label: 'Speaking Task',
    overview:
      'Nói (tối thiểu 100 từ) theo chủ đề hoặc yêu cầu giống đề thi IELTS/TOEIC, có thể ghi âm và nhận phản hồi'
  },
  sentence_puzzle: {
    label: 'Sentence Puzzle',
    overview:
      'Sắp xếp các từ/cụm từ/ký tự tiếng Anh bị xáo trộn thành câu/cụm từ hoàn chỉnh có nghĩa'
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
    type: 'shadow_words',
    name: 'Shadow Words',
    skills: ['speaking'],
    purpose: 'Repeat words/phrases/sentences exactly.',
    icon: 'LucideRepeat2',
    color: '#6366F1'
  },
  {
    type: 'shadow_script_dialogue',
    name: 'Shadow Script Dialogue',
    skills: ['speaking'],
    purpose: 'Role-play scripted dialogue, repeating lines in context.',
    icon: 'LucideMic',
    color: '#6366F1'
  },
  {
    type: 'gap_in_dialogue',
    name: 'Gap In Dialogue',
    skills: ['social'],
    purpose: 'Fill missing words in dialogues based on context.',
    icon: 'LucideEdit',
    color: '#4ECDC4'
  },
  {
    type: 'choice_dialogue',
    name: 'Choice One Dialogue',
    skills: ['social'],
    purpose: 'Select the best response to complete a dialogue.',
    icon: 'LucideCheckCircle',
    color: '#007BFF'
  },
  {
    type: 'chatting',
    name: 'Chatting',
    skills: ['social'],
    purpose: 'Practice free conversation on topics without script.',
    icon: 'LucideMessageCircle',
    color: '#52AAA5'
  },
  {
    type: 'translate',
    name: 'Translate',
    skills: ['vocabulary'],
    purpose: 'Translate from English to native language.',
    icon: 'LucideLanguages',
    color: '#E11D48'
  },
  {
    type: 'reverse_translation',
    name: 'Reverse Translation',
    skills: ['vocabulary'],
    purpose: 'Translate from native language to English.',
    icon: 'LucideRefreshCw',
    color: '#E11D48'
  },
  {
    type: 'gap_fill_listening',
    name: 'Gap Fill (Listening)',
    skills: ['listening'],
    purpose: 'Listen and fill blanks in real-time or after full listening.',
    icon: 'LucideHeadphones',
    color: '#FF6B6B'
  },
  {
    type: 'gap_fill_reading',
    name: 'Gap Fill (Reading)',
    skills: ['reading'],
    purpose: 'Read and fill blanks in real-time or after full reading.',
    icon: 'LucideBookOpen',
    color: '#4ECDC4'
  },
  {
    type: 'choice_one_listening',
    name: 'Choice One (Listening)',
    skills: ['listening'],
    purpose: 'Listen and choose one correct answer.',
    icon: 'LucideVolume2',
    color: '#FF6B6B'
  },
  {
    type: 'choice_one_reading',
    name: 'Choice One (Reading)',
    skills: ['reading'],
    purpose: 'Read and choose one correct answer.',
    icon: 'LucideBookOpen',
    color: '#4ECDC4'
  },
  {
    type: 'choice_multi_listening',
    name: 'Choice Multi (Listening)',
    skills: ['listening'],
    purpose: 'Listen and select multiple correct answers.',
    icon: 'LucideList',
    color: '#FF6B6B'
  },
  {
    type: 'choice_multi_reading',
    name: 'Choice Multi (Reading)',
    skills: ['reading'],
    purpose: 'Read and select multiple correct answers.',
    icon: 'LucideList',
    color: '#4ECDC4'
  },
  {
    type: 'matching_listening',
    name: 'Matching (Listening)',
    skills: ['listening'],
    purpose: 'Match pairs based on audio.',
    icon: 'LucideLink2',
    color: '#FF6B6B'
  },
  {
    type: 'matching_reading',
    name: 'Matching (Reading)',
    skills: ['reading'],
    purpose: 'Match pairs based on text.',
    icon: 'LucideLink2',
    color: '#4ECDC4'
  },
  {
    type: 'true_false_not_given_listening',
    name: 'True/False/Not Given (Listening)',
    skills: ['listening'],
    purpose: 'Determine if info is true, false, or not given.',
    icon: 'LucideCheckCheck',
    color: '#16A34A'
  },
  {
    type: 'true_false_not_given_reading',
    name: 'True/False/Not Given (Reading)',
    skills: ['reading'],
    purpose: 'Determine if info is true, false, or not given.',
    icon: 'LucideCheckCheck',
    color: '#16A34A'
  },
  {
    type: 'ipa_assembly',
    name: 'IPA Assembly',
    skills: ['listening'],
    purpose: 'Assemble IPA symbols into correct transcription.',
    icon: 'LucideAperture',
    color: '#6366F1'
  },
  {
    type: 'lexical_fix',
    name: 'Lexical Fix',
    skills: ['vocabulary'],
    purpose: 'Identify and correct vocabulary errors.',
    icon: 'LucideBug',
    color: '#EF4444'
  },
  {
    type: 'grammar_transformation',
    name: 'Grammar Transformation',
    skills: ['grammar'],
    purpose: 'Transform sentences to practice grammar structures.',
    icon: 'LucideFunctionSquare',
    color: '#6366F1'
  },
  {
    type: 'pronunciation_verification',
    name: 'Pronunciation Verification',
    skills: ['speaking'],
    purpose: 'Verify and correct pronunciation.',
    icon: 'LucideVolume2',
    color: '#EAB308'
  },
  {
    type: 'dictation',
    name: 'Dictation',
    skills: ['listening'],
    purpose: 'Type exactly what you hear.',
    icon: 'LucideClipboardEdit',
    color: '#F472B6'
  },
  {
    type: 'ipa_reconstruction',
    name: 'IPA Reconstruction',
    skills: ['vocabulary'],
    purpose: 'Reconstruct words from IPA transcription.',
    icon: 'LucideShuffle',
    color: '#94A3B8'
  },
  {
    type: 'writing_task',
    name: 'Writing Task',
    skills: ['writing'],
    purpose: 'Write essays or paragraphs on given topics.',
    icon: 'LucideEdit',
    color: '#45B7D1'
  },
  {
    type: 'speaking_task',
    name: 'Speaking Task',
    skills: ['speaking'],
    purpose: 'Speak on topics, record and get feedback.',
    icon: 'LucideMic2',
    color: '#96CEB4'
  },
  {
    type: 'sentence_puzzle',
    name: 'Sentence Puzzle',
    skills: ['grammar'],
    purpose: 'Rearrange words to form coherent sentences.',
    icon: 'LucidePuzzle',
    color: '#F59E42'
  }
]

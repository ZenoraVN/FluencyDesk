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
// Type for rich question definition
export interface QuestionDefinition {
  type: string
  name: string
  skills: SkillType[]
  purpose: string
}

// Rich definitions of 25 question types as in requirements
export const QUESTION_DEFINITIONS: QuestionDefinition[] = [
  {
    type: 'fill_in_the_blank',
    name: 'Fill in the Blank (Điền vào chỗ trống)',
    skills: ['listening', 'reading', 'grammar'],
    purpose: 'Kiểm tra từ vựng, ngữ pháp, khả năng nghe hiểu chi tiết'
  },
  {
    type: 'choice_one',
    name: 'Multiple Choice - Single Answer (Chọn 1 đáp án đúng)',
    skills: ['listening', 'reading', 'grammar'],
    purpose: 'Đánh giá hiểu biết về ngữ cảnh, từ vựng và ngữ pháp cơ bản'
  },
  {
    type: 'choice_multi',
    name: 'Multiple Choice - Multi Answer (Chọn nhiều đáp án đúng)',
    skills: ['listening', 'reading'],
    purpose: 'Rèn luyện kỹ năng phân tích thông tin đa chiều'
  },
  {
    type: 'true_false_not_given',
    name: 'True/False/Not Given (Đúng/Sai/Không có thông tin)',
    skills: ['listening', 'reading'],
    purpose: 'Phát triển kỹ năng suy luận và xác định thông tin chính xác'
  },
  {
    type: 'matching',
    name: 'Matching (Nối cặp)',
    skills: ['listening', 'reading'],
    purpose: 'Luyện tập kết nối ý tưởng, từ vựng hoặc hình ảnh với định nghĩa'
  },
  {
    type: 'error_identification',
    name: 'Error Identification (Tìm lỗi sai)',
    skills: ['grammar', 'writing'],
    purpose: 'Cải thiện độ chính xác trong ngữ pháp và cấu trúc câu'
  },
  {
    type: 'sentence_rearrangement',
    name: 'Sentence Rearrangement (Sắp xếp câu)',
    skills: ['reading', 'writing'],
    purpose: 'Hiểu cấu trúc đoạn văn và cách triển khai ý tưởng logic'
  },
  {
    type: 'summarization',
    name: 'Summarization (Tóm tắt)',
    skills: ['reading', 'writing'],
    purpose: 'Rèn luyện kỹ năng chắt lọc thông tin và diễn đạt ngắn gọn'
  },
  {
    type: 'dictation',
    name: 'Dictation (Chép chính tả)',
    skills: ['listening', 'writing'],
    purpose: 'Luyện nghe chi tiết và viết chính xác'
  },
  {
    type: 'shadowing',
    name: 'Shadowing (Nói nhại)',
    skills: ['speaking', 'listening'],
    purpose: 'Cải thiện phát âm, ngữ điệu và phản xạ nghe-nói'
  },
  {
    type: 'role_play',
    name: 'Role-play (Đóng vai)',
    skills: ['speaking'],
    purpose: 'Phát triển kỹ năng giao tiếp trong tình huống thực tế'
  },
  {
    type: 'picture_description',
    name: 'Picture Description (Mô tả tranh)',
    skills: ['speaking', 'writing'],
    purpose: 'Tăng khả năng quan sát và diễn đạt bằng ngôn ngữ'
  },
  {
    type: 'debate',
    name: 'Debate (Tranh luận)',
    skills: ['speaking', 'listening'],
    purpose: 'Rèn luyện tư duy phản biện và thuyết phục'
  },
  {
    type: 'storytelling',
    name: 'Storytelling (Kể chuyện)',
    skills: ['speaking', 'writing'],
    purpose: 'Phát triển khả năng sáng tạo và kể chuyện mạch lạc'
  },
  {
    type: 'paraphrasing',
    name: 'Paraphrasing (Diễn đạt lại)',
    skills: ['writing', 'reading'],
    purpose: 'Hiểu sâu nội dung và linh hoạt sử dụng ngôn ngữ'
  },
  {
    type: 'translation',
    name: 'Translation (Dịch)',
    skills: ['reading', 'writing'],
    purpose: 'Nâng cao hiểu biết về sự khác biệt ngôn ngữ và văn hóa'
  },
  {
    type: 'word_form',
    name: 'Word Form (Chia dạng từ)',
    skills: ['grammar'],
    purpose: 'Nắm vững cách sử dụng từ loại (danh từ, động từ, tính từ...)'
  },
  {
    type: 'synonym_antonym',
    name: 'Synonym/Antonym (Từ đồng nghĩa/trái nghĩa)',
    skills: ['vocabulary'],
    purpose: 'Mở rộng vốn từ và cách sử dụng từ linh hoạt'
  },
  {
    type: 'conversation_completion',
    name: 'Conversation Completion (Hoàn thành hội thoại)',
    skills: ['speaking', 'listening'],
    purpose: 'Luyện tập phản xạ trong giao tiếp hàng ngày'
  },
  {
    type: 'pronunciation_check',
    name: 'Pronunciation Check (Kiểm tra phát âm)',
    skills: ['speaking'],
    purpose: 'Sửa lỗi phát âm và luyện nói chuẩn'
  },
  {
    type: 'grammar_transformation',
    name: 'Grammar Transformation (Biến đổi ngữ pháp)',
    skills: ['grammar'],
    purpose: 'Thành thạo các cấu trúc ngữ pháp phức tạp'
  },
  {
    type: 'contextual_cloze',
    name: 'Contextual Cloze (Điền từ theo ngữ cảnh)',
    skills: ['reading', 'vocabulary'],
    purpose: 'Hiểu cách dùng từ trong ngữ cảnh cụ thể'
  },
  {
    type: 'listening_for_gist',
    name: 'Listening for Gist (Nghe hiểu ý chính)',
    skills: ['listening'],
    purpose: 'Phát triển kỹ năng nghe lấy thông tin tổng quát'
  },
  {
    type: 'listening_for_details',
    name: 'Listening for Details (Nghe chi tiết)',
    skills: ['listening'],
    purpose: 'Luyện tập nghe thông tin chi tiết như số liệu, tên riêng...'
  },
  {
    type: 'inference_questions',
    name: 'Inference Questions (Câu hỏi suy luận)',
    skills: ['reading', 'listening'],
    purpose: 'Rèn luyện tư duy suy luận từ thông tin ẩn'
  }
]

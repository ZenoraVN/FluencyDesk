export type SkillType = 'listening' | 'reading' | 'grammar' | 'speaking' | 'writing';

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
  | 'open_paragraph';

export type LevelType = 'beginner' | 'intermediate' | 'advanced';

export interface SkillInfo {
  label: string;
  description: string;
}

export interface QuestionTypeInfo {
  label: string;
  overview: string;
}

export interface LevelInfo {
  value: LevelType;
  label: string;
  color: string;
}

export const SKILLS: Record<SkillType, SkillInfo> = {
  listening: { label: 'Listening', description: 'Luyện tập kỹ năng nghe hiểu' },
  reading: { label: 'Reading', description: 'Luyện tập kỹ năng đọc hiểu' },
  grammar: { label: 'Grammar', description: 'Luyện tập ngữ pháp' },
  speaking: { label: 'Speaking', description: 'Luyện tập kỹ năng nói' },
  writing: { label: 'Writing', description: 'Luyện tập kỹ năng viết' }
};

export const QUESTION_TYPES: Record<QuestionType, QuestionTypeInfo> = {
  fill_in_the_blank: { label: 'Fill in the blank', overview: 'Điền từ thích hợp vào chỗ trống để hoàn thành câu' },
  choice_one: { label: 'Single choice', overview: 'Chọn một đáp án đúng từ nhiều lựa chọn' },
  choice_multi: { label: 'Multiple choice', overview: 'Chọn nhiều đáp án đúng từ các lựa chọn' },
  matching: { label: 'Matching', overview: 'Ghép nối các cặp thông tin tương ứng' },
  true_false_not_given: { label: 'True/False/Not Given', overview: 'Xác định tính đúng sai của câu dựa trên thông tin cho trước' },
  error_identification: { label: 'Error Identification', overview: 'Xác định lỗi ngữ pháp trong câu' },
  sentence_completion: { label: 'Sentence Completion', overview: 'Hoàn thành câu với cấu trúc phù hợp' },
  word_repetition: { label: 'Word Repetition', overview: 'Lặp lại từ theo phát âm chuẩn' },
  phrase_repetition: { label: 'Phrase Repetition', overview: 'Lặp lại cụm từ theo phát âm chuẩn' },
  conversational_repetition: { label: 'Conversation Repetition', overview: 'Lặp lại đoạn hội thoại theo phát âm chuẩn' },
  open_conversation: { label: 'Open Conversation', overview: 'Thực hành hội thoại tự do về chủ đề cho trước' },
  open_paragraph: { label: 'Open Paragraph', overview: 'Viết đoạn văn về chủ đề cho trước' }
};

export const LEVELS: LevelInfo[] = [
  { value: 'beginner', label: 'Cơ bản', color: '#FF6B6B' },
  { value: 'intermediate', label: 'Trung cấp', color: '#4ECDC4' },
  { value: 'advanced', label: 'Nâng cao', color: '#45B7D1' },
];
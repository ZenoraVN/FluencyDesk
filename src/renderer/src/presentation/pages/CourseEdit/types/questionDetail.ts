export interface ChoiceOneOption {
    id: string;
    is_correct: boolean;
    option: string;
}
export interface ChoiceOneQuestion {
    id: string;
    question: string;
    explain: string;
}

export interface ChoiceMultiOption {
    id: string;
    is_correct: boolean;
    option: string;
}
export interface ChoiceMultiQuestion {
    id: string;
    question: string;
    explain: string;
}

export interface ListeningQuestionDetail {
    audio_url?: string;
    image_urls?: string[];
    transcript?: string;
}

export interface ReadingQuestionDetail {
    title?: string;
    passage?: string;
    image_urls?: string[];
}

export interface FillInBlankQuestion {
    question: string;
}
export interface FillInBlankAnswer {
    answer: string;
    explain: string;
}

export interface MatchingItem {
    question: string;
    answer: string;
    explain: string;
}

export type TrueFalseNotGivenAnswer = "TRUE" | "FALSE" | "NOT_GIVEN";
export interface TrueFalseNotGivenItem {
    question: string;
    answer: TrueFalseNotGivenAnswer;
    explain: string;
}

export interface ErrorIdentificationQuestion {
    question: string;
}
export interface ErrorIdentificationAnswer {
    error_word: string;
    correct_word: string;
    explain: string;
}

export interface SentenceCompletionItem {
    original_sentence: string;
    start_phrase: string;
    middle_phrase: string | null;
    end_phrase: string | null;
    true_sentences: string[];
    explain: string;
}

export interface ConversationalRepetition {
    title: string;
    overview: string;
}
export interface ConversationalRepetitionQAItem {
    question: string;
    answer: string;
    mean_of_question: string;
    mean_of_answer: string;
}

export interface OpenConversation {
    title: string;
    overview: string;
    example_conversation: string;
}

export interface OpenParagraph {
    example_paragraph: string;
    mean_example_paragraph: string;
    tips?: string[];
}

export interface ReadingDetail {
    title?: string;
    passage: string;
    image_urls?: string[];
}

export interface QuestionDetail {
    id: string;
    creator_id: string;
    creator_role: string;
    status: string;
    skill: SkillType;
    type: QuestionType;
    level: LevelType;
    score: number;
    topic: string[];
    tags: string[];
    version: number;

    // Choice One
    choice_one_options?: ChoiceOneOption[];
    choice_one_question?: ChoiceOneQuestion;

    // Choice Multi
    choice_multi_options?: ChoiceMultiOption[];
    choice_multi_question?: ChoiceMultiQuestion;

    // Listening
    listening_question_detail?: ListeningQuestionDetail;

    // Reading
    reading_question_detail?: ReadingQuestionDetail;

    // Fill in the blank
    fill_in_the_blank_question?: FillInBlankQuestion;
    fill_in_the_blank_answers?: FillInBlankAnswer[];

    // Matching
    matchings?: MatchingItem[];

    // True/False/Not Given
    true_false_not_givens?: TrueFalseNotGivenItem[];

    // Error Identification
    error_identification_question?: ErrorIdentificationQuestion;
    error_identification_answers?: ErrorIdentificationAnswer[];

    // Sentence Completion
    sentence_completions?: SentenceCompletionItem[];

    // Conversational Repetition
    conversational_repetition?: ConversationalRepetition;
    conversational_repetition_qa?: ConversationalRepetitionQAItem[];

    // Open Conversation
    open_conversation?: OpenConversation;

    // Open Paragraph
    open_paragraph?: OpenParagraph;
}

export type SkillType =
    | "listening"
    | "reading"
    | "grammar"
    | "speaking"
    | "writing";

export type QuestionType =
    | "fill_in_the_blank"
    | "choice_one"
    | "choice_multi"
    | "matching"
    | "true_false_not_given"
    | "error_identification"
    | "sentence_completion"
    | "word_repetition"
    | "phrase_repetition"
    | "conversational_repetition"
    | "open_conversation"
    | "open_paragraph"

export type LevelType = "beginner" | "intermediate" | "advanced";

interface Skill {
    value: string;
    label: string;
    color: string;
    description: string;
}
export const SKILLS: Skill[] = [
    { value: "listening", label: "Nghe", color: "#FF6B6B", description: "Phát triển kỹ năng nghe tiếng Anh qua bài tập đa dạng" },
    { value: "reading", label: "Đọc", color: "#4ECDC4", description: "Nâng cao kỹ năng đọc hiểu thông qua các bài đọc" },
    { value: "writing", label: "Viết", color: "#45B7D1", description: "Rèn luyện kỹ năng viết với các chủ đề đa dạng" },
    { value: "speaking", label: "Nói", color: "#96CEB4", description: "Luyện nói và phát âm chuẩn xác qua hội thoại mẫu" },
    { value: "grammar", label: "Ngữ pháp", color: "#6366F1", description: "Củng cố kiến thức ngữ pháp thông qua bài tập chọn lọc" },
];

export interface QuestionTypeInfo {
    label: string;
    overview: string;
}
export const QUESTION_TYPES: Record<QuestionType, QuestionTypeInfo> = {
    fill_in_the_blank: {
        label: "Fill in the blank",
        overview: "Điền từ thích hợp vào chỗ trống để hoàn thành câu",
    },
    choice_one: {
        label: "Single choice",
        overview: "Chọn một đáp án đúng từ nhiều lựa chọn",
    },
    choice_multi: {
        label: "Multiple choice",
        overview: "Chọn nhiều đáp án đúng từ các lựa chọn",
    },
    matching: {
        label: "Matching",
        overview: "Ghép nối các cặp thông tin tương ứng",
    },
    true_false_not_given: {
        label: "True/False/Not Given",
        overview: "Xác định tính đúng sai của câu dựa trên thông tin cho trước",
    },
    error_identification: {
        label: "Error Identification",
        overview: "Xác định lỗi ngữ pháp trong câu",
    },
    sentence_completion: {
        label: "Sentence Completion",
        overview: "Hoàn thành câu với cấu trúc phù hợp",
    },
    word_repetition: {
        label: "Word Repetition",
        overview: "Lặp lại từ theo phát âm chuẩn",
    },
    phrase_repetition: {
        label: "Phrase Repetition",
        overview: "Lặp lại cụm từ theo phát âm chuẩn",
    },
    conversational_repetition: {
        label: "Conversation Repetition",
        overview: "Lặp lại đoạn hội thoại theo phát âm chuẩn",
    },
    open_conversation: {
        label: "Open Conversation",
        overview: "Thực hành hội thoại tự do về chủ đề cho trước",
    },
    open_paragraph: {
        label: "Open Paragraph",
        overview: "Viết đoạn văn về chủ đề cho trước",
    },
};

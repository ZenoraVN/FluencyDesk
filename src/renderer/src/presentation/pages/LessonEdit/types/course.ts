export interface Course {
    id: string;
    creator_id: string;
    creator_role: string;
    status: string;
    type: string;
    title: string;
    overview: string;
    skills: string[];
    level: string;
    image_url: string;
    tags: string[];
    version: number;
    lessons: Lesson[];
    course_book?: CourseBook;
}

export interface CourseBook {
    id: string;
    course_id: string;
    authors: string[];
    publishers: string[];
    publication_year: number;
}

export interface Lesson {
    id: string;
    course_id: string;
    sequence: number;
    title: string;
    overview: string;
    version: number;
    questions: Question[];
    status: string;
}

export interface Question {
    id: string;
    lesson_id: string;
    sequence: number;
    question_id: string;
    question_type: QuestionType;
    question_skill: QuestionSkill;

}

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
    | "listening"
    | "reading";
export type QuestionSkill = "grammar" | "reading" | "listening" | "writing" | "speaking";
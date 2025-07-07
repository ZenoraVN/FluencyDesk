export interface CourseLessonType {
    id: string;
    course_id: string;
    sequence: number;
    title: string;
    overview: string;
    status: string;
}

export interface CourseBookData {
    id: string;
    course_id: string;
    publishers: string[];
    authors: string[];
    publication_year: number;
}

export interface CourseType {
    id: string;
    creator_id: string;
    creator_role: string;
    status: string;
    type: "BOOK" | "OTHER";
    title: string;
    overview: string; // HTML
    skills: string[];
    level: "beginner" | "intermediate" | "advanced" | "expert";
    image_url?: string;
    tags: string[];
    version: number;
    course_book?: CourseBookData;
    lessons: CourseLessonType[];
}

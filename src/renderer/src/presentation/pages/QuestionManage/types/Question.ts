export interface Question {
    id: string;
    content: string;
    creator_id: string;
    creator_role: string;
    status: string;
    skill: string;
    type: string;
    level: string;
    score: number;
}

export interface QuestionSearchRequest {
    page?: number;
    page_size?: number;
    id?: string;
    type?: string;
    level?: string;
    score?: number;
    creator_id?: string;
    creator_role?: string;
    is_owner?: boolean;
    status?: string;
    skill?: string;
    topic?: string;
    tag?: string;
}

export interface QuestionSearchResponse {
    total: number;
    questions: Question[];
    page: number;
    page_size: number;
}
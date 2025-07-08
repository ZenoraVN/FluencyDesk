export type RelationshipType =
    | "synonym"
    | "antonym"
    | "word_synonym"
    | "word_antonym"
    | "inflection"
    | "rhyme"
    | "hypernym"
    | "collocation";

export interface Example {
    id: string;
    example_sentence: string;
    mean_example_sentence: string;
    created_at: string;
    updated_at: string;
}

export interface Definition {
    id: string;
    parts_of_speech: string;
    definition: string;
    is_main_definition: boolean;
    examples: Example[];
    created_at: string;
    updated_at: string;
}

export interface Relationship {
    word: string;
    id: string;
    related_id: string;
    related_type: "word" | "phrase";
    relationship_type: RelationshipType;
    phrase: string;
    mean_vietnamese?: string;
    created_at: string;
    updated_at: string;
}

export interface SuggestedRelationship {
    wiki_word_id: string;
    text: string;
    mean_vietnamese?: string;
    related_type: "word" | "phrase";
    relationship_type: RelationshipType;
    exists?: boolean;
    explanation?: string;
}

// THÊM DÒNG NÀY (chuẩn hoá object WordData!)
export interface WordData {
    id: string;
    word: string;
    pronunciation: string;
    frequency: string;
    image_urls: string[];
    usage_notes: string[];
    language_level: string;
    created_at: string;
    updated_at: string;
    definitions: Definition[];
    relationships: Relationship[];
}

export interface PhraseData {
    id: string;
    phrase: string;
    pronunciation: string;
    frequency: string;
    language_level: string;
    usage_notes: string[];
    created_at: string;
    updated_at: string;
    image_urls: string[];
    definitions: any[];
    relationships: any[];
}
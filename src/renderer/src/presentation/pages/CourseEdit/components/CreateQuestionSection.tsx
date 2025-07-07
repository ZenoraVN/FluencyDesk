import { FC, useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/presentation/components/ui/button";
import ApiService from "@/service/ApiService";
import {
  X,
  Headphones,
  BookOpen,
  Pencil,
  MessageSquare,
  Edit3,
  Clock,
  Users,
  BarChart,
} from "lucide-react";
import {
  SkillType,
  QuestionType,
  SKILLS,
  QUESTION_TYPES,
} from "../types/questionDetail";
import { BaseQuestionForm } from "./forms/BaseQuestionForm";
import {
  ListeningDetailForm,
  ListeningDetailFormData,
} from "./forms/ListeningDetailForm";
import {
  ReadingDetailForm,
  ReadingDetailFormData,
} from "./forms/ReadingDetailForm";
import { FillInBlankForm } from "./forms/FillInBlankForm";
import { ChoiceOneForm } from "./forms/ChoiceOneForm";
import { ChoiceMultiForm } from "./forms/ChoiceMultiForm";
import { MatchingForm } from "./forms/MatchingForm";
import { TrueFalseNotGivenForm } from "./forms/TrueFalseNotGivenForm";
import { ErrorIdentificationForm } from "./forms/ErrorIdentificationForm";
import { SentenceCompletionForm } from "./forms/SentenceCompletionForm";
import { ConversationalRepetitionForm } from "./forms/ConversationalRepetitionForm";
import { OpenParagraphForm } from "./forms/OpenParagraphForm";
import { OpenConversationForm } from "./forms/OpenConversationForm";
import { WordRepetitionForm } from "./forms/WordRepetitionForm";
import { PhraseRepetitionForm } from "./forms/PhraseRepetitionForm";

import { AIForm } from "./forms/AIForm";

const METRIC_LABELS = {
  avgTime: "Thời gian trung bình",
  difficulty: {
    Low: "Dễ",
    Medium: "Trung bình",
    High: "Khó",
    "Very High": "Rất khó",
  },
  popularity: "Người dùng",
  successRate: "Tỷ lệ thành công",
  complexity: {
    Low: "Đơn giản",
    Medium: "Trung bình",
    High: "Phức tạp",
    "Very High": "Rất phức tạp",
  },
  usage: "Tần suất sử dụng",
  questions: "câu hỏi",
} as const;

const SKILL_ICONS = {
  listening: Headphones,
  reading: BookOpen,
  grammar: Pencil,
  speaking: MessageSquare,
  writing: Edit3,
} as const;

const SKILL_METRICS = {
  listening: {
    totalQuestions: 2500,
    avgTime: "15-20 min",
    difficulty: "Medium",
    popularity: "35%",
    successRate: "75%",
  },
  reading: {
    totalQuestions: 3000,
    avgTime: "20-25 min",
    difficulty: "High",
    popularity: "30%",
    successRate: "70%",
  },
  grammar: {
    totalQuestions: 4000,
    avgTime: "10-15 min",
    difficulty: "Medium",
    popularity: "20%",
    successRate: "80%",
  },
  speaking: {
    totalQuestions: 1500,
    avgTime: "15-20 min",
    difficulty: "High",
    popularity: "10%",
    successRate: "65%",
  },
  writing: {
    totalQuestions: 1000,
    avgTime: "25-30 min",
    difficulty: "Very High",
    popularity: "5%",
    successRate: "60%",
  },
} as const;

const TYPE_METRICS = {
  fill_in_the_blank: {
    usage: "35%",
    avgTime: "2-3 min",
    complexity: "Medium",
    questionCount: 850,
    successRate: "75%",
  },
  choice_one: {
    usage: "25%",
    avgTime: "1-2 min",
    complexity: "Low",
    questionCount: 1200,
    successRate: "85%",
  },
  choice_multi: {
    usage: "20%",
    avgTime: "2-4 min",
    complexity: "Medium",
    questionCount: 950,
    successRate: "70%",
  },
  matching: {
    usage: "10%",
    avgTime: "3-5 min",
    complexity: "High",
    questionCount: 400,
    successRate: "65%",
  },
  true_false_not_given: {
    usage: "10%",
    avgTime: "1-2 min",
    complexity: "Low",
    questionCount: 600,
    successRate: "80%",
  },
  error_identification: {
    usage: "15%",
    avgTime: "2-3 min",
    complexity: "Medium",
    questionCount: 300,
    successRate: "72%",
  },
  sentence_completion: {
    usage: "20%",
    avgTime: "2-4 min",
    complexity: "Medium",
    questionCount: 450,
    successRate: "68%",
  },
  word_repetition: {
    usage: "30%",
    avgTime: "30 sec",
    complexity: "Low",
    questionCount: 800,
    successRate: "90%",
  },
  phrase_repetition: {
    usage: "25%",
    avgTime: "1 min",
    complexity: "Medium",
    questionCount: 600,
    successRate: "85%",
  },
  conversational_repetition: {
    usage: "20%",
    avgTime: "2-3 min",
    complexity: "High",
    questionCount: 400,
    successRate: "75%",
  },
  open_conversation: {
    usage: "15%",
    avgTime: "3-5 min",
    complexity: "Very High",
    questionCount: 200,
    successRate: "60%",
  },
  open_paragraph: {
    usage: "10%",
    avgTime: "5-7 min",
    complexity: "Very High",
    questionCount: 150,
    successRate: "55%",
  },
} as const;

const QUESTION_TYPES_BY_SKILL: Record<SkillType, QuestionType[]> = {
  listening: [
    "fill_in_the_blank",
    "choice_one",
    "choice_multi",
    "matching",
    "true_false_not_given",
  ],
  reading: [
    "fill_in_the_blank",
    "choice_one",
    "choice_multi",
    "matching",
    "true_false_not_given",
  ],
  grammar: [
    "fill_in_the_blank",
    "choice_one",
    "choice_multi",
    "error_identification",
    "sentence_completion",
  ],
  speaking: [
    "word_repetition",
    "phrase_repetition",
    "conversational_repetition",
    "open_conversation",
    "open_paragraph",
  ],
  writing: ["open_paragraph"],
} as const;

interface FormState {
  data: any;
  hasErrors: boolean;
}

interface CreateQuestionSectionProps {
  lessonId: string;
  lessonTitle: string;
  lessonSequence: number;
  questionSequence: number;
  onClose: () => void;
  onCreated?: () => void;
}

export const CreateQuestionSection: FC<CreateQuestionSectionProps> = ({
  lessonId,
  lessonTitle,
  lessonSequence,
  questionSequence,
  onClose,
  onCreated,
}) => {
  const [selectedSkill, setSelectedSkill] = useState<SkillType | null>(null);
  const [selectedType, setSelectedType] = useState<QuestionType | null>(null);
  const [detailFormData, setDetailFormData] = useState<FormState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiData, setAIData] = useState<any>(null);

  useEffect(() => {
    if (aiData) {
      // Đổ data chung cho BaseQuestionForm
      if (aiData.topic) methods.setValue("topic", aiData.topic);
      if (aiData.tags) methods.setValue("tags", aiData.tags);
      if (aiData.level) methods.setValue("level", aiData.level);
      if (aiData.instruction) {
        methods.setValue("instruction", aiData.instruction);
      }

      if (
        aiData.fill_in_the_blank_question &&
        aiData.fill_in_the_blank_answers
      ) {
        methods.setValue(
          "fill_in_the_blank_question",
          aiData.fill_in_the_blank_question
        );
        methods.setValue(
          "fill_in_the_blank_answers",
          aiData.fill_in_the_blank_answers
        );
      }

      if (aiData.choice_one_question && aiData.choice_one_options) {
        methods.setValue("choice_one_question", aiData.choice_one_question);
        methods.setValue("choice_one_options", aiData.choice_one_options);
      }

      if (aiData.choice_multi_question && aiData.choice_multi_options) {
        methods.setValue("choice_multi_question", aiData.choice_multi_question);
        methods.setValue("choice_multi_options", aiData.choice_multi_options);
      }

      if (aiData.matchings) {
        methods.setValue("matchings", aiData.matchings);
      }

      if (aiData.true_false_not_givens) {
        methods.setValue("true_false_not_givens", aiData.true_false_not_givens);
      }

      if (
        aiData.error_identification_question &&
        aiData.error_identification_answers
      ) {
        methods.setValue(
          "error_identification_question",
          aiData.error_identification_question
        );
        methods.setValue(
          "error_identification_answers",
          aiData.error_identification_answers
        );
      }

      if (aiData.sentence_completions) {
        methods.setValue("sentence_completions", aiData.sentence_completions);
      }

      if (
        aiData.conversational_repetition &&
        aiData.conversational_repetition_qa
      ) {
        methods.setValue(
          "conversational_repetition",
          aiData.conversational_repetition
        );
        methods.setValue(
          "conversational_repetition_qa",
          aiData.conversational_repetition_qa
        );
      }

      if (aiData.open_paragraph) {
        methods.setValue("open_paragraph", aiData.open_paragraph);
      }

      if (aiData.open_conversation) {
        methods.setValue("open_conversation", aiData.open_conversation);
      }
    }
  }, [aiData]);

  interface QuestionFormValues {
    skill: SkillType | undefined;
    type: QuestionType | undefined;
    topic: never[];
    tags: never[];
    level: string;
    score: number;
    instruction: string;
    listening_question_detail?: ListeningDetailFormData;
    reading_question_detail?: ReadingDetailFormData;
    fill_in_the_blank_question?: {
      question: string;
    };
    fill_in_the_blank_answers?: Array<{
      answer: string;
      explain: string;
    }>;

    choice_one_question?: { question: string; explain: string };
    choice_one_options?: Array<{ option: string; is_correct: boolean }>;
    choice_multi_question?: { question: string; explain: string };
    choice_multi_options?: Array<{ option: string; is_correct: boolean }>;
    matchings?: Array<{ question: string; answer: string; explain: string }>;
    true_false_not_givens?: Array<{
      question: string;
      answer: "TRUE" | "FALSE" | "NOT_GIVEN";
      explain: string;
    }>;
    error_identification_question?: { question: string };
    error_identification_answers?: Array<{
      error_word: string;
      correct_word: string;
      explain: string;
    }>;
    sentence_completions?: Array<{
      original_sentence: string;
      start_phrase: string;
      middle_phrase: string | null;
      end_phrase: string | null;
      true_sentences: string[];
      explain: string;
    }>;
    conversational_repetition?: { title: string; overview: string };
    conversational_repetition_qa?: Array<{
      question: string;
      answer: string;
      mean_of_question: string;
      mean_of_answer: string;
    }>;
    open_paragraph?: {
      example_paragraph: string;
      mean_example_paragraph: string;
      tips?: string[];
    };
    open_conversation?: {
      title: string;
      overview: string;
      example_conversation: string;
    };
  }

  const methods = useForm<QuestionFormValues>({
    mode: "onChange",
    defaultValues: {
      skill: undefined,
      type: undefined,
      topic: [],
      tags: [],
      level: "intermediate",
      score: 10,
      instruction: "",
      listening_question_detail: undefined,
      reading_question_detail: undefined,
      choice_one_question: undefined,
      choice_one_options: undefined,
      choice_multi_question: undefined,
      choice_multi_options: undefined,
      matchings: undefined,
      true_false_not_givens: undefined,
      conversational_repetition: undefined,
      conversational_repetition_qa: undefined,
      open_paragraph: undefined,
      open_conversation: undefined,
    },
  });

  const handleSkillSelect = (skill: SkillType) => {
    setSelectedSkill(skill);
    setSelectedType(null);
    methods.setValue("skill", skill);
  };

  const handleTypeSelect = (type: QuestionType) => {
    setSelectedType(type);
    methods.setValue("type", type);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const formValues = methods.getValues();
      const questionData: QuestionFormValues = {
        ...formValues,
        listening_question_detail: undefined,
        reading_question_detail: undefined,
      };

      // chuyển detailFormData vào đúng chỗ nếu có
      if (
        selectedSkill === "listening" &&
        detailFormData &&
        detailFormData.data
      ) {
        questionData.listening_question_detail =
          detailFormData.data as ListeningDetailFormData;
      }
      if (
        selectedSkill === "reading" &&
        detailFormData &&
        detailFormData.data
      ) {
        questionData.reading_question_detail =
          detailFormData.data as ReadingDetailFormData;
      }

      // Tạo FormData luôn, BẤT KỂ có file hay không
      const formData = new FormData();

      // Append file nếu có (có thể không có gì ngoài 'data')
      if (
        selectedSkill === "listening" &&
        detailFormData &&
        detailFormData.data
      ) {
        const listeningDetails = detailFormData.data as ListeningDetailFormData;
        if (listeningDetails.audio_file instanceof File) {
          formData.append("audio_0", listeningDetails.audio_file);
        }
        if (
          listeningDetails.image_files &&
          listeningDetails.image_files.length > 0
        ) {
          listeningDetails.image_files.forEach((file: File, index: number) => {
            formData.append(`image_${index}`, file);
          });
        }
      }
      if (
        selectedSkill === "reading" &&
        detailFormData &&
        detailFormData.data
      ) {
        const readingDetails = detailFormData.data as ReadingDetailFormData;
        if (
          readingDetails.image_files &&
          readingDetails.image_files.length > 0
        ) {
          readingDetails.image_files.forEach((file: File, index: number) => {
            formData.append(`image_${index}`, file);
          });
        }
      }
      // Bắt buộc append "data"
      formData.append("data", JSON.stringify(questionData));

      if (lessonId && lessonSequence) {
        const endpoint = `/question/bulk-with-lesson-question/${lessonId}/${questionSequence}`;
        // Gửi LUÔN multipart/form-data (FormData) kể cả không có file
        await ApiService.post(endpoint, formData, true, true);
      } else {
        throw new Error("Thiếu lessonId hoặc lessonSequence");
      }
      onClose();
      if (onCreated) onCreated();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTypeForm = () => {
    if (!selectedType || !selectedSkill) return null;

    switch (selectedType) {
      case "fill_in_the_blank":
        return <FillInBlankForm />;
      case "choice_one":
        return <ChoiceOneForm />;
      case "choice_multi":
        return <ChoiceMultiForm />;
      case "matching":
        return <MatchingForm />;
      case "true_false_not_given":
        return <TrueFalseNotGivenForm />;
      case "error_identification":
        return <ErrorIdentificationForm />;
      case "sentence_completion":
        return <SentenceCompletionForm />;
      case "conversational_repetition":
        return <ConversationalRepetitionForm />;
      case "open_paragraph":
        return <OpenParagraphForm />;
      case "open_conversation":
        return <OpenConversationForm initialData={aiData?.open_conversation} />;
      case "word_repetition":
        return (
          <WordRepetitionForm
            lessonId={lessonId}
            sequence={questionSequence}
            onClose={onClose}
          />
        );
      case "phrase_repetition":
        return (
          <PhraseRepetitionForm
            lessonId={lessonId}
            sequence={questionSequence}
            onClose={onClose}
          />
        );

      default:
        return (
          <div className="text-center text-gray-500">
            Form for this question type will be implemented soon...
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col max-h-[calc(100vh-4rem)] rounded-lg border border-gray-200 hover:border-[#52aaa5] transition-colors p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div>
            <div className="text-lg text-black font-semibold">
              Lesson {lessonSequence}. {lessonTitle} - {selectedType} - question{" "}
              {questionSequence}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <FormProvider {...methods}>
        <div className="relative flex flex-col flex-1 min-h-0">
          {/* Loading Overlay */}
          {isSubmitting && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-[9999] flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur shadow-lg rounded-lg p-4 flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-[#52aaa5] border-t-transparent rounded-full animate-spin" />
                <span className="text-[#2D3748] font-medium">
                  Đang tạo câu hỏi...
                </span>
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto space-y-6">
            {/* Skill Selection */}
            // Đoạn này thay thế trong CreateQuestionSection:
            {!selectedSkill && (
              <div className="space-y-4">
                {SKILLS.map((skill) => {
                  const skillKey = skill.value as SkillType;
                  const Icon = SKILL_ICONS[skillKey];
                  const metrics = SKILL_METRICS[skillKey];
                  if (!metrics) return null; // Phòng ngừa nếu mapping bị lỗi

                  return (
                    <button
                      key={skill.value}
                      onClick={() => handleSkillSelect(skillKey)}
                      className="w-full border border-gray-200 hover:border-[#52aaa5] rounded-lg p-4 transition-colors text-left"
                      disabled={isSubmitting}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-[#52aaa5]/10 rounded-lg">
                            <Icon className="w-5 h-5 text-[#52aaa5]" />
                          </div>
                          <div>
                            <h3 className="text-base font-medium text-[#2D3748]">
                              {skill.label}
                            </h3>
                            <p className="text-sm text-[#718096] mt-1">
                              {skill.description}
                            </p>
                            <div className="text-sm text-[#718096] mt-2">
                              {metrics.totalQuestions.toLocaleString()}{" "}
                              {METRIC_LABELS.questions}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-[#718096]">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            <span>{metrics.avgTime}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="w-4 h-4" />
                            <span>{metrics.popularity}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <BarChart className="w-4 h-4" />
                            <span>{metrics.successRate}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
            {/* Question Type Selection */}
            {selectedSkill && !selectedType && (
              <div className="space-y-4">
                {QUESTION_TYPES_BY_SKILL[selectedSkill].map((type) => {
                  const typeDetails = QUESTION_TYPES[type];
                  const metrics =
                    TYPE_METRICS[type as keyof typeof TYPE_METRICS];

                  return (
                    <button
                      key={type}
                      onClick={() => handleTypeSelect(type)}
                      className="w-full border border-gray-200 hover:border-[#52aaa5] rounded-lg p-4 transition-colors text-left"
                      disabled={isSubmitting}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-medium text-[#2D3748]">
                            {typeDetails.label}
                          </h3>
                          <p className="text-sm text-[#718096] mt-1">
                            {typeDetails.overview}
                          </p>
                          <div className="text-sm text-[#718096] mt-2">
                            {metrics.questionCount.toLocaleString()}{" "}
                            {METRIC_LABELS.questions}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-[#718096]">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            <span>{metrics.avgTime}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="w-4 h-4" />
                            <span>{metrics.usage}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <BarChart className="w-4 h-4" />
                            <span>{metrics.successRate}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
            {/* Question Forms */}
            {selectedSkill && selectedType && (
              <>
                {/* Nếu là word_repetition thì chỉ hiển thị WordRepetitionForm riêng biệt */}
                {["word_repetition", "phrase_repetition"].includes(
                  selectedType
                ) ? (
                  selectedType === "word_repetition" ? (
                    <WordRepetitionForm
                      lessonId={lessonId}
                      sequence={questionSequence}
                      onClose={onClose}
                    />
                  ) : (
                    <PhraseRepetitionForm
                      lessonId={lessonId}
                      sequence={questionSequence}
                      onClose={onClose}
                    />
                  )
                ) : (
                  <div className="flex gap-8 overflow-y-auto">
                    {/* Left Column */}
                    <div className="flex-1 min-h-0 space-y-8 border-r border-gray-200 pr-8 overflow-y-auto">
                      {/* Base Question Form */}
                      <div className="space-y-6">
                        {[
                          "fill_in_the_blank",
                          "choice_one",
                          "choice_multi",
                          "matching",
                          "true_false_not_given",
                          "sentence_completion",
                          "error_identification",
                          "phrase_repetition",
                          "conversational_repetition",
                          "open_conversation",
                          "open_paragraph",
                        ].includes(selectedType || "") && (
                          <AIForm
                            skill={selectedSkill}
                            type={selectedType}
                            onResult={setAIData}
                            transcript={
                              selectedSkill === "listening"
                                ? detailFormData?.data?.transcript || ""
                                : undefined
                            }
                            passage={
                              selectedSkill === "reading"
                                ? detailFormData?.data?.passage || ""
                                : undefined
                            }
                          />
                        )}
                        <BaseQuestionForm
                          skill={selectedSkill}
                          type={selectedType}
                        />
                      </div>
                      {/* Detail Form */}
                      {(selectedSkill === "listening" ||
                        selectedSkill === "reading") && (
                        <div className="space-y-6">
                          <h3 className="text-lg font-semibold text-[#2D3748]">
                            {selectedSkill === "listening"
                              ? "Chi tiết bài nghe"
                              : "Chi tiết bài đọc"}
                          </h3>
                          {selectedSkill === "listening" ? (
                            <ListeningDetailForm
                              onChange={(data: ListeningDetailFormData) => {
                                setDetailFormData({ data, hasErrors: false });
                              }}
                            />
                          ) : (
                            <ReadingDetailForm
                              onChange={(data: ReadingDetailFormData) => {
                                setDetailFormData({ data, hasErrors: false });
                              }}
                            />
                          )}
                        </div>
                      )}
                    </div>
                    {/* Right Column */}
                    <div className="flex-1 min-h-0 space-y-6 overflow-y-auto">
                      <h3 className="text-lg font-semibold text-[#2D3748]">
                        Chi tiết câu hỏi
                      </h3>
                      {renderTypeForm()}
                    </div>
                  </div>
                )}
                {/* Action Buttons */}
                {selectedType !== "word_repetition" && (
                  <Button
                    type="button"
                    className="w-full bg-[#52aaa5] hover:bg-[#52aaa5]/90 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                  >
                    {isSubmitting ? "Đang tạo..." : "Tạo câu hỏi"}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </FormProvider>
    </div>
  );
};

import { useState, useEffect } from "react";
import ApiService from "../../../../../../service/ApiService";
import { GeminiWordService } from "../../../services/GeminiWordService";
import { useForm, useFieldArray } from "react-hook-form";
import { Sheet, SheetContent } from "../../../../../components/ui/sheet";
import { Button } from "../../../../../components/ui/button";
import { Plus } from "lucide-react";
import { Form } from "../../../../../components/ui/form";
import { CreateWordInfoSection } from "./CreateWordInfoSection";
import { CreateWordDefinitionSection } from "./CreateWordDefinitionSection";
import { PartOfSpeechOption } from "./CreateWordPartOfSpeechSection";

export interface Example {
  example_sentence: string;
  mean_example_sentence: string;
}
export interface Definition {
  parts_of_speech: string;
  definition: string;
  examples: Example[];
}
export interface CreateWordFormData {
  word: string;
  pronunciation: string;
  frequency: string;
  language_level: string;
  usage_notes: string[];
  definitions: Definition[];
  image_files?: File[];
  topic: string[];
  tags: string[];
  score: number;
}
export interface CreateWordDrawerProps {
  open: boolean;
  onClose: () => void;
  defaultWord?: string;
}
const frequencyBtnOptions = [
  { value: "high", label: "Cao" },
  { value: "medium", label: "Trung bình" },
  { value: "low", label: "Thấp" },
];
const frequencyBtnColors = ["greenPastel", "yellow", "red"];
const levelBtnOptions = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];
const levelBtnColors = ["blueSky", "violet", "pink"];
const scoreOptionsCombobox = Array.from({ length: 10 }, (_, i) => ({
  value: ((i + 1) * 10).toString(),
  label: ((i + 1) * 10).toString(),
}));
const topicOptions = [
  { value: "education", label: "Education" },
  { value: "business", label: "Business" },
];
const tagOptions = [
  { value: "academic", label: "Academic" },
  { value: "slang", label: "Slang" },
];
const partsOfSpeechOptions: PartOfSpeechOption[] = [
  {
    value: "verb",
    label: "Động từ",
    color: "bg-indigo-100 text-indigo-700 border-indigo-200",
  },
  {
    value: "noun",
    label: "Danh từ",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  {
    value: "adjective",
    label: "Tính từ",
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  {
    value: "adverb",
    label: "Trạng từ",
    color: "bg-rose-100 text-rose-700 border-rose-200",
  },
  {
    value: "article",
    label: "Mạo từ",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  {
    value: "pronoun",
    label: "Đại từ",
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
  {
    value: "preposition",
    label: "Giới từ",
    color: "bg-teal-100 text-teal-700 border-teal-200",
  },
  {
    value: "conjunction",
    label: "Liên từ",
    color: "bg-gray-100 text-gray-700 border-gray-200",
  },
  {
    value: "determiner",
    label: "Từ hạn định",
    color: "bg-pink-100 text-pink-700 border-pink-200",
  },
  {
    value: "interjection",
    label: "Thán từ",
    color: "bg-orange-100 text-orange-700 border-orange-200",
  },
  {
    value: "auxiliary",
    label: "Trợ động từ",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  {
    value: "numeral",
    label: "Số từ",
    color: "bg-green-100 text-green-700 border-green-200",
  },
  {
    value: "particle",
    label: "Tiểu từ",
    color: "bg-cyan-100 text-cyan-700 border-cyan-200",
  },
  {
    value: "exclamative",
    label: "Từ cảm thán",
    color: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200",
  },
];

interface FindResponse {
  code: number;
  message: string;
  data: {
    id: string;
    word: string;
    pronunciation: string;
    frequency: string;
    usage_notes: string[];
    language_level: string;
    created_at: string;
    updated_at: string;
    definitions: Array<{
      id: string;
      parts_of_speech: string;
      definition: string;
      is_main_definition: boolean;
      examples: Array<{
        id: string;
        example_sentence: string;
        mean_example_sentence: string;
        created_at: string;
        updated_at: string;
      }>;
      created_at: string;
      updated_at: string;
    }>;
    relationships: Array<{
      id: string;
      related_id: string;
      related_type: string;
      relationship_type: string;
      word: string;
      created_at: string;
      updated_at: string;
    }>;
  };
}

// Helper functions for validation
const isEnglish = (text: string) => /^[a-zA-Z0-9\s.,!?'"()-]*$/.test(text);
const isVietnamese = (text: string) => /[\u00C0-\u1EF9]/.test(text);

export function CreateWordDrawer({
  open,
  onClose,
  defaultWord,
}: CreateWordDrawerProps) {
  const [usageNoteInput, setUsageNoteInput] = useState("");
  const [hasOpened, setHasOpened] = useState(false);
  const [wordExists, setWordExists] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<FindResponse["data"] | null>(
    null
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasCheckedWord, setHasCheckedWord] = useState(false);
  const [lastCheckedWord, setLastCheckedWord] = useState("");
  const [, setShowGeminiSettings] = useState(false);
  const [, setImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateWordFormData>({
    defaultValues: {
      word: "",
      pronunciation: "",
      frequency: "",
      language_level: "",
      usage_notes: [],
      topic: [],
      tags: [],
      score: 10,
      image_files: [],
      definitions: [
        {
          parts_of_speech: "",
          definition: "",
          examples: [{ example_sentence: "", mean_example_sentence: "" }],
        },
      ],
    },
    mode: "onChange",
    criteriaMode: "all",
    shouldUnregister: false,
    delayError: 0,
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  useEffect(() => {
    const imageFiles = form.watch("image_files") || [];
    const urls = imageFiles.map((file) => URL.createObjectURL(file));
    setImageUrls(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [form.watch("image_files")]);

  const {
    fields: definitionFields,
    append: appendDefinition,
    remove: removeDefinition,
  } = useFieldArray({
    control: form.control,
    name: "definitions",
    rules: {
      required: "Cần ít nhất một định nghĩa",
      validate: {
        atLeastOne: (value) => {
          if (!value || value.length === 0) return "Cần ít nhất một định nghĩa";
          return true;
        },
      },
    },
  });

  const handleCheckWord = async () => {
    const word = form.getValues("word");
    if (!word.trim()) return;
    setIsChecking(true);
    try {
      const response = await ApiService.get<FindResponse>(
        `/wiki/word/find?word=${encodeURIComponent(word)}`
      );
      if (
        response.code === 200 &&
        response.data.word.toLowerCase() === word.trim().toLowerCase()
      ) {
        setCheckResult(response.data);
        setWordExists(true);
      } else {
        setCheckResult(null);
        setWordExists(false);
      }
      setLastCheckedWord(word);
    } catch (error) {
      if ((error as any)?.response?.status === 404) {
        setCheckResult(null);
        setWordExists(false);
        setLastCheckedWord(word);
      } else {
        console.error("Error checking word:", error);
        setCheckResult(null);
        setWordExists(false);
      }
    }
    setIsChecking(false);
    setHasCheckedWord(true);
  };

  const handleGeminiClick = async () => {
    const word = form.getValues("word");
    if (!word.trim()) return;
    setIsGenerating(true);
    try {
      const suggestion = await GeminiWordService.generateWordDetails(word);
      if (suggestion) {
        form.setValue("pronunciation", suggestion.pronunciation);
        form.setValue("frequency", suggestion.frequency);
        form.setValue("language_level", suggestion.language_level);
        form.setValue("usage_notes", suggestion.usage_notes);
        form.setValue("definitions", suggestion.definitions);
        if (suggestion.topic) form.setValue("topic", suggestion.topic);
        if (suggestion.tags) form.setValue("tags", suggestion.tags);
        if (suggestion.score) form.setValue("score", suggestion.score);
        await form.trigger();
      }
    } catch (error) {
      console.error("Error generating word details:", error);
    }
    setIsGenerating(false);
  };

  // Update form when defaultWord changes
  useEffect(() => {
    if (defaultWord) {
      form.setValue("word", defaultWord);
    }
  }, [defaultWord, form]);

  const handleAddUsageNote = () => {
    if (usageNoteInput.trim()) {
      const currentNotes = form.getValues("usage_notes") || [];
      form.setValue("usage_notes", [...currentNotes, usageNoteInput]);
      setUsageNoteInput("");
      form.trigger("usage_notes");
    }
  };
  const handleRemoveUsageNote = (index: number) => {
    const currentNotes = form.getValues("usage_notes") || [];
    form.setValue(
      "usage_notes",
      currentNotes.filter((_: string, i: number) => i !== index)
    );
    form.trigger("usage_notes");
  };

  // Handle initial validation when drawer opens
  useEffect(() => {
    if (open && !hasOpened) {
      setHasOpened(true);
      const validateForm = async () => {
        await form.trigger();
        const fields = [
          "word",
          "pronunciation",
          "frequency",
          "language_level",
          "usage_notes",
        ] as const;
        fields.forEach((field) => {
          form.setError(field, {
            type: "required",
            message: `Vui lòng nhập ${
              field === "word"
                ? "từ"
                : field === "pronunciation"
                ? "phát âm"
                : field === "frequency"
                ? "tần suất"
                : field === "language_level"
                ? "cấp độ"
                : "ghi chú"
            }`,
          });
        });
        form.setError("definitions", {
          type: "required",
          message: "Cần ít nhất một định nghĩa",
        });
        definitionFields.forEach((_, index) => {
          form.setError(`definitions.${index}.parts_of_speech`, {
            type: "required",
            message: "Vui lòng chọn loại từ",
          });
          form.setError(`definitions.${index}.definition`, {
            type: "required",
            message: "Vui lòng nhập định nghĩa",
          });
          const examples =
            form.getValues(`definitions.${index}.examples`) || [];
          examples.forEach((_, exampleIndex) => {
            form.setError(
              `definitions.${index}.examples.${exampleIndex}.example_sentence`,
              {
                type: "required",
                message: "Vui lòng nhập câu ví dụ",
              }
            );
            form.setError(
              `definitions.${index}.examples.${exampleIndex}.mean_example_sentence`,
              {
                type: "required",
                message: "Vui lòng nhập nghĩa của câu",
              }
            );
          });
        });
        form.trigger();
      };
      validateForm();
    }
    if (!open) {
      setHasOpened(false);
    }
  }, [open, form, definitionFields, hasOpened]);

  // Re-validate when definitions change
  useEffect(() => {
    if (definitionFields.length > 0) {
      form.trigger("definitions");
    }
  }, [definitionFields.length]);

  // Watch word field changes to update button state
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "word" && value.word !== lastCheckedWord) {
        setWordExists(false);
        setCheckResult(null);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, lastCheckedWord]);

  return (
    <>
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent
          side="right"
          className="!w-[45%] overflow-y-auto bg-[#f6f6f0]"
        >
          {/* HEADER */}
          <div className="flex items-center justify-between mb-8">
            {/* Title left */}
            <h2 className="text-lg font-semibold text-[#2D3748]">
              Thêm từ mới
            </h2>

            {/* Actions right */}
            <div className="flex gap-2">
              <Button
                type="submit"
                className="flex gap-2 items-center bg-[#52aaa5] hover:bg-[#52aaa5]/90"
                disabled={isSubmitting}
                onClick={form.handleSubmit(async (data) => {
                  setIsSubmitting(true);
                  try {
                    const invalidDefinition = data.definitions.find(
                      (def) => !def.examples || def.examples.length === 0
                    );
                    if (invalidDefinition) {
                      form.setError("definitions", {
                        type: "custom",
                        message: "Mỗi định nghĩa phải có ít nhất một ví dụ",
                      });
                      setIsSubmitting(false);
                      return;
                    }
                    const formData = new FormData();
                    const jsonData = {
                      word: data.word,
                      pronunciation: data.pronunciation,
                      frequency: data.frequency,
                      language_level: data.language_level,
                      usage_notes: data.usage_notes,
                      topic: data.topic,
                      tags: data.tags,
                      score: data.score,
                      definitions: data.definitions.map((def, index) => ({
                        parts_of_speech: def.parts_of_speech,
                        definition: def.definition,
                        is_main_definition: index === 0,
                        examples: def.examples,
                      })),
                    };
                    formData.append("data", JSON.stringify(jsonData));
                    if (data.image_files) {
                      data.image_files.forEach((file) => {
                        formData.append("images", file);
                      });
                    }
                    await ApiService.post("/wiki/word", formData, true, true);
                    onClose();
                  } catch (error) {
                    console.error("Error creating word:", error);
                  } finally {
                    setIsSubmitting(false);
                  }
                })}
              >
                <Plus className="h-4 w-4" />
                {isSubmitting ? "Đang tạo từ..." : "Tạo từ mới"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-[#2D3748] hover:text-red-500 hover:bg-red-50"
                disabled={isSubmitting}
                aria-label="Đóng"
              >
                <span className="sr-only">Đóng</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </Button>
            </div>
          </div>

          <Form {...form}>
            <form
              className="h-full flex flex-col"
              onChange={() => {
                form.trigger();
              }}
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="space-y-6 flex-1 overflow-y-auto">
                {/* ------------ BASE INFO --------------- */}
                <CreateWordInfoSection
                  form={form}
                  frequencyBtnOptions={frequencyBtnOptions}
                  frequencyBtnColors={frequencyBtnColors}
                  levelBtnOptions={levelBtnOptions}
                  levelBtnColors={levelBtnColors}
                  topicOptions={topicOptions}
                  tagOptions={tagOptions}
                  scoreOptionsCombobox={scoreOptionsCombobox}
                  isSubmitting={isSubmitting}
                  handleCheckWord={handleCheckWord}
                  isChecking={isChecking}
                  searchBtnDisabled={
                    isChecking ||
                    !(form.watch("word") as string) ||
                    (form.watch("word") as string) === lastCheckedWord
                  }
                  searchBtnClassName={
                    isChecking
                      ? "border-[#52aaa5]/50 text-[#52aaa5]/50"
                      : form.watch("word") === lastCheckedWord && checkResult
                      ? "border-green-500 text-green-500 hover:bg-green-50"
                      : form.watch("word") &&
                        form.watch("word") !== lastCheckedWord
                      ? "border-yellow-500 text-yellow-500 hover:bg-yellow-50"
                      : "border-[#52aaa5] text-[#52aaa5] hover:bg-[#52aaa5]/10"
                  }
                  hasCheckedWord={hasCheckedWord}
                  wordExists={wordExists}
                  isGenerating={isGenerating}
                  handleGeminiClick={handleGeminiClick}
                  onShowGeminiSetting={() => setShowGeminiSettings(true)}
                  sparklesBtnClassName={
                    isGenerating
                      ? "border-yellow-500 text-yellow-500"
                      : "border-[#52aaa5] text-[#52aaa5] hover:bg-[#52aaa5]/10"
                  }
                  checkResult={checkResult}
                  usageNoteInput={usageNoteInput}
                  setUsageNoteInput={setUsageNoteInput}
                  handleAddUsageNote={handleAddUsageNote}
                  handleRemoveUsageNote={handleRemoveUsageNote}
                />

                {/* ------------ DEFINITIONS SECTION --------------- */}
                <CreateWordDefinitionSection
                  form={form}
                  definitionFields={definitionFields}
                  appendDefinition={appendDefinition}
                  removeDefinition={removeDefinition}
                  partsOfSpeechOptions={partsOfSpeechOptions}
                  isVietnamese={isVietnamese}
                  isEnglish={isEnglish}
                />
              </div>

              {/* Loading Overlay */}
              {isSubmitting && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#52aaa5] border-t-transparent"></div>
                </div>
              )}
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </>
  );
}

import { useState, useEffect } from "react";
import ApiService from "../../../../../../service/ApiService";
import { GeminiPhraseService } from "../../../services/GeminiPhraseService";
import { useForm, useFieldArray } from "react-hook-form";
import { Sheet, SheetContent } from "../../../../../components/ui/sheet";
import { Button } from "../../../../../components/ui/button";
import { Plus } from "lucide-react";
import { Form } from "../../../../../components/ui/form";
import { CreatePhraseInfoSection } from "./CreatePhraseInfoSection";
import { CreatePhraseDefinitionSection } from "./CreatePhraseDefinitionSection";
import { PartOfSpeechOption } from "./CreatePhrasePartOfSpeechSection";
export interface Example {
  example_sentence: string;
  mean_example_sentence: string;
}
export interface Definition {
  parts_of_speech: string;
  definition: string;
  examples: Example[];
}
export interface CreatePhraseFormData {
  phrase: string;
  pronunciation: string;
  frequency: string;
  language_level: string;
  usage_notes: string[];
  definitions: Definition[];
  image_files?: File[];
}
export interface CreatePhraseDrawerProps {
  open: boolean;
  onClose: () => void;
  defaultPhrase?: string;
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
const partsOfSpeechOptions: PartOfSpeechOption[] = [
  {
    value: "noun_phrase",
    label: "Cụm danh từ",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  {
    value: "verb_phrase",
    label: "Cụm động từ",
    color: "bg-indigo-100 text-indigo-700 border-indigo-200",
  },
  {
    value: "adjective_phrase",
    label: "Cụm tính từ",
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  {
    value: "adverb_phrase",
    label: "Cụm trạng từ",
    color: "bg-rose-100 text-rose-700 border-rose-200",
  },
  {
    value: "prepositional_phrase",
    label: "Cụm giới từ",
    color: "bg-teal-100 text-teal-700 border-teal-200",
  },
  {
    value: "gerund_phrase",
    label: "Cụm danh động từ",
    color: "bg-pink-100 text-pink-700 border-pink-200",
  },
  {
    value: "infinitive_phrase",
    label: "Cụm động từ nguyên mẫu",
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
  {
    value: "participial_phrase",
    label: "Cụm phân từ",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  {
    value: "absolute_phrase",
    label: "Cụm tuyệt đối",
    color: "bg-lime-100 text-lime-700 border-lime-200",
  },
  {
    value: "appositive_phrase",
    label: "Cụm đồng vị",
    color: "bg-gray-100 text-gray-700 border-gray-200",
  },
  {
    value: "phrasal_verb",
    label: "Cụm động từ (phrasal verb)",
    color: "bg-cyan-100 text-cyan-700 border-cyan-200",
  },
  {
    value: "idiom",
    label: "Thành ngữ",
    color: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200",
  },
  {
    value: "collocation",
    label: "Cụm từ kết hợp",
    color: "bg-green-100 text-green-700 border-green-200",
  },
  {
    value: "fixed_expression",
    label: "Cụm cố định",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
];

// Helper functions for validation
const isEnglish = (text: string) => /^[a-zA-Z0-9\s.,!?'"()-]*$/.test(text);
const isVietnamese = (text: string) => /[\u00C0-\u1EF9]/.test(text);

export function CreatePhraseDrawer({
  open,
  onClose,
  defaultPhrase,
}: CreatePhraseDrawerProps) {
  const [usageNoteInput, setUsageNoteInput] = useState("");
  const [hasOpened, setHasOpened] = useState(false);
  const [phraseExists, setPhraseExists] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<any | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasCheckedPhrase, setHasCheckedPhrase] = useState(false);
  const [lastCheckedPhrase, setLastCheckedPhrase] = useState("");
  const [, setImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreatePhraseFormData>({
    defaultValues: {
      phrase: "",
      pronunciation: "",
      frequency: "",
      language_level: "",
      usage_notes: [],
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

  const handleCheckPhrase = async () => {
    const phrase = form.getValues("phrase");
    if (!phrase.trim()) return;
    setIsChecking(true);
    try {
      const response = await ApiService.get<any>(
        `/wiki/phrase/find?phrase=${encodeURIComponent(phrase)}`
      );
      if (
        response.code === 200 &&
        response.data.phrase.toLowerCase() === phrase.trim().toLowerCase()
      ) {
        setCheckResult(response.data);
        setPhraseExists(true);
      } else {
        setCheckResult(null);
        setPhraseExists(false);
      }
      setLastCheckedPhrase(phrase);
    } catch (error) {
      if ((error as any)?.response?.status === 404) {
        setCheckResult(null);
        setPhraseExists(false);
        setLastCheckedPhrase(phrase);
      } else {
        setCheckResult(null);
        setPhraseExists(false);
      }
    }
    setIsChecking(false);
    setHasCheckedPhrase(true);
  };

  const handleGeminiClick = async () => {
    const phrase = form.getValues("phrase");
    if (!phrase.trim()) return;
    setIsGenerating(true);
    try {
      const suggestion = await GeminiPhraseService.generatePhraseDetails(
        phrase
      );
      if (suggestion) {
        form.setValue("pronunciation", suggestion.pronunciation);
        form.setValue("frequency", suggestion.frequency);
        form.setValue("language_level", suggestion.language_level);
        form.setValue("usage_notes", suggestion.usage_notes);
        form.setValue("definitions", suggestion.definitions);
        await form.trigger();
      }
    } catch (error) {
      // You may want to display an error toast here
    }
    setIsGenerating(false);
  };

  // Update form when defaultPhrase changes
  useEffect(() => {
    if (defaultPhrase) {
      form.setValue("phrase", defaultPhrase);
    }
  }, [defaultPhrase, form]);

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
          "phrase",
          "pronunciation",
          "frequency",
          "language_level",
          "usage_notes",
        ] as const;
        fields.forEach((field) => {
          form.setError(field, {
            type: "required",
            message: `Vui lòng nhập ${
              field === "phrase"
                ? "cụm từ"
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
            message: "Vui lòng chọn loại cụm từ",
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

  // Watch phrase field changes to update button state
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "phrase" && value.phrase !== lastCheckedPhrase) {
        setPhraseExists(false);
        setCheckResult(null);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, lastCheckedPhrase]);

  return (
    <>
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent
          side="right"
          className="!w-[45%] overflow-y-auto bg-[#f6f6f0]"
        >
          {/* HEADER */}
          <div className="flex justify-between items-center mb-8">
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
                    phrase: data.phrase,
                    pronunciation: data.pronunciation,
                    frequency: data.frequency,
                    language_level: data.language_level,
                    usage_notes: data.usage_notes,
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
                  await ApiService.post("/wiki/phrase", formData, true, true);
                  onClose();
                } catch (error) {
                  // Error handling
                } finally {
                  setIsSubmitting(false);
                }
              })}
            >
              <Plus className="h-4 w-4" />
              {isSubmitting ? "Đang tạo cụm từ..." : "Tạo cụm từ mới"}
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
          <Form {...form}>
            <form
              className="h-full flex flex-col"
              onChange={() => form.trigger()}
              onSubmit={(e) => e.preventDefault()}
            >
              <h2 className="text-lg font-semibold mb-6 text-[#2D3748]">
                Thêm cụm từ mới
              </h2>
              <div className="space-y-6 flex-1 overflow-y-auto">
                {/* ------------ BASE INFO --------------- */}
                <CreatePhraseInfoSection
                  form={form}
                  frequencyBtnOptions={frequencyBtnOptions}
                  frequencyBtnColors={frequencyBtnColors}
                  levelBtnOptions={levelBtnOptions}
                  levelBtnColors={levelBtnColors}
                  isSubmitting={isSubmitting}
                  handleCheckPhrase={handleCheckPhrase}
                  isChecking={isChecking}
                  searchBtnDisabled={
                    isChecking ||
                    !(form.watch("phrase") as string) ||
                    (form.watch("phrase") as string) === lastCheckedPhrase
                  }
                  searchBtnClassName={
                    isChecking
                      ? "border-[#52aaa5]/50 text-[#52aaa5]/50"
                      : form.watch("phrase") === lastCheckedPhrase &&
                        checkResult
                      ? "border-green-500 text-green-500 hover:bg-green-50"
                      : form.watch("phrase") &&
                        form.watch("phrase") !== lastCheckedPhrase
                      ? "border-yellow-500 text-yellow-500 hover:bg-yellow-50"
                      : "border-[#52aaa5] text-[#52aaa5] hover:bg-[#52aaa5]/10"
                  }
                  hasCheckedPhrase={hasCheckedPhrase}
                  phraseExists={phraseExists}
                  isGenerating={isGenerating}
                  handleGeminiClick={handleGeminiClick}
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
                <CreatePhraseDefinitionSection
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

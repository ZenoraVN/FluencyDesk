import { FC, useEffect, useRef } from "react";
import {
  useFormContext,
  useFieldArray,
  UseFormStateReturn,
} from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/presentation/components/ui/form";
import { Button } from "@/presentation/components/ui/button";
import {
  Plus,
  Minus,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
} from "lucide-react";

export interface SentenceCompletionFormData {
  sentence_completions: Array<{
    original_sentence: string;
    start_phrase: string;
    middle_phrase: string | null;
    end_phrase: string | null;
    true_sentences: string[];
    explain: string;
  }>;
}

interface SentenceCompletionFormProps {
  initialData?: SentenceCompletionFormData;
}

interface BaseRenderProps<T = string> {
  field: {
    onChange: (...event: any[]) => void;
    onBlur: () => void;
    value: T;
    name: string;
    ref?: React.Ref<any>;
  };
  fieldState: { error?: { type: string; message?: string } };
  formState: UseFormStateReturn<SentenceCompletionFormData>;
}

type RenderProps = BaseRenderProps;
type NullableRenderProps = BaseRenderProps<string | null>;
type TrueSentencesRenderProps = BaseRenderProps<string[]>;

export const SentenceCompletionForm: FC<SentenceCompletionFormProps> = ({
  initialData,
}): JSX.Element => {
  const form = useFormContext<SentenceCompletionFormData>();
  const initialized = useRef(false);

  const { fields, append, remove } = useFieldArray<SentenceCompletionFormData>({
    control: form.control,
    name: "sentence_completions",
    rules: {
      required: "Vui lòng thêm ít nhất một câu hoàn thành",
      validate: {
        maxTen: (value) =>
          (value && value.length <= 10) || "Chỉ được tối đa 10 câu hoàn thành",
        noDuplicates: (value) => {
          if (!value) return true;
          const sentences = value.map((v) => v.original_sentence.trim());
          const uniqueSentences = new Set(sentences);
          return (
            sentences.length === uniqueSentences.size ||
            "Các câu gốc không được trùng nhau"
          );
        },
        uniqueExplanations: (value) => {
          if (!value) return true;
          const explanations = value
            .map((v) => v.explain?.trim())
            .filter(Boolean);
          return (
            explanations.length === new Set(explanations).size ||
            "Các giải thích không được trùng nhau"
          );
        },
      },
    },
  });

  // Initialize with 2 default items if no initial data
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      const hasInitialItems =
        initialData &&
        Array.isArray(initialData.sentence_completions) &&
        initialData.sentence_completions.length > 0;
      if (!hasInitialItems && fields.length === 0) {
        append({
          original_sentence: "",
          start_phrase: "",
          middle_phrase: null,
          end_phrase: null,
          true_sentences: [""],
          explain: "",
        });
      }
    }
  }, [initialData, fields.length, append]);

  // Trigger initial validation
  useEffect(() => {
    form.trigger(["sentence_completions"]);
  }, []); // Run only once on mount

  // Trigger validation when fields change
  useEffect(() => {
    if (fields.length > 0) {
      form.trigger("sentence_completions");
    }
  }, [fields.length]); // Run when number of fields changes

  return (
    <Form {...form}>
      <div className="space-y-6">
        {/* Sentence Completions Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-gray-200">
            <div>
              <h4 className="text-sm font-medium text-[#2D3748]">
                Các câu hoàn thành
              </h4>
              {form.formState.errors.sentence_completions?.root && (
                <div className="text-sm text-red-500 mt-1">
                  {form.formState.errors.sentence_completions.root.message}
                </div>
              )}
            </div>
            {fields.length < 10 && (
              <Button
                type="button"
                onClick={() =>
                  append({
                    original_sentence: "",
                    start_phrase: "",
                    middle_phrase: null,
                    end_phrase: null,
                    true_sentences: [""],
                    explain: "",
                  })
                }
                className="flex items-center gap-2 px-4 py-1.5 text-sm bg-[#52aaa5]/10 text-[#52aaa5] hover:bg-[#52aaa5]/20 rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                Thêm câu hoàn thành
              </Button>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="relative rounded-lg border border-gray-200  p-6 shadow-sm"
              >
                <div className="flex justify-between items-center mb-4">
                  <h5 className="text-sm font-medium text-[#2D3748]">
                    Câu hoàn thành {index + 1}
                  </h5>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => remove(index)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded-lg"
                    >
                      <Minus className="h-4 w-4" />
                      Xóa
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Original Sentence */}
                  <FormField
                    control={form.control}
                    name={`sentence_completions.${index}.original_sentence`}
                    rules={{
                      required: "Vui lòng nhập câu gốc",
                    }}
                    render={({
                      field: originalField,
                      fieldState: { error },
                    }: RenderProps) => (
                      <FormItem>
                        <FormLabel className="text-[#2D3748] font-medium">
                          Câu gốc
                        </FormLabel>
                        <FormControl>
                          <textarea
                            {...originalField}
                            placeholder="Nhập câu gốc cần hoàn thành"
                            className={`w-full min-h-[40px] px-3 py-2 rounded-md resize-none overflow-hidden bg-transparent text-[#2D3748] border ${
                              error
                                ? "border-red-500 focus:ring-2 focus:ring-red-500"
                                : "border-[#52aaa5] hover:border-[#52aaa5] focus:border-[#52aaa5] focus:ring-2 focus:ring-[#52aaa5]/20"
                            }`}
                            onChange={(e) => {
                              e.target.style.height = "auto";
                              e.target.style.height =
                                e.target.scrollHeight + "px";
                              originalField.onChange(e);
                              form.trigger("sentence_completions");
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Start Phrase */}
                  <FormField
                    control={form.control}
                    name={`sentence_completions.${index}.start_phrase`}
                    render={({ field: startField }: RenderProps) => (
                      <FormItem>
                        <FormLabel className="text-[#2D3748] font-medium">
                          Phần bắt đầu
                        </FormLabel>
                        <FormControl>
                          <textarea
                            {...startField}
                            placeholder="Nhập phần bắt đầu câu (ví dụ: If I)"
                            className="w-full min-h-[40px] px-3 py-2 rounded-md resize-none overflow-hidden bg-transparent text-[#2D3748] border border-[#52aaa5] hover:border-[#52aaa5] focus:border-[#52aaa5] focus:ring-2 focus:ring-[#52aaa5]/20"
                            onChange={(e) => {
                              e.target.style.height = "auto";
                              e.target.style.height =
                                e.target.scrollHeight + "px";
                              startField.onChange(e);
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Middle Phrase */}
                  <FormField
                    control={form.control}
                    name={`sentence_completions.${index}.middle_phrase`}
                    render={({ field: middleField }: NullableRenderProps) => (
                      <FormItem>
                        <FormLabel className="text-[#2D3748] font-medium">
                          Phần giữa
                        </FormLabel>
                        <FormControl>
                          <textarea
                            {...middleField}
                            value={middleField.value || ""}
                            placeholder="Nhập phần giữa câu (nếu có)"
                            className="w-full min-h-[40px] px-3 py-2 rounded-md resize-none overflow-hidden bg-transparent text-[#2D3748] border border-[#52aaa5] hover:border-[#52aaa5] focus:border-[#52aaa5] focus:ring-2 focus:ring-[#52aaa5]/20"
                            onChange={(e) => {
                              e.target.style.height = "auto";
                              e.target.style.height =
                                e.target.scrollHeight + "px";
                              middleField.onChange(e.target.value || null);
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* End Phrase */}
                  <FormField
                    control={form.control}
                    name={`sentence_completions.${index}.end_phrase`}
                    render={({ field: endField }: NullableRenderProps) => (
                      <FormItem>
                        <FormLabel className="text-[#2D3748] font-medium">
                          Phần cuối
                        </FormLabel>
                        <FormControl>
                          <textarea
                            {...endField}
                            value={endField.value || ""}
                            placeholder="Nhập phần cuối câu (nếu có)"
                            className="w-full min-h-[40px] px-3 py-2 rounded-md resize-none overflow-hidden bg-transparent text-[#2D3748] border border-[#52aaa5] hover:border-[#52aaa5] focus:border-[#52aaa5] focus:ring-2 focus:ring-[#52aaa5]/20"
                            onChange={(e) => {
                              e.target.style.height = "auto";
                              e.target.style.height =
                                e.target.scrollHeight + "px";
                              endField.onChange(e.target.value || null);
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* True Sentences */}
                  <FormField
                    control={form.control}
                    name={`sentence_completions.${index}.true_sentences`}
                    rules={{
                      required: "Vui lòng nhập ít nhất một câu đúng",
                      validate: {
                        hasValidSentence: (value: string[]) => {
                          if (!value || value.length === 0)
                            return "Vui lòng nhập ít nhất một câu đúng";
                          const validSentences = value.filter(
                            (s) => s && s.trim().length > 0
                          );
                          return (
                            validSentences.length > 0 ||
                            "Vui lòng nhập ít nhất một câu đúng"
                          );
                        },
                      },
                    }}
                    render={({
                      field: trueSentencesField,
                      fieldState: { error },
                    }: TrueSentencesRenderProps) => (
                      <FormItem>
                        <div className="flex justify-between items-center">
                          <FormLabel className="text-[#2D3748] font-medium">
                            Các câu đúng có thể chấp nhận
                          </FormLabel>
                          <Button
                            type="button"
                            onClick={() => {
                              const newSentences = [
                                ...(trueSentencesField.value || []),
                                "",
                              ];
                              trueSentencesField.onChange(newSentences);
                            }}
                            className="flex items-center gap-2 px-4 py-1.5 text-sm bg-[#52aaa5]/10 text-[#52aaa5] hover:bg-[#52aaa5]/20 rounded-lg transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                            Thêm câu đúng
                          </Button>
                        </div>
                        <FormControl>
                          <div className="space-y-2">
                            {(trueSentencesField.value || [""]).map(
                              (sentence, sentenceIndex) => (
                                <div key={sentenceIndex} className="flex gap-2">
                                  <textarea
                                    value={sentence}
                                    onChange={(e) => {
                                      const newSentences = [
                                        ...trueSentencesField.value,
                                      ];
                                      newSentences[sentenceIndex] =
                                        e.target.value;
                                      trueSentencesField.onChange(newSentences);
                                      form.trigger(
                                        `sentence_completions.${index}.true_sentences`
                                      );
                                    }}
                                    placeholder={`Câu đúng ${
                                      sentenceIndex + 1
                                    }`}
                                    className={`flex-1 min-h-[40px] px-3 py-2 rounded-md resize-none overflow-hidden bg-transparent text-[#2D3748] border ${
                                      error
                                        ? "border-red-500 focus:ring-2 focus:ring-red-500"
                                        : "border-[#52aaa5] hover:border-[#52aaa5] focus:border-[#52aaa5] focus:ring-2 focus:ring-[#52aaa5]/20"
                                    }`}
                                    onInput={(e) => {
                                      const target =
                                        e.target as HTMLTextAreaElement;
                                      target.style.height = "auto";
                                      target.style.height =
                                        target.scrollHeight + "px";
                                    }}
                                  />
                                  {trueSentencesField.value.length > 1 && (
                                    <Button
                                      type="button"
                                      onClick={() => {
                                        const newSentences =
                                          trueSentencesField.value.filter(
                                            (_, i) => i !== sentenceIndex
                                          );
                                        trueSentencesField.onChange(
                                          newSentences
                                        );
                                        form.trigger(
                                          `sentence_completions.${index}.true_sentences`
                                        );
                                      }}
                                      className="flex items-center justify-center h-10 w-10 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg"
                                    >
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              )
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Explanation */}
                  <FormField
                    control={form.control}
                    name={`sentence_completions.${index}.explain`}
                    rules={{
                      required: "Vui lòng nhập giải thích",
                      validate: (value: string) => {
                        if (!value?.trim()) return "Vui lòng nhập giải thích";
                        return true;
                      },
                    }}
                    render={({
                      field: explainField,
                      fieldState: { error },
                    }: RenderProps) => (
                      <FormItem>
                        <FormLabel className="text-[#2D3748] font-medium">
                          Giải thích
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <div className="mt-2 space-y-2">
                              <div className="flex items-center gap-1 p-1 border border-[#52aaa5]/20 rounded-t-lg bg-transparent">
                                <div className="flex items-center gap-1 pr-2 border-r border-[#52aaa5]/20">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const textarea = document.querySelector(
                                        `textarea[name="sentence_completions.${index}.explain"]`
                                      ) as HTMLTextAreaElement;
                                      const start = textarea.selectionStart;
                                      const end = textarea.selectionEnd;
                                      const text = textarea.value;
                                      const newText =
                                        text.substring(0, start) +
                                        "# " +
                                        text.substring(start, end) +
                                        text.substring(end);
                                      explainField.onChange(newText);
                                    }}
                                    className="p-2 rounded hover:bg-[#52aaa5]/10"
                                  >
                                    <Heading1
                                      size={18}
                                      className="text-[#2D3748]"
                                    />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const textarea = document.querySelector(
                                        `textarea[name="sentence_completions.${index}.explain"]`
                                      ) as HTMLTextAreaElement;
                                      const start = textarea.selectionStart;
                                      const end = textarea.selectionEnd;
                                      const text = textarea.value;
                                      const newText =
                                        text.substring(0, start) +
                                        "## " +
                                        text.substring(start, end) +
                                        text.substring(end);
                                      explainField.onChange(newText);
                                    }}
                                    className="p-2 rounded hover:bg-[#52aaa5]/10"
                                  >
                                    <Heading2
                                      size={18}
                                      className="text-[#2D3748]"
                                    />
                                  </button>
                                </div>

                                <div className="flex items-center gap-1 px-2 border-r border-[#52aaa5]/20">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const textarea = document.querySelector(
                                        `textarea[name="sentence_completions.${index}.explain"]`
                                      ) as HTMLTextAreaElement;
                                      const start = textarea.selectionStart;
                                      const end = textarea.selectionEnd;
                                      const text = textarea.value;
                                      const newText =
                                        text.substring(0, start) +
                                        "**" +
                                        text.substring(start, end) +
                                        "**" +
                                        text.substring(end);
                                      explainField.onChange(newText);
                                    }}
                                    className="p-2 rounded hover:bg-[#52aaa5]/10"
                                  >
                                    <Bold
                                      size={18}
                                      className="text-[#2D3748]"
                                    />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const textarea = document.querySelector(
                                        `textarea[name="sentence_completions.${index}.explain"]`
                                      ) as HTMLTextAreaElement;
                                      const start = textarea.selectionStart;
                                      const end = textarea.selectionEnd;
                                      const text = textarea.value;
                                      const newText =
                                        text.substring(0, start) +
                                        "_" +
                                        text.substring(start, end) +
                                        "_" +
                                        text.substring(end);
                                      explainField.onChange(newText);
                                    }}
                                    className="p-2 rounded hover:bg-[#52aaa5]/10"
                                  >
                                    <Italic
                                      size={18}
                                      className="text-[#2D3748]"
                                    />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const textarea = document.querySelector(
                                        `textarea[name="sentence_completions.${index}.explain"]`
                                      ) as HTMLTextAreaElement;
                                      const start = textarea.selectionStart;
                                      const end = textarea.selectionEnd;
                                      const text = textarea.value;
                                      const newText =
                                        text.substring(0, start) +
                                        "__" +
                                        text.substring(start, end) +
                                        "__" +
                                        text.substring(end);
                                      explainField.onChange(newText);
                                    }}
                                    className="p-2 rounded hover:bg-[#52aaa5]/10"
                                  >
                                    <Underline
                                      size={18}
                                      className="text-[#2D3748]"
                                    />
                                  </button>
                                </div>

                                <div className="flex items-center gap-1 px-2">
                                  <button
                                    type="button"
                                    className="p-2 rounded hover:bg-[#52aaa5]/10"
                                  >
                                    <AlignLeft
                                      size={18}
                                      className="text-[#2D3748]"
                                    />
                                  </button>
                                  <button
                                    type="button"
                                    className="p-2 rounded hover:bg-[#52aaa5]/10"
                                  >
                                    <AlignCenter
                                      size={18}
                                      className="text-[#2D3748]"
                                    />
                                  </button>
                                  <button
                                    type="button"
                                    className="p-2 rounded hover:bg-[#52aaa5]/10"
                                  >
                                    <AlignRight
                                      size={18}
                                      className="text-[#2D3748]"
                                    />
                                  </button>
                                </div>
                              </div>
                              <div className="relative">
                                <textarea
                                  name={`sentence_completions.${index}.explain`}
                                  value={explainField.value || ""}
                                  onChange={(e) => {
                                    const textarea = e.target;
                                    textarea.style.height = "auto";
                                    textarea.style.height = `${textarea.scrollHeight}px`;
                                    explainField.onChange(e.target.value);
                                  }}
                                  placeholder="Nhập giải thích..."
                                  className={`w-full min-h-[100px] p-3 rounded-b-lg bg-transparent text-[#2D3748] placeholder:text-[#718096] outline-none border resize-none overflow-hidden ${
                                    error
                                      ? "border-red-500 focus:ring-2 focus:ring-red-500"
                                      : "border-[#52aaa5] hover:border-[#52aaa5] focus:border-[#52aaa5] focus:ring-2 focus:ring-[#52aaa5]/20"
                                  }`}
                                />
                              </div>
                            </div>
                          </div>
                        </FormControl>
                        {error && (
                          <div className="text-sm text-red-500 mt-1">
                            {error.message}
                          </div>
                        )}
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Form>
  );
};

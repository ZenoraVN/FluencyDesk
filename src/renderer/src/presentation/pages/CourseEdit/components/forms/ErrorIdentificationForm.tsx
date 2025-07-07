import { FC, useState, useEffect, useRef } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
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

export interface ErrorIdentificationFormData {
  error_identification_question: {
    question: string;
  };
  error_identification_answers: Array<{
    error_word: string;
    correct_word: string;
    explain: string;
  }>;
}

interface ErrorIdentificationFormProps {
  initialData?: ErrorIdentificationFormData;
}

export const ErrorIdentificationForm: FC<ErrorIdentificationFormProps> = ({
  initialData,
}): JSX.Element => {
  const [selectedBlankNumber, setSelectedBlankNumber] = useState<number | null>(
    null
  );
  const form = useFormContext<ErrorIdentificationFormData>();
  const answerRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Watch for changes in answers
  const answers = form.watch("error_identification_answers");

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "error_identification_answers",
    rules: {
      required: "Cần ít nhất 1 đáp án",
      validate: {
        atLeastOne: (value) => {
          if (!value || value.length === 0) return "Cần ít nhất 1 đáp án";
          return true;
        },
        uniqueExplanations: (value) => {
          if (!value?.length) return true;
          const explanations = value
            .map((v) => v.explain?.trim())
            .filter(Boolean);
          return (
            explanations.length === new Set(explanations).size ||
            "Các giải thích không được trùng lặp"
          );
        },
      },
    },
  });

  // Validate blanks are sequential and start from 1
  const validateBlanks = (question: string) => {
    const blanks = question.match(/\*\*\*(\d+)\*\*\*/g) || [];
    if (blanks.length === 0) {
      return "Câu hỏi cần có ít nhất một chỗ trống (***1***)";
    }

    const numbers = blanks.map((blank) =>
      parseInt(blank.match(/\d+/)?.[0] || "0")
    );
    const expectedSequence = Array.from(
      { length: numbers.length },
      (_, i) => i + 1
    );

    if (JSON.stringify(numbers.sort()) !== JSON.stringify(expectedSequence)) {
      return "Các chỗ trống phải được đánh số từ 1 và tăng dần liên tiếp";
    }

    // Check if number of blanks matches number of answers
    const answerPairs = answers?.length || 0;
    if (blanks.length !== answerPairs) {
      return "Số lượng chỗ trống phải bằng số lượng đáp án";
    }

    return true;
  };

  // Initialize form with initial data
  useEffect(() => {
    if (initialData?.error_identification_question?.question) {
      form.setValue(
        "error_identification_question.question",
        initialData.error_identification_question.question
      );
    }
  }, [initialData]);

  // Re-validate question when answers change
  useEffect(() => {
    form.trigger("error_identification_question.question");
  }, [answers?.length]);

  // Trigger initial validation
  useEffect(() => {
    form.trigger([
      "error_identification_question.question",
      "error_identification_answers",
    ]);
  }, []); // Run only once on mount

  // Trigger validation when fields change
  useEffect(() => {
    if (fields.length > 0) {
      form.trigger("error_identification_answers");
    }
  }, [fields.length]); // Run when number of fields changes

  const question = form.watch("error_identification_question.question") || "";

  // Render question with highlighted blanks
  const renderQuestion = () => {
    if (!question) return null;

    const parts = question.split(/(\*\*\*\d+\*\*\*)/g);
    return parts.map((part: string, index: number) => {
      const match = part.match(/\*\*\*(\d+)\*\*\*/);
      if (match) {
        const number = parseInt(match[1]);
        return (
          <button
            key={index}
            type="button"
            onClick={() => handleBlankClick(number)}
            className={`inline-block mx-1 cursor-pointer ${
              selectedBlankNumber === number
                ? "text-blue-600"
                : "text-gray-400 hover:text-blue-500"
            }`}
          >
            ___({number})___
          </button>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  // Handle blank selection
  const handleBlankClick = (number: number) => {
    setSelectedBlankNumber(number);
    const targetIndex = number - 1;

    if (targetIndex >= 0 && targetIndex < fields.length) {
      if (answerRefs.current[targetIndex]) {
        answerRefs.current[targetIndex].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  };

  return (
    <Form {...form}>
      <div className="space-y-6">
        {/* Question Section */}
        <div className="space-y-4">
          {/* Input Area */}
          <div className="rounded-lg overflow-hidden question-section  shadow-sm">
            <FormField
              control={form.control}
              name="error_identification_question.question"
              rules={{
                required: "Vui lòng nhập câu hỏi",
                validate: validateBlanks,
              }}
              render={({ field, fieldState: { error } }) => (
                <FormItem>
                  <FormLabel className="text-[#2D3748] font-medium">
                    Câu hỏi
                  </FormLabel>
                  <FormControl>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-1 p-1 border border-[#52aaa5]/20 rounded-t-lg bg-transparent">
                        <div className="flex items-center gap-1 pr-2 border-r border-[#52aaa5]/20">
                          <button
                            type="button"
                            onClick={() => {
                              const textarea = document.querySelector(
                                'textarea[name="error_identification_question.question"]'
                              ) as HTMLTextAreaElement;
                              const start = textarea.selectionStart;
                              const end = textarea.selectionEnd;
                              const text = textarea.value;
                              const newText =
                                text.substring(0, start) +
                                "# " +
                                text.substring(start, end) +
                                text.substring(end);
                              field.onChange(newText);
                            }}
                            className="p-2 rounded hover:bg-[#52aaa5]/10"
                          >
                            <Heading1 size={18} className="text-[#2D3748]" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const textarea = document.querySelector(
                                'textarea[name="error_identification_question.question"]'
                              ) as HTMLTextAreaElement;
                              const start = textarea.selectionStart;
                              const end = textarea.selectionEnd;
                              const text = textarea.value;
                              const newText =
                                text.substring(0, start) +
                                "## " +
                                text.substring(start, end) +
                                text.substring(end);
                              field.onChange(newText);
                            }}
                            className="p-2 rounded hover:bg-[#52aaa5]/10"
                          >
                            <Heading2 size={18} className="text-[#2D3748]" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1 px-2 border-r border-[#52aaa5]/20">
                          <button
                            type="button"
                            onClick={() => {
                              const textarea = document.querySelector(
                                'textarea[name="error_identification_question.question"]'
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
                              field.onChange(newText);
                            }}
                            className="p-2 rounded hover:bg-[#52aaa5]/10"
                          >
                            <Bold size={18} className="text-[#2D3748]" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const textarea = document.querySelector(
                                'textarea[name="error_identification_question.question"]'
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
                              field.onChange(newText);
                            }}
                            className="p-2 rounded hover:bg-[#52aaa5]/10"
                          >
                            <Italic size={18} className="text-[#2D3748]" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const textarea = document.querySelector(
                                'textarea[name="error_identification_question.question"]'
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
                              field.onChange(newText);
                            }}
                            className="p-2 rounded hover:bg-[#52aaa5]/10"
                          >
                            <Underline size={18} className="text-[#2D3748]" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1 px-2">
                          <button
                            type="button"
                            className="p-2 rounded hover:bg-[#52aaa5]/10"
                          >
                            <AlignLeft size={18} className="text-[#2D3748]" />
                          </button>
                          <button
                            type="button"
                            className="p-2 rounded hover:bg-[#52aaa5]/10"
                          >
                            <AlignCenter size={18} className="text-[#2D3748]" />
                          </button>
                          <button
                            type="button"
                            className="p-2 rounded hover:bg-[#52aaa5]/10"
                          >
                            <AlignRight size={18} className="text-[#2D3748]" />
                          </button>
                        </div>
                      </div>
                      <div className="relative">
                        <textarea
                          name="error_identification_question.question"
                          value={field.value || ""}
                          onChange={(e) => {
                            const textarea = e.target;
                            textarea.style.height = "auto";
                            textarea.style.height = `${textarea.scrollHeight}px`;
                            field.onChange(e.target.value);
                          }}
                          placeholder="Nhập câu hỏi..."
                          className={`w-full min-h-[100px] p-3 rounded-b-lg bg-transparent text-[#2D3748] placeholder:text-[#718096] outline-none border resize-none overflow-hidden ${
                            error ||
                            form.formState.errors.error_identification_answers
                              ?.root
                              ? "border-red-500 focus:ring-2 focus:ring-red-500"
                              : "border-[#52aaa5] hover:border-[#52aaa5] focus:border-[#52aaa5] focus:ring-2 focus:ring-[#52aaa5]/20"
                          }`}
                        />
                      </div>
                    </div>
                  </FormControl>
                  {(error ||
                    form.formState.errors.error_identification_question
                      ?.question) && (
                    <div className="text-sm text-red-500 mt-1">
                      {error?.message ||
                        form.formState.errors.error_identification_question
                          ?.question?.message}
                    </div>
                  )}
                </FormItem>
              )}
            />
          </div>

          {/* Preview Area */}
          <div className="rounded-lg shadow-s">
            <div className="pr-3 pb-3 pt-3 border-b border-gray-100">
              <h4 className="text-sm font-medium text-[#2D3748]">Xem trước</h4>
            </div>
            <div className="p-4  border border-gray-200 rounded-b-lg min-h-[80px]">
              {question ? (
                <div className="text-[#2D3748] leading-relaxed text-base">
                  {renderQuestion()}
                </div>
              ) : (
                <div className="flex items-center justify-center h-[60px] text-gray-400">
                  <span className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse"></div>
                    Nhập câu hỏi ở trên để xem kết quả
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Answer Section */}
        <div className="space-y-4">
          <div className=" rounded-lg shadow-sm">
            <div className="flex justify-between items-center pr-3 py-3 border-b border-gray-200">
              <div>
                <h4 className="text-sm font-medium text-[#2D3748]">
                  Đáp án và giải thích
                </h4>
                {form.formState.errors.error_identification_answers?.root && (
                  <div className="text-sm text-red-500 mt-1">
                    {
                      form.formState.errors.error_identification_answers.root
                        .message
                    }
                  </div>
                )}
              </div>
              <Button
                type="button"
                onClick={() => {
                  append({
                    error_word: "",
                    correct_word: "",
                    explain: "",
                  });
                }}
                className="flex items-center gap-2 px-4 py-1.5 text-sm bg-[#52aaa5]/10 text-[#52aaa5] hover:bg-[#52aaa5]/20 rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                Thêm đáp án
              </Button>
            </div>
            <div className="space-y-4">
              {fields.map((field, index) => {
                const isSelected = selectedBlankNumber === index + 1;
                return (
                  <div
                    key={field.id}
                    ref={(el) => (answerRefs.current[index] = el)}
                    className={`p-4 rounded-lg transition-all border ${
                      isSelected
                        ? "bg-blue-50 border-blue-200 shadow-sm"
                        : " border-gray-200 hover:border-blue-200 hover:shadow-sm"
                    }`}
                  >
                    <div className="mb-2 flex justify-between items-center">
                      <span className="text-sm font-medium text-[#2D3748]">
                        Đáp án {index + 1}
                      </span>
                      <Button
                        type="button"
                        onClick={() => remove(index)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                        Xóa
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {/* Error Word */}
                      <FormField
                        control={form.control}
                        name={`error_identification_answers.${index}.error_word`}
                        rules={{
                          required: "Vui lòng nhập từ sai",
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <FormItem>
                            <FormLabel className="text-[#2D3748] font-medium">
                              Từ sai
                            </FormLabel>
                            <FormControl>
                              <textarea
                                {...field}
                                placeholder="Nhập từ sai"
                                rows={1}
                                onInput={(e) => {
                                  const target =
                                    e.target as HTMLTextAreaElement;
                                  target.style.height = "auto";
                                  target.style.height =
                                    target.scrollHeight + "px";
                                }}
                                className={`w-full resize-none overflow-hidden min-h-[38px] px-3 py-2 bg-transparent text-[#2D3748] rounded-md border ${
                                  error
                                    ? "border-red-500 focus:ring-2 focus:ring-red-500"
                                    : "border-[#52aaa5] hover:border-[#52aaa5] focus:border-[#52aaa5] focus:ring-2 focus:ring-[#52aaa5]/20"
                                }`}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Correct Word */}
                      <FormField
                        control={form.control}
                        name={`error_identification_answers.${index}.correct_word`}
                        rules={{
                          required: "Vui lòng nhập từ đúng",
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <FormItem>
                            <FormLabel className="text-[#2D3748] font-medium">
                              Từ đúng
                            </FormLabel>
                            <FormControl>
                              <textarea
                                {...field}
                                placeholder="Nhập từ đúng"
                                rows={1}
                                onInput={(e) => {
                                  const target =
                                    e.target as HTMLTextAreaElement;
                                  target.style.height = "auto";
                                  target.style.height =
                                    target.scrollHeight + "px";
                                }}
                                className={`w-full resize-none overflow-hidden min-h-[38px] px-3 py-2 bg-transparent text-[#2D3748] rounded-md border ${
                                  error
                                    ? "border-red-500 focus:ring-2 focus:ring-red-500"
                                    : "border-[#52aaa5] hover:border-[#52aaa5] focus:border-[#52aaa5] focus:ring-2 focus:ring-[#52aaa5]/20"
                                }`}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Explanation */}
                    <FormField
                      control={form.control}
                      name={`error_identification_answers.${index}.explain`}
                      rules={{
                        required: "Vui lòng nhập giải thích",
                        validate: (value) => {
                          if (!value?.trim()) return "Vui lòng nhập giải thích";
                          return true;
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="mt-6 pt-4 border-t border-gray-100">
                          <FormLabel className="text-[#2D3748] font-medium">
                            Giải thích
                          </FormLabel>
                          <FormControl>
                            <div className="mt-2 space-y-2">
                              <div className="flex items-center gap-1 p-1 border border-[#52aaa5]/20 rounded-t-lg bg-transparent">
                                <div className="flex items-center gap-1 pr-2 border-r border-[#52aaa5]/20">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const textarea = document.querySelector(
                                        `textarea[name="error_identification_answers.${index}.explain"]`
                                      ) as HTMLTextAreaElement;
                                      const start = textarea.selectionStart;
                                      const end = textarea.selectionEnd;
                                      const text = textarea.value;
                                      const newText =
                                        text.substring(0, start) +
                                        "# " +
                                        text.substring(start, end) +
                                        text.substring(end);
                                      field.onChange(newText);
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
                                        `textarea[name="error_identification_answers.${index}.explain"]`
                                      ) as HTMLTextAreaElement;
                                      const start = textarea.selectionStart;
                                      const end = textarea.selectionEnd;
                                      const text = textarea.value;
                                      const newText =
                                        text.substring(0, start) +
                                        "## " +
                                        text.substring(start, end) +
                                        text.substring(end);
                                      field.onChange(newText);
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
                                        `textarea[name="error_identification_answers.${index}.explain"]`
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
                                      field.onChange(newText);
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
                                        `textarea[name="error_identification_answers.${index}.explain"]`
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
                                      field.onChange(newText);
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
                                        `textarea[name="error_identification_answers.${index}.explain"]`
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
                                      field.onChange(newText);
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
                                  name={`error_identification_answers.${index}.explain`}
                                  value={field.value || ""}
                                  onChange={(e) => {
                                    const textarea = e.target;
                                    textarea.style.height = "auto";
                                    textarea.style.height = `${textarea.scrollHeight}px`;
                                    field.onChange(e.target.value);
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
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
};

import { FC, useState, useEffect, useRef } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/presentation/components/ui/form";
import { Button } from "@/presentation/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { RichtextchtEditor } from "@/presentation/components/Input/CustomRichtext";
import { RichtextFillInBlankView } from "../RichtextFillInBlankView";

export interface FillInBlankFormData {
  fill_in_the_blank_question: {
    question: string;
  };
  fill_in_the_blank_answers: Array<{
    answer: string;
    explain: string;
  }>;
}

interface FillInBlankFormProps {
  initialData?: FillInBlankFormData;
}

export const FillInBlankForm: FC<FillInBlankFormProps> = ({
  initialData,
}): JSX.Element => {
  const [selectedBlankNumber, setSelectedBlankNumber] = useState<number | null>(
    null
  );
  const form = useFormContext<FillInBlankFormData>();

  // Watch for changes in answers
  const answers = form.watch("fill_in_the_blank_answers");

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

    // Check if number of blanks matches number of answer pairs
    const answerPairs = answers?.length || 0;
    if (blanks.length !== answerPairs) {
      return "Số lượng chỗ trống phải bằng số lượng cặp đáp án và giải thích";
    }

    return true;
  };

  // Re-validate question when answers change
  useEffect(() => {
    form.trigger("fill_in_the_blank_question.question");
  }, [answers?.length]);

  const answerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "fill_in_the_blank_answers",
    rules: {
      required: "Cần ít nhât 1 đáp án&giải thích",
      validate: {
        atLeastOne: (value) => {
          if (!value || value.length === 0)
            return "Cần ít nhât 1 đáp án&giải thích";
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

  // Initialize form with initial data
  useEffect(() => {
    if (initialData?.fill_in_the_blank_question?.question) {
      form.setValue(
        "fill_in_the_blank_question.question",
        initialData.fill_in_the_blank_question.question
      );
    }
  }, [initialData]);

  // Trigger initial validation
  useEffect(() => {
    // Trigger validation for both question and answers
    form.trigger([
      "fill_in_the_blank_question.question",
      "fill_in_the_blank_answers",
    ]);
  }, []); // Run only once on mount

  // Trigger validation when fields change
  useEffect(() => {
    if (fields.length > 0) {
      // When fields exist, validate empty fields
      form.trigger("fill_in_the_blank_answers");
    }
  }, [fields.length]); // Run when number of fields changes

  const question = form.watch("fill_in_the_blank_question.question") || "";

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
          <div className="rounded-lg overflow-hidden question-section">
            <FormField
              control={form.control}
              name="fill_in_the_blank_question.question"
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
                    <div className="mt-2">
                      <RichtextchtEditor
                        value={field.value || ""}
                        onChange={field.onChange}
                        className={
                          error ||
                          form.formState.errors.fill_in_the_blank_answers?.root
                            ? "border-red-500 text-red-500"
                            : "hover:border-[#52aaaf]"
                        }
                      />
                    </div>
                  </FormControl>
                  {(error ||
                    form.formState.errors.fill_in_the_blank_question
                      ?.question) && (
                    <div className="text-sm text-red-500 mt-1">
                      {error?.message ||
                        form.formState.errors.fill_in_the_blank_question
                          ?.question?.message}
                    </div>
                  )}
                </FormItem>
              )}
            />
          </div>

          {/* Preview Area */}
          <div className="rounded-lg">
            <div className="pb-3">
              <h4 className="text-sm font-medium text-[#2D3748]">Xem trước</h4>
            </div>
            <div className="p-4 border border-gray-200 rounded-b-lg min-h-[80px] hover:border-[#52aaaf] rounded-lg">
              {question ? (
                <RichtextFillInBlankView
                  content={question}
                  onBlankClick={handleBlankClick}
                  selectedBlankNumber={selectedBlankNumber}
                  className="hover:border-[#52aaaf]"
                />
              ) : (
                <div className="flex items-center justify-center h-[60px] text-gray-400">
                  <span className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse"></div>
                    Nhập câu hỏi ở trên để xem kết quả
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Answer Section */}
        <div className="space-y-4">
          <div className="rounded-lg shadow-sm">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <div>
                <h4 className="text-sm font-medium text-[#2D3748]">
                  Đáp án và giải thích
                </h4>
                {form.formState.errors.fill_in_the_blank_answers?.root && (
                  <div className="text-sm text-red-500 mt-1">
                    {
                      form.formState.errors.fill_in_the_blank_answers.root
                        .message
                    }
                  </div>
                )}
              </div>
              <Button
                type="button"
                onClick={() => append({ answer: "", explain: "" })}
                className="flex items-center gap-2 px-4 py-1.5 text-sm-blue-50 text-white-600 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                Thêm đáp án
              </Button>
            </div>

            <div className="space-y-4">
              {fields.length > 0 &&
                fields.map((field, index) => {
                  const isSelected = selectedBlankNumber === index + 1;
                  return (
                    <div
                      key={field.id}
                      ref={(el) => (answerRefs.current[index] = el)}
                      className={`p-4 rounded-lg transition-all border ${
                        isSelected
                          ? "border-blue-300 shadow-sm"
                          : "border-gray-200 hover:border-[#52aaaf] hover:shadow-sm"
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

                      {/* Answer RichtextchtEditor */}
                      <FormField
                        control={form.control}
                        name={`fill_in_the_blank_answers.${index}.answer`}
                        rules={{
                          required: "Vui lòng nhập đáp án",
                          validate: (value: string) => {
                            // Xử lý giống instruction ở BaseQuestionForm
                            const plain = (value || "")
                              .replace(/<p>|<\/p>|<br\s*\/?>/gi, "")
                              .trim();
                            if (!plain) return "Vui lòng nhập đáp án";
                            return true;
                          },
                        }}
                        render={({ field, fieldState: { error } }) => {
                          // Sử dụng regex để xác định ô trống
                          const plain = (field.value || "")
                            .replace(/<p>|<\/p>|<br\s*\/?>/gi, "")
                            .trim();
                          return (
                            <FormItem>
                              <FormLabel className="text-[#2D3748] font-medium">
                                Đáp án
                              </FormLabel>
                              <FormControl>
                                <div className="mt-2">
                                  <RichtextchtEditor
                                    value={field.value || ""}
                                    onChange={(val) => {
                                      field.onChange(val);
                                      form.trigger(
                                        `fill_in_the_blank_answers.${index}.answer`
                                      );
                                    }}
                                    className={
                                      !plain
                                        ? "border-red-500 text-red-500"
                                        : "hover:border-[#52aaaf]"
                                    }
                                    min={true}
                                    placeholder="Nhập đáp án ở đây"
                                  />
                                </div>
                              </FormControl>
                              {!plain && error && (
                                <div className="text-sm text-red-500 mt-1">
                                  {error.message}
                                </div>
                              )}
                            </FormItem>
                          );
                        }}
                      />

                      {/* Explanation RichtextchtEditor */}
                      <FormField
                        control={form.control}
                        name={`fill_in_the_blank_answers.${index}.explain`}
                        rules={{
                          required: "Vui lòng nhập giải thích",
                          validate: {
                            notEmpty: (value: string) => {
                              const plain = (value || "")
                                .replace(/<p>|<\/p>|<br\s*\/?>/gi, "")
                                .trim();
                              return !plain ? "Vui lòng nhập giải thích" : true;
                            },
                            unique: (value: string) => {
                              const plain = (value || "")
                                .replace(/<p>|<\/p>|<br\s*\/?>/gi, "")
                                .trim();
                              if (!plain) return true;
                              const allExplanations = form
                                .getValues("fill_in_the_blank_answers")
                                .map((a) =>
                                  (a.explain || "")
                                    .replace(/<p>|<\/p>|<br\s*\/?>/gi, "")
                                    .trim()
                                )
                                .filter((_, i) => i !== index);
                              return (
                                !allExplanations.includes(plain) ||
                                "Giải thích không được trùng lặp với các đáp án khác"
                              );
                            },
                          },
                        }}
                        render={({ field, fieldState: { error } }) => {
                          const plain = (field.value || "")
                            .replace(/<p>|<\/p>|<br\s*\/?>/gi, "")
                            .trim();
                          return (
                            <FormItem className="mt-6 pt-4 border-t border-gray-100">
                              <FormLabel className="text-[#2D3748] font-medium">
                                Giải thích
                              </FormLabel>
                              <FormControl>
                                <div className="mt-2">
                                  <RichtextchtEditor
                                    value={field.value || ""}
                                    onChange={(val) => {
                                      field.onChange(val);
                                      form.trigger(
                                        `fill_in_the_blank_answers.${index}.explain`
                                      );
                                    }}
                                    className={
                                      !plain
                                        ? "border-red-500 text-red-500"
                                        : ""
                                    }
                                    placeholder="Nhập giải thích ở đây"
                                    min={true}
                                  />
                                </div>
                              </FormControl>
                              {!plain && error && (
                                <div className="text-sm text-red-500 mt-1">
                                  {error.message}
                                </div>
                              )}
                            </FormItem>
                          );
                        }}
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

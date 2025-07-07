import { FC, useEffect, useRef } from "react";
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
  RadioGroup,
  RadioGroupItem,
} from "@/presentation/components/ui/radio-group";
import { Plus, Minus } from "lucide-react";
import { RichtextchtEditor } from "@/presentation/components/Input/CustomRichtext";
import { CustomInput } from "@/presentation/components/Input/CustomInput";

export interface ChoiceOneFormData {
  choice_one_question: {
    question: string;
    explain: string;
  };
  choice_one_options: Array<{
    option: string;
    is_correct: boolean;
  }>;
}

interface ChoiceOneFormProps {
  initialData?: ChoiceOneFormData;
}

export const ChoiceOneForm: FC<ChoiceOneFormProps> = ({
  initialData,
}): JSX.Element => {
  const form = useFormContext<ChoiceOneFormData>();
  const initialized = useRef(false);

  const { fields, append, remove } = useFieldArray<ChoiceOneFormData>({
    control: form.control,
    name: "choice_one_options",
    rules: {
      required: "Vui lòng thêm ít nhất một lựa chọn",
      validate: {
        atLeastTwo: (value: Array<{ option: string; is_correct: boolean }>) =>
          (value && value.length >= 2) || "Phải có ít nhất 2 lựa chọn",
        maxTen: (value: Array<{ option: string; is_correct: boolean }>) =>
          (value && value.length <= 10) || "Chỉ được tối đa 10 lựa chọn",
        hasCorrectAnswer: (
          value: Array<{ option: string; is_correct: boolean }>
        ) => value?.some((opt) => opt.is_correct) || "Cần chọn 1 option true",
        noDuplicates: (
          value: Array<{ option: string; is_correct: boolean }>
        ) => {
          if (!value) return true;
          const options = value.map((v) => v.option.trim());
          const uniqueOptions = new Set(options);
          return (
            options.length === uniqueOptions.size ||
            "Các lựa chọn không được trùng nhau"
          );
        },
      },
    },
  });

  // Initialize with 2 default options if no initial data
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      const hasInitialOptions =
        initialData &&
        Array.isArray(initialData.choice_one_options) &&
        initialData.choice_one_options.length > 0;
      if (!hasInitialOptions && fields.length === 0) {
        append([
          { option: "", is_correct: false },
          { option: "", is_correct: false },
        ]);
      }
    }
  }, [initialData, fields.length, append]);

  // Trigger initial validation
  useEffect(() => {
    form.trigger([
      "choice_one_question.question",
      "choice_one_question.explain",
      "choice_one_options",
    ]);
  }, []); // Run only once on mount

  // Trigger validation when fields change
  useEffect(() => {
    if (fields.length > 0) {
      form.trigger("choice_one_options");
    }
  }, [fields.length]); // Run when number of fields changes

  return (
    <Form {...form}>
      <div className="space-y-6">
        {/* Question Section */}
        <div className="space-y-4">
          <div className="rounded-lg overflow-hidden question-section">
            <FormField
              control={form.control}
              name="choice_one_question.question"
              rules={{
                required: "Vui lòng nhập câu hỏi",
                validate: (value) => {
                  const plain = (value || "")
                    .replace(/<p>|<\/p>|<br\s*\/?>/gi, "")
                    .trim();
                  if (!plain) return "Vui lòng nhập câu hỏi";
                  return true;
                },
              }}
              render={({ field }) => {
                const plain = (field.value || "")
                  .replace(/<p>|<\/p>|<br\s*\/?>/gi, "")
                  .trim();
                return (
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
                            !plain
                              ? "border-red-500 text-red-500"
                              : "hover:border-[#52aaaf]"
                          }
                        />
                      </div>
                    </FormControl>
                    {!plain && (
                      <div className="text-sm text-red-500 mt-1">
                        Vui lòng nhập câu hỏi
                      </div>
                    )}
                  </FormItem>
                );
              }}
            />
          </div>
        </div>

        {/* Options Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-3">
            <div>
              <h4 className="text-sm font-medium text-[#2D3748]">
                Các lựa chọn
              </h4>
              {form.formState.errors.choice_one_options?.root && (
                <div className="text-sm text-red-500 mt-1">
                  {form.formState.errors.choice_one_options.root.message}
                </div>
              )}
            </div>
            {fields.length < 10 && (
              <Button
                type="button"
                onClick={() => append({ option: "", is_correct: false })}
                className="flex items-center gap-2 px-4 py-1.5 text-sm bg-[#52aaa5]/10 text-[#52aaa5] hover:bg-[#52aaa5]/20 rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                Thêm lựa chọn
              </Button>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {fields.map((field, index) => (
              <div key={field.id} className="relative rounded-lg">
                <div className="flex gap-4">
                  {/* RadioGroup chọn đáp án đúng */}
                  <div className="flex justify-center px-2">
                    <FormField
                      control={form.control}
                      name={`choice_one_options.${index}.is_correct`}
                      render={({ field: radioField }) => (
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroup
                              onValueChange={() => {
                                const newOptions = form
                                  .getValues("choice_one_options")
                                  .map((opt, i) => ({
                                    ...opt,
                                    is_correct: i === index,
                                  }));
                                form.setValue("choice_one_options", newOptions);
                                form.trigger("choice_one_options");
                              }}
                              value={radioField.value ? "true" : ""}
                            >
                              <RadioGroupItem value="true" />
                            </RadioGroup>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* Đáp án - TextEditor */}
                  <div className="flex-1 min-w-0">
                    <FormField
                      control={form.control}
                      name={`choice_one_options.${index}.option`}
                      rules={{
                        required: "Vui lòng nhập lựa chọn",
                      }}
                      render={({
                        field: inputField,
                        fieldState: { error },
                      }) => (
                        <FormItem>
                          <FormControl>
                            {/* BLOCK này đảm bảo context block và full width */}
                            <div className="block w-full">
                              <CustomInput
                                value={inputField.value || ""}
                                onChange={(val) => {
                                  inputField.onChange(val);
                                  form.trigger("choice_one_options");
                                }}
                                className={`w-full bg-transparent text-[#2D3748] min-h-[40px] py-1.5 my-1 ${
                                  error ||
                                  form.formState.errors.choice_one_options?.root
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-[#52aaa5] hover:border-[#52aaa5] focus:border-[#52aaa5] focus:ring-2 focus:ring-[#52aaa5]/20"
                                }`}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-sm text-red-500 mt-1" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Nút xóa lựa chọn */}
                  {fields.length > 2 && (
                    <Button
                      type="button"
                      onClick={() => remove(index)}
                      className="flex items-center gap-2 px-3 h-[34px] text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded-lg my-1"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Explanation Section */}
        <div className="space-y-4">
          <div className="rounded-lg overflow-hidden question-section">
            <FormField
              control={form.control}
              name="choice_one_question.explain"
              rules={{
                required: "Vui lòng nhập giải thích",
                validate: (value) => {
                  const plain = (value || "")
                    .replace(/<p>|<\/p>|<br\s*\/?>/gi, "")
                    .trim();
                  if (!plain) return "Vui lòng nhập giải thích";
                  return true;
                },
              }}
              render={({ field, fieldState: { error } }) => {
                const plain = (field.value || "")
                  .replace(/<p>|<\/p>|<br\s*\/?>/gi, "")
                  .trim();
                return (
                  <FormItem>
                    <FormLabel className="text-[#2D3748] font-medium">
                      Giải thích
                    </FormLabel>
                    <FormControl>
                      <div className="mt-2">
                        <RichtextchtEditor
                          value={field.value || ""}
                          onChange={field.onChange}
                          className={
                            !plain
                              ? "border-red-500 text-red-500"
                              : "hover:border-[#52aaaf]"
                          }
                        />
                      </div>
                    </FormControl>
                    {!plain && (
                      <div className="text-sm text-red-500 mt-1">
                        Vui lòng nhập giải thích
                      </div>
                    )}
                  </FormItem>
                );
              }}
            />
          </div>
        </div>
      </div>
    </Form>
  );
};

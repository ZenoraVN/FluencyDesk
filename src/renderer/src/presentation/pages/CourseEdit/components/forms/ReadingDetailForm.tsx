import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/presentation/components/ui/form";
import { Button } from "@/presentation/components/ui/button";
import { X } from "lucide-react";
import { RichtextchtEditor } from "@/presentation/components/Input/CustomRichtext";
import { CustomInput } from "@/presentation/components/Input/CustomInput";
import { MultiImageDropzone } from "@/presentation/components/Image/CustomMultiImageDropzone";

export interface ReadingDetailFormData {
  title?: string;
  passage: string;
  image_files?: File[];
}

interface ReadingDetailFormProps {
  onChange: (data: ReadingDetailFormData) => void;
  initialData?: {
    title?: string;
    passage?: string;
    image_files?: File[];
  };
}

export const ReadingDetailForm: FC<ReadingDetailFormProps> = ({
  initialData,
  onChange,
}) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const form = useForm<ReadingDetailFormData>({
    defaultValues: {
      title: initialData?.title || "",
      passage: initialData?.passage || "",
      image_files: initialData?.image_files || [],
    },
  });

  // Force validation for required passage on mount
  useEffect(() => {
    form.trigger("passage");
  }, []);

  // Set initial images
  useEffect(() => {
    if (initialData?.image_files?.length) {
      form.setValue("image_files", initialData.image_files);
    }
  }, [initialData, form]);

  // Watch for form value changes
  useEffect(() => {
    const subscription = form.watch((values) => {
      onChange(values as ReadingDetailFormData);
    });
    return () => subscription.unsubscribe();
  }, [form, onChange]);

  // Generate image preview URLs
  useEffect(() => {
    const imageFiles = form.watch("image_files") || [];
    const urls = imageFiles.map((file) => URL.createObjectURL(file));
    setImageUrls(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [form.watch("image_files")]);

  // Image drop handler for MultiImageDropzone
  const handleImageDrop = (newFiles: File[]) => {
    form.setValue("image_files", newFiles, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <Form {...form}>
      <form className="space-y-6">
        <div className="rounded-lg space-y-6">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#2D3748] font-medium">
                  Tiêu đề (Không bắt buộc)
                </FormLabel>
                <FormControl>
                  <CustomInput
                    value={field.value || ""}
                    onChange={field.onChange}
                    className="bg-white text-[#2D3748]"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Passage */}
          <FormField
            control={form.control}
            name="passage"
            rules={{ required: "Vui lòng nhập nội dung bài đọc" }}
            render={({ field, fieldState: { error } }) => (
              <FormItem>
                <FormLabel className="text-[#2D3748] font-medium">
                  Nội dung bài đọc
                </FormLabel>
                <FormControl>
                  <RichtextchtEditor
                    value={field.value || ""}
                    onChange={field.onChange}
                    className={`rounded-lg overflow-hidden ${
                      error
                        ? "border-red-500 focus:ring-red-500"
                        : "border-[#52aaa5]/20"
                    }`}
                  />
                </FormControl>
                {error && (
                  <div className="text-sm text-red-500 mt-1">
                    {error.message}
                  </div>
                )}
              </FormItem>
            )}
          />

          {/* Image Upload */}
          <FormItem>
            <FormLabel className="text-[#2D3748] font-medium">
              Hình ảnh (Không bắt buộc)
            </FormLabel>
            <FormControl>
              <MultiImageDropzone
                files={form.watch("image_files") || []}
                onChange={handleImageDrop}
              />
            </FormControl>
            {/* {form.watch("image_files")?.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {form.watch("image_files")!.map((file: File, i: number) => (
                  <div key={i} className="relative bg-gray-50 rounded-lg p-4">
                    <img
                      src={imageUrls[i]}
                      alt={file.name}
                      className="w-full h-40 object-cover rounded-lg mb-2"
                    />
                    <div className="text-sm text-gray-600 break-all">
                      {file.name}
                    </div>
                    <Button
                      type="button"
                      onClick={async () => {
                        const newFiles = [...form.watch("image_files")!];
                        newFiles.splice(i, 1);
                        await form.setValue("image_files", newFiles, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }}
                      className="absolute top-2 right-2 w-8 h-8 p-0 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )} */}
          </FormItem>
        </div>
      </form>
    </Form>
  );
};

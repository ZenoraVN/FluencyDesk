import { FC, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/presentation/components/ui/form";
import { Button } from "@/presentation/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { CustomInput } from "@/presentation/components/Input/CustomInput";
import { RichtextchtEditor } from "@/presentation/components/Input/CustomRichtext";

interface Role {
  id: string;
  name: string;
  color: string;
}
interface Message {
  roleId: string;
  content: string;
}
export interface OpenConversationFormData {
  open_conversation: {
    title: string;
    overview: string;
    example_conversation: string;
  };
}
interface OpenConversationFormProps {
  initialData?: {
    title?: string;
    overview?: string;
    example_conversation?: string;
  };
}

const defaultColors = ["#52aaa5", "#4C51BF", "#D53F8C", "#805AD5", "#319795"];
const defaultRoles: Role[] = [
  { id: "A", name: "A", color: defaultColors[0] },
  { id: "B", name: "B", color: defaultColors[1] },
  { id: "C", name: "C", color: defaultColors[2] },
  { id: "D", name: "D", color: defaultColors[3] },
  { id: "You", name: "You", color: defaultColors[4] },
];

export const OpenConversationForm: FC<OpenConversationFormProps> = ({
  initialData,
}) => {
  const form = useFormContext<OpenConversationFormData>();

  // Parse example_conversation string into messages[]
  const parseInitialConversation = (conversation: string) => {
    // Remove "?\\n" (hỏi đáp cũ), split lines, ignore empty, trim
    return conversation
      .replace(/\?\n/g, "") // Remove "?\\n"
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line): Message | null => {
        const match = line.match(/^([^:]+):\s*(.+)$/);
        if (match) {
          const [, roleId, content] = match;
          return { roleId: roleId.trim(), content: content.trim() };
        }
        return null;
      })
      .filter((msg): msg is Message => !!msg);
  };

  const [messages, setMessages] = useState<Message[]>(
    initialData?.example_conversation
      ? parseInitialConversation(initialData.example_conversation)
      : []
  );

  useEffect(() => {
    if (initialData?.example_conversation) {
      setMessages(parseInitialConversation(initialData.example_conversation));
      form.setValue(
        "open_conversation.example_conversation",
        initialData.example_conversation
      );
    }
    if (initialData?.title)
      form.setValue("open_conversation.title", initialData.title);
    if (initialData?.overview)
      form.setValue("open_conversation.overview", initialData.overview);
    // eslint-disable-next-line
  }, [initialData]);

  // Stringify messages[] to example_conversation string
  const stringifyConversation = (msgs: Message[]) =>
    msgs.map((msg) => `${msg.roleId}: ${msg.content}`).join("\n");

  // Update conversation in both state and form
  const updateConversation = (newMessages: Message[]) => {
    setMessages(newMessages);
    form.setValue(
      "open_conversation.example_conversation",
      stringifyConversation(newMessages)
    );
  };

  const handleUpdateTitle = (val: string) => {
    form.setValue("open_conversation.title", val);
  };

  const handleUpdateMessage = (index: number, content: string) => {
    const newMessages = [...messages];
    newMessages[index] = { ...newMessages[index], content };
    updateConversation(newMessages);
  };

  // Remove specific message row (not by role)
  const handleRemoveMessage = (index: number) => {
    const newMessages = [...messages];
    newMessages.splice(index, 1);
    updateConversation(newMessages);
  };

  // Add new message by role
  const handleAddMessage = (role: Role) => {
    updateConversation([...messages, { roleId: role.id, content: "" }]);
  };

  const handleOverviewChange = (val: string) => {
    form.setValue("open_conversation.overview", val);
  };

  return (
    <Form {...form}>
      <div className="space-y-6">
        {/* Title */}
        <FormField
          control={form.control}
          name="open_conversation.title"
          rules={{
            required: "Vui lòng nhập tiêu đề",
            validate: (value) =>
              !value?.trim() ? "Vui lòng nhập tiêu đề" : true,
          }}
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <FormLabel className="text-[#2D3748] font-medium">
                Tiêu đề chủ đề
              </FormLabel>
              <FormControl>
                <CustomInput
                  value={field.value || ""}
                  onChange={(val) => {
                    field.onChange(val);
                    handleUpdateTitle(val);
                  }}
                  className={`bg-transparent w-full ${
                    error
                      ? "border-red-500"
                      : "border-[#52aaa5] focus:border-[#52aaa5]"
                  }`}
                />
              </FormControl>
              {error && (
                <div className="text-sm text-red-500 mt-1">{error.message}</div>
              )}
            </FormItem>
          )}
        />

        {/* Overview */}
        <FormField
          control={form.control}
          name="open_conversation.overview"
          rules={{
            required: "Vui lòng nhập tổng quan",
            validate: (value) =>
              !value?.trim() ? "Vui lòng nhập tổng quan" : true,
          }}
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <FormLabel className="text-[#2D3748] font-medium">
                Tổng quan
              </FormLabel>
              <FormControl>
                <RichtextchtEditor
                  value={field.value || ""}
                  onChange={(val) => {
                    field.onChange(val);
                    handleOverviewChange(val);
                  }}
                  className="w-full"
                  placeholder="Nhập tổng quan về chủ đề và các điểm cần thảo luận..."
                />
              </FormControl>
              {error && (
                <div className="text-sm text-red-500 mt-1">{error.message}</div>
              )}
            </FormItem>
          )}
        />

        {/* Conversation */}
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-1">
            <h4 className="text-sm font-medium text-[#2D3748]">
              Hội thoại mẫu
            </h4>
          </div>
          {messages.length === 0 && (
            <div className="px-2 py-4 text-[#aaa] text-sm italic">
              Chưa có câu thoại nào. Thêm các câu thoại phía dưới.
            </div>
          )}
          {messages.map((msg, idx) => {
            const role = defaultRoles.find((r) => r.id === msg.roleId);
            return (
              <div
                key={idx}
                className="flex items-center gap-2 group px-2 py-2 rounded-lg border border-[#52aaa5]/10 hover:border-[#52aaaf]"
                style={{ borderLeft: `4px solid ${role?.color ?? "#bbb"}` }}
              >
                <span
                  className="font-semibold text-xs px-2 py-1 mr-1 rounded"
                  style={{
                    color: role?.color,
                    background: (role?.color ?? "#eee") + "15",
                  }}
                >
                  {role?.name || msg.roleId}
                </span>
                <CustomInput
                  value={msg.content}
                  onChange={(val) => handleUpdateMessage(idx, val)}
                  className="flex-1 min-w-0 bg-transparent"
                />
                <Button
                  type="button"
                  onClick={() => handleRemoveMessage(idx)}
                  className="flex items-center gap-2 h-[32px] text-xs px-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg ml-2"
                  tabIndex={-1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
          {/* Button thêm thoại */}
          <div className="flex flex-wrap gap-3 border-t pt-4">
            {defaultRoles.map((role) => (
              <Button
                key={role.id}
                type="button"
                onClick={() => handleAddMessage(role)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors"
                style={{
                  backgroundColor: `${role.color}10`,
                  color: role.color,
                }}
              >
                <Plus className="h-4 w-4" />
                {role.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Hidden field storing the conversation string */}
        <FormField
          control={form.control}
          name="open_conversation.example_conversation"
          render={({ field }) => <input type="hidden" {...field} />}
        />

        <div className="rounded-lg border p-4 bg-blue-50">
          <p className="text-sm text-blue-600">
            Lưu ý: Đây là dạng câu hỏi mở, học viên sẽ được tự do thể hiện quan
            điểm của mình về chủ đề. Hội thoại mẫu chỉ mang tính chất gợi ý và
            không phải là khuôn mẫu cố định.
          </p>
        </div>
      </div>
    </Form>
  );
};

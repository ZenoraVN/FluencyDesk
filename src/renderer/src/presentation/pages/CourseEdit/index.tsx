import { FC, useState, useRef, useEffect, useCallback } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import ApiService from "@/service/ApiService";
import { Course } from "./types/course";
import { CourseSection } from "./components/CourseSection";
import { LessonSection } from "./components/LessonSection";
import { CreateQuestionSection } from "./components/CreateQuestionSection";

const CourseEditPage: FC = () => {
  const { course_id } = useParams<{ course_id: string }>();
  const queryClient = useQueryClient();

  const {
    data: course,
    isLoading,
    error,
    refetch,
  } = useQuery<Course>(
    ["course", course_id],
    () => ApiService.get<Course>(`/course/${course_id}`),
    {
      enabled: !!course_id,
      refetchOnWindowFocus: false,
    }
  );

  // States cho UI các section
  const [editingLesson, setEditingLesson] = useState<string | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonOverview, setNewLessonOverview] = useState("");
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  // States course info UI
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingImage, setEditingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [newTag, setNewTag] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);

  const [showCreateQuestion, setShowCreateQuestion] = useState<{
    lessonId: string;
    questionSequence: number;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const courseSectionRef = useRef<HTMLDivElement>(null);
  const lessonSectionRef = useRef<HTMLDivElement>(null);

  // Sync ảnh mỗi khi có course mới
  useEffect(() => {
    if (course?.image_url) setImageUrl(course.image_url);
  }, [course?.image_url]);

  // TipTap editor chỉ cho dữ liệu legacy (không còn dùng để gửi API nữa)
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: { HTMLAttributes: {} },
      }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: course?.overview ?? "",
    editable: false,
  });

  // Hàm update field cho CourseSection, chỉ PUT và cập nhật local cache
  const handleUpdateCourseField = useCallback(
    async (field: string, value: any) => {
      if (!course) return;
      await ApiService.put(`/course/${course.id}`, { field, value });
      queryClient.setQueryData<Course>(["course", course.id], {
        ...course,
        [field]: value,
      });
    },
    [course, queryClient]
  );

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f6f0] text-lg">
        Đang tải khoá học...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f6f0] text-red-500 text-lg">
        Lỗi: {error instanceof Error ? error.message : "Không lấy được dữ liệu"}
      </div>
    );
  if (!course)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f6f0] text-lg">
        Không tìm thấy khoá học
      </div>
    );

  return (
    <div className="min-h-screen p-8" ref={containerRef}>
      <div className="w-full flex gap-8 min-h-[calc(100vh-4rem)] h-[calc(100vh-4rem)] relative overflow-hidden">
        {/* CourseSection */}
        <div
          ref={courseSectionRef}
          className={`absolute left-0 w-[40%] h-full transition-all duration-500 ease-in-out transform 
            ${
              showCreateQuestion
                ? "opacity-0 -translate-x-full pointer-events-none"
                : "opacity-100 translate-x-0"
            }`}
        >
          {!showCreateQuestion && (
            <div className="h-full">
              <CourseSection
                course={course}
                editor={editor}
                editingTitle={editingTitle}
                editingImage={editingImage}
                imageUrl={imageUrl}
                newTag={newTag}
                showTagInput={showTagInput}
                onCourseChange={(updatedCourse) =>
                  queryClient.setQueryData(["course", course.id], updatedCourse)
                }
                onSetEditingTitle={setEditingTitle}
                onSetEditingImage={setEditingImage}
                onSetImageUrl={setImageUrl}
                onSetNewTag={setNewTag}
                onSetShowTagInput={setShowTagInput}
                onUpdateCourseField={handleUpdateCourseField}
              />
            </div>
          )}
        </div>
        {/* LessonSection */}
        <div
          ref={lessonSectionRef}
          className={`absolute left-[42%] w-[58%] h-full transition-all duration-500 ease-in-out transform
            ${
              showCreateQuestion
                ? "opacity-0 translate-x-full pointer-events-none"
                : "opacity-100 translate-x-0"
            }`}
        >
          {!showCreateQuestion && (
            <div className="h-full">
              <LessonSection
                course={course}
                editingLesson={editingLesson}
                newLessonTitle={newLessonTitle}
                newLessonOverview={newLessonOverview}
                showCreateQuestion={showCreateQuestion}
                selectedLessonId={selectedLessonId}
                onCourseChange={(updatedCourse) =>
                  queryClient.setQueryData(["course", course.id], updatedCourse)
                }
                onSetEditingLesson={setEditingLesson}
                onSetNewLessonTitle={setNewLessonTitle}
                onSetNewLessonOverview={setNewLessonOverview}
                onShowCreateQuestion={(
                  lessonId: string,
                  questionSequence: number
                ) => setShowCreateQuestion({ lessonId, questionSequence })}
                onCloseCreateQuestion={() => {
                  setSelectedLessonId(null);
                }}
              />
            </div>
          )}
        </div>
        {/* Create Question Section */}
        <div
          className={`absolute inset-0 h-full transition-all duration-500 ease-in-out transform 
            ${
              showCreateQuestion
                ? "opacity-100 translate-x-0 pointer-events-auto"
                : "opacity-0 translate-x-full pointer-events-none"
            }`}
        >
          {showCreateQuestion && (
            <CreateQuestionSection
              lessonId={showCreateQuestion.lessonId}
              lessonTitle={
                course.lessons.find((l) => l.id === showCreateQuestion.lessonId)
                  ?.title || ""
              }
              lessonSequence={
                course.lessons.find((l) => l.id === showCreateQuestion.lessonId)
                  ?.sequence || 0
              }
              questionSequence={showCreateQuestion.questionSequence}
              onClose={() => setShowCreateQuestion(null)}
              onCreated={refetch}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseEditPage;

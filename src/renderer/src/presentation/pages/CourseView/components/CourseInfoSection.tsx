import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Book, Menu, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CourseType } from "../types/course";
import ImagePreview from "../../../components/Image/ImagePreview";
import { RichtextView } from "../../../components/common/RichtextView";

const LEVEL_LABELS: Record<string, string> = {
  beginner: "Cơ bản",
  intermediate: "Trung cấp",
  advanced: "Nâng cao",
  expert: "Chuyên gia",
};

const colors = [
  "bg-[#FF69B4]/20 text-[#FF69B4]",
  "bg-[#4A90E2]/20 text-[#4A90E2]",
  "bg-[#3CB371]/20 text-[#3CB371]",
  "bg-[#9370DB]/20 text-[#9370DB]",
  "bg-[#FF7F50]/20 text-[#FF7F50]",
  "bg-[#FFD700]/20 text-[#FFD700]",
];

interface CourseInfoSectionProps {
  course: CourseType;
}

const CourseInfoSection = ({ course }: CourseInfoSectionProps) => {
  const navigate = useNavigate();
  const images = course.image_url
    ? [course.image_url]
    : [
        "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80",
      ];

  // Always try to keep code lean for maintainability! 💪
  return (
    <div className="mb-8 flex gap-8 flex-wrap items-start">
      {/* Image Section */}
      <div className="w-[300px] min-w-[240px]">
        <ImagePreview images={images} gridCols={1} />
      </div>
      {/* Course Info Section */}
      <div className="flex-1 min-w-[280px] flex flex-col relative">
        {/* Title + Badges */}
        <div className="mb-5 flex items-center justify-between gap-3 flex-wrap">
          {/* Truncated title */}
          <h1 className="text-3xl font-bold text-[#2D3748] truncate max-w-full">
            {course.title}
          </h1>
          <div className="flex gap-2">
            {/* Status first, then Level */}
            <Badge className="bg-sky-100 text-sky-700">{course.status}</Badge>
            <Badge
              variant="secondary"
              className="bg-[#52aaa5] text-white rounded-lg"
            >
              {LEVEL_LABELS[course.level] || course.level}
            </Badge>
          </div>
        </div>
        {/* Type Badge */}
        <div className="flex gap-2 items-center mb-3">
          <Badge
            className={`${
              course.type === "BOOK"
                ? "bg-[#52aaa5]/10 text-[#52aaa5]"
                : "bg-[#718096]/10 text-[#718096]"
            } rounded-lg`}
            variant="secondary"
          >
            {course.type === "BOOK" ? (
              <span className="flex items-center gap-1">
                <Book className="h-4 w-4" /> Sách
              </span>
            ) : (
              "Khác"
            )}
          </Badge>
        </div>
        {/* Skills */}
        {course.skills.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {course.skills.map((skill, index) => (
              <Badge
                key={skill}
                variant="secondary"
                className={`${
                  colors[index % colors.length]
                } text-xs font-medium rounded-lg`}
              >
                {skill}
              </Badge>
            ))}
          </div>
        )}
        {/* Book Info Vertical */}
        {course.type === "BOOK" && course.course_book && (
          <div className="rounded-lg mb-4">
            <div className="flex flex-col gap-2 text-gray-700 text-sm">
              <div>
                <span className="font-semibold">Nhà xuất bản:</span>
                <span className="ml-1">
                  {course.course_book.publishers.join(", ")}
                </span>
              </div>
              <div>
                <span className="font-semibold">Tác giả:</span>
                <span className="ml-1">
                  {course.course_book.authors.join(", ")}
                </span>
              </div>
              <div>
                <span className="font-semibold">Năm xuất bản:</span>
                <span className="ml-1">
                  {course.course_book.publication_year}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Spacer to push buttons to the bottom */}
        <div className="flex-grow" />
        {/* Buttons bottom right */}
        <div className="flex justify-end gap-3 mt-4">
          <Button
            variant="outline"
            className="border-slate-300 text-gray-600 hover:bg-gray-100 rounded-lg shadow-sm"
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            className="border-pink-200 text-pink-500 hover:bg-pink-50 rounded-lg shadow-sm"
            aria-label="Yêu thích"
          >
            <Heart className="h-5 w-5" />
          </Button>
          <Button
            size="lg"
            className="rounded-lg px-5 bg-[#52aaa5] text-white hover:bg-[#389b92] shadow-sm"
            onClick={() =>
              navigate(
                `/course/${course.id}/lesson/${course.lessons?.[0]?.id ?? ""}`
              )
            }
          >
            Học ngay
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseInfoSection;

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ApiService from "../../../service/ApiService";
import CourseInfoSection from "./components/CourseInfoSection";
import LessonSection from "./components/LessonSection";
import ProgressSection from "./components/ProgressSection";
import { CourseType } from "./types/course";

const progressFake = {
  completion: 30,
  lessonsCompleted: 1,
  questionsAnswered: 3,
  timeSpent: 76,
};

const CourseViewPage = () => {
  const { course_id } = useParams<{ course_id: string }>();
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState<CourseType | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const data = await ApiService.get<CourseType>(
          `/course/${course_id}`,
          true
        );
        setCourse(data);
      } catch (err) {
        setCourse(null);
      }
      setLoading(false);
    };
    fetchCourse();
  }, [course_id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f6f0]">
        <div className="text-xl text-[#52aaa5] animate-pulse">
          Đang tải khoá học...
        </div>
      </div>
    );

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f6f0]">
        <h1 className="text-2xl text-[#2D3748]">Không tìm thấy khoá học</h1>
      </div>
    );
  }

  const progress = progressFake;

  return (
    <div className="relative min-h-screen p-6">
      {/* Phần thông tin (ảnh & mô tả khóa học) */}
      <CourseInfoSection course={course} />

      {/* Phần tiến độ */}
      <ProgressSection
        progress={progress}
        totalLessons={course.lessons.length}
      />

      {/* Danh sách bài học */}
      <LessonSection course={course} />
    </div>
  );
};

export default CourseViewPage;

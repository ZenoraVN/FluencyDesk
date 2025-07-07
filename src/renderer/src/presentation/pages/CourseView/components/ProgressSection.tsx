// FluencyDev/src/presentation/pages/CourseView/components/ProgressSection.tsx
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Progress } from "../../../components/ui/progress";
import { CheckCircle2, Clock, BookOpen } from "lucide-react";

interface ProgressData {
  completion: number;
  lessonsCompleted: number;
  questionsAnswered: number;
  timeSpent: number;
}

interface ProgressSectionProps {
  progress: ProgressData;
  totalLessons: number;
}

const formatTime = (minutes: number) => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

const ProgressSection = ({ progress, totalLessons }: ProgressSectionProps) => (
  <Card className="mb-8 rounded-2xl border-[#52aaa5]/10">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-[#2D3748]">
        <CheckCircle2 className="h-5 w-5 text-[#52aaa5]" />
        Tiến độ học tập
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[#2D3748]">Hoàn thành khoá học</p>
            <p className="font-medium text-[#52aaa5]">{progress.completion}%</p>
          </div>
          <Progress
            value={progress.completion}
            className="h-2 bg-[#52aaa5]/10"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-[#52aaa5]/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[#52aaa5]" />
              <span className="text-sm font-medium text-[#2D3748]">
                Bài học
              </span>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold text-[#52aaa5]">
                {progress.lessonsCompleted}
              </p>
              <p className="text-sm text-[#718096]">
                /{totalLessons} hoàn thành
              </p>
            </div>
          </div>
          <div className="rounded-xl bg-[#52aaa5]/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[#52aaa5]" />
              <span className="text-sm font-medium text-[#2D3748]">
                Câu hỏi
              </span>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold text-[#52aaa5]">
                {progress.questionsAnswered}
              </p>
              <p className="text-sm text-[#718096]">đã trả lời</p>
            </div>
          </div>
          <div className="rounded-xl bg-[#52aaa5]/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#52aaa5]" />
              <span className="text-sm font-medium text-[#2D3748]">
                Thời gian
              </span>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold text-[#52aaa5]">
                {formatTime(progress.timeSpent)}
              </p>
              <p className="text-sm text-[#718096]">học tập</p>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default ProgressSection;

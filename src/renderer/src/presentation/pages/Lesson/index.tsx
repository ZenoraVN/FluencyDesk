import { useState } from 'react'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { mockLesson } from './data/mockData'
import ChoiceOneQuestion from './components/ChoiceOneQuestion'
import FillInTheBlankQuestion from './components/FillInTheBlankQuestion'
import LessonProgress from './components/LessonProgress'

const LessonPage = () => {
  const navigate = useNavigate()
  const { courseId, lessonId } = useParams()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([])

  // In a real app, we would fetch the lesson data based on courseId and lessonId
  // For now, we'll use the mock data
  const lesson = mockLesson
  const currentQuestion = lesson.questions[currentQuestionIndex]
  const progress = Math.round((answeredQuestions.filter(Boolean).length / lesson.questions.length) * 100)

  const handleAnswer = (isCorrect: boolean) => {
    const newAnsweredQuestions = [...answeredQuestions]
    newAnsweredQuestions[currentQuestionIndex] = isCorrect
    setAnsweredQuestions(newAnsweredQuestions)
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < lesson.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handleBack = () => {
    navigate(`/course/${courseId}`)
  }

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case 'choice_one':
        return (
          <ChoiceOneQuestion
            data={currentQuestion.data}
            onAnswer={handleAnswer}
          />
        )
      case 'fill_in_the_blank':
        return (
          <FillInTheBlankQuestion
            data={currentQuestion.data}
            onAnswer={handleAnswer}
          />
        )
      default:
        return <div>Unsupported question type</div>
    }
  }

  return (
    <div className="container py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-4">
          <Button
            variant="ghost"
            className="rounded-full p-2 hover:bg-[#52aaa5]/10"
            onClick={handleBack}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="mb-1 text-3xl font-bold text-[#2D3748]">{lesson.title}</h1>
            <p className="text-[#718096]">{lesson.subtitle}</p>
          </div>
        </div>

        <LessonProgress
          currentQuestion={currentQuestionIndex}
          totalQuestions={lesson.questions.length}
          progress={progress}
          onPrevious={handlePrevious}
          onNext={handleNext}
          canGoNext={currentQuestionIndex < lesson.questions.length - 1 && answeredQuestions[currentQuestionIndex]}
          canGoPrevious={currentQuestionIndex > 0}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              {renderQuestion()}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Lesson Content */}
          <Card>
            <CardHeader>
              <CardTitle>Nội dung bài học</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none dark:prose-invert">
                <p className="text-[#718096]">{lesson.content.introduction}</p>
                
                <h3 className="mt-4 font-medium text-[#2D3748]">Ví dụ:</h3>
                <ul className="list-inside list-disc space-y-2 text-[#718096]">
                  {lesson.content.examples.map((example, index) => (
                    <li key={index}>{example}</li>
                  ))}
                </ul>

                <h3 className="mt-4 font-medium text-[#2D3748]">Điểm chính:</h3>
                <ul className="list-inside list-disc space-y-2 text-[#718096]">
                  {lesson.content.keyPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Thao tác nhanh</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button variant="outline" className="justify-start">
                Ghi chú
              </Button>
              <Button variant="outline" className="justify-start">
                Lưu bài học
              </Button>
              <Button 
                variant="outline" 
                className="justify-start text-red-500 hover:bg-red-50"
                onClick={handleBack}
              >
                Thoát bài học
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default LessonPage
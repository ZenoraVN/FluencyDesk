import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'

const LessonPage = () => {
  return (
    <div className="container py-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Basic Grammar - Lesson 1</h1>
          <p className="text-muted-foreground">Present Simple Tense</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline">Previous</Button>
          <Button>Next Lesson</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Lesson Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none dark:prose-invert">
                <h2>Introduction to Present Simple</h2>
                <p>
                  The present simple tense is used to talk about regular actions,
                  facts, habits, and general truths.
                </p>
                <h3>Examples:</h3>
                <ul>
                  <li>I play tennis every weekend.</li>
                  <li>She works in a bank.</li>
                  <li>The sun rises in the east.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Completion</span>
                  <span>60%</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-full w-[60%] rounded-full bg-primary"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button variant="outline" className="justify-start">
                Take Quiz
              </Button>
              <Button variant="outline" className="justify-start">
                Practice Exercise
              </Button>
              <Button variant="outline" className="justify-start">
                Save Notes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default LessonPage
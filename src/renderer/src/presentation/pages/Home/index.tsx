import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'

const HomePage = () => {
  return (
    <div className="container py-6">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">Welcome back!</h1>
        <p className="text-xl text-muted-foreground">Continue your English learning journey</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button variant="outline" className="justify-start">
              Continue Last Lesson
            </Button>
            <Button variant="outline" className="justify-start">
              Practice Speaking
            </Button>
            <Button variant="outline" className="justify-start">
              Review Vocabulary
            </Button>
          </CardContent>
        </Card>

        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Progress Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="mb-2">Daily Streak</p>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-full w-2/3 rounded-full bg-primary"></div>
                </div>
              </div>
              <div>
                <p className="mb-2">Weekly Goals</p>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-full w-1/2 rounded-full bg-primary"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <p className="text-sm">Completed Grammar Lesson</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <p className="text-sm">Practiced Speaking</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <p className="text-sm">Added New Vocabulary</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default HomePage
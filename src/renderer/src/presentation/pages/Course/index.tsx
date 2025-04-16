import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'

const CoursePage = () => {
  return (
    <div className="container py-6">
      <h1 className="mb-6 text-3xl font-bold">My Courses</h1>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Course Card */}
        <Card>
          <CardHeader>
            <CardTitle>English Grammar Basics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <p className="text-muted-foreground">
                Master the fundamentals of English grammar
              </p>
              <div className="mt-2">
                <Button className="w-full">Continue Learning</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add more course cards here */}
      </div>
    </div>
  )
}

export default CoursePage
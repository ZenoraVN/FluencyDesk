import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'

const NotebookPage = () => {
  return (
    <div className="container py-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">My Notebook</h1>
          <p className="text-muted-foreground">Your personal language learning notes</p>
        </div>
        <Button>Add New Note</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Vocabulary Note */}
        <Card>
          <CardHeader>
            <CardTitle>Vocabulary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Perseverance</h3>
                <p className="text-sm text-muted-foreground">
                  Persistence in doing something despite difficulty
                </p>
                <div className="mt-2 flex gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm">Review</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grammar Note */}
        <Card>
          <CardHeader>
            <CardTitle>Grammar Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Present Perfect</h3>
                <p className="text-sm text-muted-foreground">
                  Used for past actions with present consequences
                </p>
                <div className="mt-2 flex gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm">Review</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Phrases Note */}
        <Card>
          <CardHeader>
            <CardTitle>Common Phrases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Business English</h3>
                <p className="text-sm text-muted-foreground">
                  Useful phrases for business meetings
                </p>
                <div className="mt-2 flex gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm">Review</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default NotebookPage
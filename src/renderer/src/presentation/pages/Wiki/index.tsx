import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'

const WikiPage = () => {
  return (
    <div className="container py-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">English Learning Wiki</h1>
          <p className="text-muted-foreground">Comprehensive English learning resources</p>
        </div>
        <div className="flex gap-4">
          <input
            type="search"
            placeholder="Search wiki..."
            className="rounded-md border border-input bg-background px-3 py-2"
          />
          <Button variant="outline">Search</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Grammar Section */}
        <Card>
          <CardHeader>
            <CardTitle>Grammar Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Comprehensive guide to English grammar rules and usage
              </p>
              <ul className="space-y-2">
                <li className="text-sm">• Verb Tenses</li>
                <li className="text-sm">• Parts of Speech</li>
                <li className="text-sm">• Sentence Structure</li>
              </ul>
              <Button variant="outline" className="w-full">View Guide</Button>
            </div>
          </CardContent>
        </Card>

        {/* Vocabulary Section */}
        <Card>
          <CardHeader>
            <CardTitle>Vocabulary Builder</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Expand your English vocabulary with categorized word lists
              </p>
              <ul className="space-y-2">
                <li className="text-sm">• Common Phrases</li>
                <li className="text-sm">• Business English</li>
                <li className="text-sm">• Academic Words</li>
              </ul>
              <Button variant="outline" className="w-full">Explore Words</Button>
            </div>
          </CardContent>
        </Card>

        {/* Pronunciation Section */}
        <Card>
          <CardHeader>
            <CardTitle>Pronunciation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Learn proper English pronunciation and phonetics
              </p>
              <ul className="space-y-2">
                <li className="text-sm">• Sound Guide</li>
                <li className="text-sm">• Stress Patterns</li>
                <li className="text-sm">• Intonation</li>
              </ul>
              <Button variant="outline" className="w-full">Start Learning</Button>
            </div>
          </CardContent>
        </Card>

        {/* Writing Section */}
        <Card>
          <CardHeader>
            <CardTitle>Writing Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Improve your English writing skills
              </p>
              <ul className="space-y-2">
                <li className="text-sm">• Essay Writing</li>
                <li className="text-sm">• Business Writing</li>
                <li className="text-sm">• Creative Writing</li>
              </ul>
              <Button variant="outline" className="w-full">Learn More</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default WikiPage
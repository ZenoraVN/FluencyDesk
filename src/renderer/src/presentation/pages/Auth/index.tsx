import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'

const AuthPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Welcome to Fluency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Button variant="default" size="lg">
              Sign In
            </Button>
            <Button variant="outline" size="lg">
              Create Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AuthPage
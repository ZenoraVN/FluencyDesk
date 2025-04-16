import { Button } from '../../../components/ui/button'
import { useNavigate } from 'react-router-dom'

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="mb-2 text-4xl font-bold">404</h1>
        <p className="mb-6 text-xl text-muted-foreground">Page not found</p>
        <Button onClick={() => navigate('/')}>Return Home</Button>
      </div>
    </div>
  )
}

export default NotFoundPage
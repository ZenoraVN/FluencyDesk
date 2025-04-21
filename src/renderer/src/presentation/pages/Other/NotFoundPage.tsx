import { Link } from 'react-router-dom'
import { Button } from '../../../components/ui/button'
import { Home } from 'lucide-react'

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <div className="mt-4 space-y-2">
          <h2 className="text-2xl font-semibold">Trang không tồn tại</h2>
          <p className="text-muted-foreground">
            Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          </p>
        </div>
        
        <Link to="/">
          <Button className="mt-8 gap-2">
            <Home className="h-4 w-4" />
            Trở về trang chủ
          </Button>
        </Link>
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-[400px] w-[400px] rounded-full bg-primary/5" />
        </div>
        <div className="absolute left-1/3 top-1/3 -translate-x-1/2 -translate-y-1/2">
          <div className="h-[200px] w-[200px] rounded-full bg-primary/3" />
        </div>
        <div className="absolute right-1/3 bottom-1/3 translate-x-1/2 translate-y-1/2">
          <div className="h-[300px] w-[300px] rounded-full bg-primary/4" />
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
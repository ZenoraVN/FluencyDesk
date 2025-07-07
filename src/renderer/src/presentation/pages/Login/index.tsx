import { useState } from 'react'
import { Button } from '../../../components/ui/button'
import { Card } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { FcGoogle } from 'react-icons/fc'

import ApiService from '../../../service/ApiService'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await ApiService.post<{
        id: string
        token: string
      }>('/user/login', { email, password }, false)
      await ApiService.saveToken(res.token)
      navigate('/')
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Đăng nhập thất bại.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#f6f6f0] p-6">
      {/* Decorative Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Large focal points */}
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#52aaa5]/5" />
        <div className="absolute -left-20 bottom-20 h-80 w-80 rounded-full bg-[#52aaa5]/7" />
        <div className="absolute right-1/4 top-1/3 h-72 w-72 rounded-3xl bg-[#52aaa5]/4 transform rotate-45" />

        {/* Medium elements */}
        <div className="absolute left-1/3 top-1/2 h-48 w-48 rounded-2xl bg-[#52aaa5]/8 transform -rotate-15" />
        <div className="absolute right-1/3 bottom-1/4 h-40 w-40 rounded-full bg-[#52aaa5]/5" />

        {/* Small elements */}
        <div className="absolute right-1/4 bottom-1/3 h-24 w-24 rounded-full bg-[#52aaa5]/9" />
        <div className="absolute left-1/4 top-1/4 h-20 w-20 rounded-2xl bg-[#52aaa5]/6 transform rotate-15" />

        {/* Lines */}
        <div className="absolute left-0 top-1/2 h-1 w-1/3 bg-[#52aaa5]/10 transform -rotate-45" />
        <div className="absolute right-0 bottom-1/3 h-1/4 w-1 bg-[#52aaa5]/8" />
      </div>

      {/* Login Card */}
      <Card className="relative w-[400px] overflow-hidden rounded-2xl border-[#52aaa5]/10 bg-white/80 p-8 shadow-xl backdrop-blur-sm">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-[#2D3748]">Đăng nhập</h1>
          <p className="text-[#718096]">Chào mừng bạn quay trở lại</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#2D3748]">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 rounded-xl border-[#52aaa5]/20 bg-white/50 px-4 text-[#2D3748] placeholder:text-[#718096]/50 focus:border-[#52aaa5] focus:ring-[#52aaa5]/30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-[#2D3748]">
              Mật khẩu
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 rounded-xl border-[#52aaa5]/20 bg-white/50 px-4 text-[#2D3748] placeholder:text-[#718096]/50 focus:border-[#52aaa5] focus:ring-[#52aaa5]/30"
            />
          </div>

          {error && (
            <div className="w-full rounded-xl bg-red-50 border border-red-200 px-4 py-2 mb-1 text-red-600 text-sm text-center">
              {error}
            </div>
          )}
          <Button
            type="submit"
            className="h-12 w-full rounded-xl bg-[#52aaa5] text-base font-semibold text-white hover:bg-[#52aaa5]/90 flex items-center justify-center"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            Đăng nhập
          </Button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#52aaa5]/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-[#718096]">Hoặc</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="h-12 w-full gap-3 rounded-xl border-[#52aaa5]/20 text-base font-medium text-[#2D3748] hover:bg-[#52aaa5]/5"
            onClick={() => {
              /* Handle Google login */
            }}
          >
            <FcGoogle className="h-5 w-5" />
            Tiếp tục với Google
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default LoginPage

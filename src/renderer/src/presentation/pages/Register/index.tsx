import { useState } from 'react'
import { Button } from '../../../components/ui/button'
import { Card } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { FcGoogle } from 'react-icons/fc'

const RegisterPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle registration logic
    console.log('Register:', { email, password, confirmPassword })
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#f6f6f0] p-6">
      {/* Decorative Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Large focal points */}
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#52aaa5]/5" />
        <div className="absolute -right-20 bottom-20 h-80 w-80 rounded-full bg-[#52aaa5]/7" />
        <div className="absolute left-1/4 top-1/3 h-72 w-72 rounded-3xl bg-[#52aaa5]/4 transform -rotate-45" />
        
        {/* Medium elements */}
        <div className="absolute right-1/3 top-1/2 h-48 w-48 rounded-2xl bg-[#52aaa5]/8 transform rotate-15" />
        <div className="absolute left-1/3 bottom-1/4 h-40 w-40 rounded-full bg-[#52aaa5]/5" />
        
        {/* Small elements */}
        <div className="absolute left-1/4 bottom-1/3 h-24 w-24 rounded-full bg-[#52aaa5]/9" />
        <div className="absolute right-1/4 top-1/4 h-20 w-20 rounded-2xl bg-[#52aaa5]/6 transform -rotate-15" />
        
        {/* Lines */}
        <div className="absolute right-0 top-1/2 h-1 w-1/3 bg-[#52aaa5]/10 transform rotate-45" />
        <div className="absolute left-0 bottom-1/3 h-1/4 w-1 bg-[#52aaa5]/8" />
      </div>
      
      {/* Register Card */}
      <Card className="relative w-[400px] overflow-hidden rounded-2xl border-[#52aaa5]/10 bg-white/80 p-8 shadow-xl backdrop-blur-sm">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-[#2D3748]">Đăng ký tài khoản</h1>
          <p className="text-[#718096]">Bắt đầu hành trình học tập của bạn</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#2D3748]">Email</Label>
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
            <Label htmlFor="password" className="text-[#2D3748]">Mật khẩu</Label>
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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-[#2D3748]">Xác nhận mật khẩu</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="h-12 rounded-xl border-[#52aaa5]/20 bg-white/50 px-4 text-[#2D3748] placeholder:text-[#718096]/50 focus:border-[#52aaa5] focus:ring-[#52aaa5]/30"
            />
          </div>

          <Button 
            type="submit" 
            className="h-12 w-full rounded-xl bg-[#52aaa5] text-base font-semibold text-white hover:bg-[#52aaa5]/90"
          >
            Đăng ký
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
            onClick={() => {/* Handle Google registration */}}
          >
            <FcGoogle className="h-5 w-5" />
            Tiếp tục với Google
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default RegisterPage
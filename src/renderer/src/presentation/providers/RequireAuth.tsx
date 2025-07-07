import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

interface RequireAuthProps {
  children: ReactNode
}

export function RequireAuth({ children }: RequireAuthProps) {
  const location = useLocation()

  const accessToken = localStorage.getItem('access_token')

  if (!accessToken) {
    // Redirect to login page, preserving the original location for after login
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <>{children}</>
}

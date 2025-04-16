import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="flex min-h-screen">
        {/* Sidebar */}
        <nav className="w-64 border-r border-border bg-card">
          {/* Add navigation items here */}
        </nav>
        
        {/* Main content */}
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default MainLayout
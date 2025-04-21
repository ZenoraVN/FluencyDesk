import { Outlet } from 'react-router-dom'
import MainSidebar from '../../components/common/MainSidebar'

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="flex min-h-screen">
        <MainSidebar />
        
        {/* Main content */}
        <div className="flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default MainLayout
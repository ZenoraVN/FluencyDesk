import { Outlet } from 'react-router-dom'
import MainSidebar from '../../components/common/MainSidebar'

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <MainSidebar />
      
      {/* Main content */}
      <div className="flex-1 pl-72">
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout
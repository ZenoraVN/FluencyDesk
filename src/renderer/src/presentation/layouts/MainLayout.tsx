import { Outlet } from 'react-router-dom'
import { Sidebar } from '../../components/Sidebar/MainSidebar'

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 pl-72">
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout

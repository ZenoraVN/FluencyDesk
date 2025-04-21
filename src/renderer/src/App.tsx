import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './presentation/pages/Home'
import CoursePage from './presentation/pages/Course'
import MainSidebar from './components/common/MainSidebar'

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen">
      <MainSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/course/:courseId" element={<CoursePage />} />
        </Routes>
      </AppLayout>
    </Router>
  )
}

export default App

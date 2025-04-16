import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { routes } from './presentation/routes'
import './assets/base.css'

function App(): JSX.Element {
  const router = createBrowserRouter(routes)

  return (
    <RouterProvider router={router} />
  )
}

export default App

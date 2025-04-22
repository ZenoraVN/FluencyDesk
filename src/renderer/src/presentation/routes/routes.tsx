import { RouteObject } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import HomePage from '../pages/Home'
import CoursePage from '../pages/Course'
import FavoritePage from '../pages/Favorite'
import NotFoundPage from '../pages/Other/NotFoundPage'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'course/:courseId',
        element: <CoursePage />
      },
      {
        path: 'favorite',
        element: <FavoritePage />
      }
    ]
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
]
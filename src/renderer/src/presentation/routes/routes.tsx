import { RouteObject } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import AuthPage from '../pages/Auth'
import HomePage from '../pages/Home'
import CoursePage from '../pages/Course'
import LessonPage from '../pages/Lesson'
import NotebookPage from '../pages/Notebook'
import SettingPage from '../pages/Setting'
import WikiPage from '../pages/Wiki'
import NotFoundPage from '../pages/Other'

export const routes: RouteObject[] = [
  {
    path: '/auth',
    Component: AuthPage,
  },
  {
    path: '/',
    Component: MainLayout,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: 'courses',
        Component: CoursePage,
      },
      {
        path: 'lessons/:lessonId',
        Component: LessonPage,
      },
      {
        path: 'notebook',
        Component: NotebookPage,
      },
      {
        path: 'wiki',
        Component: WikiPage,
      },
      {
        path: 'settings',
        Component: SettingPage,
      },
      {
        path: '*',
        Component: NotFoundPage,
      },
    ],
  },
]
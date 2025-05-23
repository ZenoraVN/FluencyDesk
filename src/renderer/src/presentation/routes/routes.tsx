import { RouteObject } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import HomePage from '../pages/Home'
import CoursePage from '../pages/Course'
import FavoritePage from '../pages/Favorite'
import MyCoursePage from '../pages/MyCourse'
import SettingPage from '../pages/Setting'
import NotebookPage from '../pages/Notebook'
import NotebookWiki from '../pages/NotebookWiki'
import LessonPage from '../pages/Lesson'
import NoteManagaPage from '../pages/NoteManage'
import NotePage from '../pages/Note'
import AnalyticPage from '../pages/Analytic'
import NotificationPage from '../pages/Notification'
import MissionPage from '../pages/Misson'
import SyncPage from '../pages/Sync'
import NotFoundPage from '../pages/Other/NotFoundPage'
import LoginPage from '../pages/Login'
import RegisterPage from '../pages/Register'

export const routes: RouteObject[] = [
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/register',
    element: <RegisterPage />
  },
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
        path: 'course/:courseId/lesson/:lessonId',
        element: <LessonPage />
      },
      {
        path: 'favorite',
        element: <FavoritePage />
      },
      {
        path: 'my-course',
        element: <MyCoursePage />
      },
      {
        path: 'settings',
        element: <SettingPage />
      },
      {
        path: 'notebook',
        element: <NotebookPage />
      },
      {
        path: 'notebook/:notebookId',
        element: <NotebookWiki />
      },
      {
        path: 'notes',
        element: <NoteManagaPage />
      },
      {
        path: 'note/:id',
        element: <NotePage />
      },
      {
        path: 'analytics',
        element: <AnalyticPage />
      },
      {
        path: 'notifications',
        element: <NotificationPage />
      },
      {
        path: 'tasks',
        element: <MissionPage />
      },
      {
        path: 'sync',
        element: <SyncPage />
      }
    ]
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
]
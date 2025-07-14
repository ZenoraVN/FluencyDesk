import { RouteObject } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import HomePage from '../pages/Home'
import CoursePage from '../pages/CourseManage'
import FavoritePage from '../pages/Favorite'
import SettingPage from '../pages/Setting'
import NotebookPage from '../pages/Notebook'
import NotebookWiki from '../pages/NotebookWiki'
import LessonPage from '../pages/Lesson'
import NoteManagaPage from '../pages/NoteManage'
import NotePage from '../pages/Note'
import AnalyticPage from '../pages/Analytic'
import CourseEditPage from '../pages/CourseEdit'
import LessonEditPage from '../pages/LessonEdit'
import NotFoundPage from '../pages/Other/NotFoundPage'
import LoginPage from '../pages/Login'
import RegisterPage from '../pages/Register'

import { RequireAuth } from '../providers/RequireAuth'
import PracticeWritingPage from '../pages/Practice/Writing/PracticeWritingPage'

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
        element: (
          <RequireAuth>
            <HomePage />
          </RequireAuth>
        )
      },
      {
        path: 'course/:courseId',
        element: (
          <RequireAuth>
            <CoursePage />
          </RequireAuth>
        )
      },
      {
        path: 'course/:courseId/edit',
        element: (
          <RequireAuth>
            <CourseEditPage />
          </RequireAuth>
        )
      },
      {
        path: 'course/:courseId/lesson/:lessonId',
        element: (
          <RequireAuth>
            <LessonPage />
          </RequireAuth>
        )
      },
      {
        path: 'course/:courseId/lesson/:lessonId/edit',
        element: (
          <RequireAuth>
            <LessonEditPage />
          </RequireAuth>
        )
      },
      {
        path: 'favorite',
        element: (
          <RequireAuth>
            <FavoritePage />
          </RequireAuth>
        )
      },
      {
        path: 'my-course',
        element: (
          <RequireAuth>
            <CoursePage />
          </RequireAuth>
        )
      },
      {
        path: 'settings',
        element: (
          <RequireAuth>
            <SettingPage />
          </RequireAuth>
        )
      },
      {
        path: 'notebook',
        element: (
          <RequireAuth>
            <NotebookPage />
          </RequireAuth>
        )
      },
      {
        path: 'notebook/:notebookId',
        element: (
          <RequireAuth>
            <NotebookWiki />
          </RequireAuth>
        )
      },
      {
        path: 'notes',
        element: (
          <RequireAuth>
            <NoteManagaPage />
          </RequireAuth>
        )
      },
      {
        path: 'note/:id',
        element: (
          <RequireAuth>
            <NotePage />
          </RequireAuth>
        )
      },
      {
        path: 'analytics',
        element: (
          <RequireAuth>
            <AnalyticPage />
          </RequireAuth>
        )
      },
      {
        path: 'practice/writing',
        element: (
          <RequireAuth>
            <PracticeWritingPage />
          </RequireAuth>
        )
      }
    ]
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
]

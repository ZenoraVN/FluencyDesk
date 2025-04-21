import React from 'react'
import { RouteObject } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import AuthPage from '../pages/Auth'
import HomePage from '../pages/Home'
import CoursePage from '../pages/Course'
import LessonPage from '../pages/Lesson'
import NotebookPage from '../pages/Notebook'
import SettingPage from '../pages/Setting'
import WikiPage from '../pages/Wiki'
import ErrorBoundary from '../../components/common/ErrorBoundary'
import NotFoundPage from '../pages/Other/NotFoundPage'

export const routes: RouteObject[] = [
  {
    path: '/',
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: 'auth',
        element: <AuthPage />
      },
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <HomePage />
          },
          {
            path: 'courses',
            element: <CoursePage />
          },
          {
            path: 'lessons/:lessonId',
            element: <LessonPage />
          },
          {
            path: 'notebook',
            element: <NotebookPage />
          },
          {
            path: 'wiki',
            element: <WikiPage />
          },
          {
            path: 'settings',
            element: <SettingPage />
          }
        ]
      }
    ]
  },
  // Handle 404s separately from other errors
  {
    path: '*',
    element: <NotFoundPage />
  }
]
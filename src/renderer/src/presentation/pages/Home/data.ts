export interface Course {
  id: string
  type: 'BOOK' | 'OTHER'
  title: string
  overview: string
  skills: string[]
  band: string
  image_urls: string[]
  version: number
  course_book?: {
    id: string
    course_id: string
    publishers: string[]
    authors: string[]
    publication_year: number
  }
  lessons?: {
    id: string
    course_id: string
    sequence: number
    title: string
    overview: string
    version: number
    questions?: {
      id: string
      lesson_id: string
      sequence: number
      question_id: string
      question_type: string
    }[]
  }[]
}

export const courses: Course[] = [
  {
    "id": "f4419c32-7e78-4e46-a889-348abefb0008",
    "type": "BOOK",
    "title": "Cambridge IELTS 17 Academic",
    "overview": "Cambridge IELTS 17 Academic mang đến những bài kiểm tra IELTS cập nhật nhất, giúp thí sinh chuẩn bị tốt nhất cho kỳ thi thật.",
    "skills": ["reading", "listening", "writing", "grammar", "speaking"],
    "band": "7.0",
    "image_urls": ["https://firebasestorage.googleapis.com/v0/b/saleso-426923.appspot.com/o/images%2F8928da7d-92ae-471b-ae2e-14ec589f6f01?alt=media&token=05920d15-4c9e-4c9b-96fe-fd5da5a33a84"],
    "version": 1
  },
  {
    "id": "75f08662-2160-46c2-be3e-10f5aeffeb44",
    "type": "BOOK",
    "title": "Mike's IELTS Writing",
    "overview": "Cuốn sách hướng dẫn cách viết bài luận IELTS theo từng dạng bài, giúp người học phát triển ý tưởng và cải thiện ngữ pháp.",
    "skills": ["writing"],
    "band": "5.0 - 7.5",
    "image_urls": ["https://firebasestorage.googleapis.com/v0/b/saleso-426923.appspot.com/o/images%2Fc6b88338-7901-497f-96d9-9cc76147efbf?alt=media&token=9509bf8b-8720-475a-837a-76ab0db94079"],
    "version": 1
  },
  {
    "id": "af271718-6002-4dc9-b063-a7e8cdbd0077",
    "type": "OTHER",
    "title": "English Communication for Beginners – Giao tiếp Tiếng Anh Cơ bản 1",
    "overview": "Khóa học này giúp bạn xây dựng nền tảng giao tiếp tiếng Anh một cách tự nhiên và tự tin.",
    "skills": ["speaking"],
    "band": "3.0",
    "image_urls": ["https://firebasestorage.googleapis.com/v0/b/saleso-426923.appspot.com/o/images%2Fecd281d7-432a-401a-8497-c05ae89418e2?alt=media&token=91e727e8-6fe3-44a9-ba8f-d81839e4c344"],
    "version": 2
  },
  {
    "id": "2f7aed58-67d9-484f-af3e-d621ea76df75",
    "type": "OTHER",
    "title": "Complete English Grammar Mastery – Làm chủ Ngữ pháp Tiếng Anh từ Cơ bản đến Nâng cao 1",
    "overview": "Khóa học toàn diện giúp bạn nắm vững tất cả chủ điểm ngữ pháp tiếng Anh.",
    "skills": ["reading", "speaking", "grammar"],
    "band": "3.0",
    "image_urls": ["https://firebasestorage.googleapis.com/v0/b/saleso-426923.appspot.com/o/images%2F3393d624-9326-4a1f-b8c7-9a40a197665d?alt=media&token=737ffbe9-2ae8-44d5-99e3-bbdd7bfe9e9a"],
    "version": 19
  },
  {
    "id": "387929a0-eadd-4409-8bf2-f45c82fd2e24",
    "type": "BOOK",
    "title": "Cambridge IELTS 19 Academic",
    "overview": "Dự kiến phát hành vào năm 2024, quyển 19 tiếp tục truyền thống cung cấp các bài thi mẫu chất lượng cao.",
    "skills": ["reading", "listening", "speaking", "writing", "grammar"],
    "band": "7.0",
    "image_urls": ["https://firebasestorage.googleapis.com/v0/b/saleso-426923.appspot.com/o/images%2F8b88695f-e7cd-496d-b68c-2fb305a2f9dc?alt=media&token=69a060f9-f9de-4d2d-bc35-45f27f752c85"],
    "version": 3
  }
]
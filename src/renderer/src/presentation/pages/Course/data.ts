export interface Question {
  id: string
  lesson_id: string
  sequence: number
  question_id: string
  question_type: string
}

export interface Lesson {
  id: string
  course_id: string
  sequence: number
  title: string
  overview: string
  version: number
  questions?: Question[]
}

export interface CourseDetail {
  id: string
  type: 'BOOK' | 'OTHER'
  title: string
  overview: string
  skills: string[]
  band: string
  image_urls: string[]
  version: number
  lessons: Lesson[]
}

export const courseDetail: CourseDetail = {
  "id": "af271718-6002-4dc9-b063-a7e8cdbd0077",
  "type": "OTHER",
  "title": "English Communication for Beginners – Giao tiếp Tiếng Anh Cơ bản 1",
  "overview": "Khóa học này giúp bạn xây dựng nền tảng giao tiếp tiếng Anh một cách tự nhiên và tự tin. Bạn sẽ học các mẫu câu giao tiếp phổ biến, cách phát âm đúng chuẩn, và phát triển kỹ năng nghe – nói trong các tình huống thực tế. Khóa học tập trung vào phản xạ giao tiếp, giúp bạn trò chuyện một cách lưu loát và tự nhiên hơn trong đời sống hàng ngày, công việc và du lịch.",
  "skills": ["speaking"],
  "band": "3.0",
  "image_urls": [
    "https://firebasestorage.googleapis.com/v0/b/saleso-426923.appspot.com/o/images%2Fecd281d7-432a-401a-8497-c05ae89418e2?alt=media&token=91e727e8-6fe3-44a9-ba8f-d81839e4c344"
  ],
  "version": 2,
  "lessons": [
    {
      "id": "171d300b-f05f-467d-9239-06ef76ed43d1",
      "course_id": "af271718-6002-4dc9-b063-a7e8cdbd0077",
      "sequence": 1,
      "title": "Greetings & Self-introduction – Chào hỏi và Giới thiệu bản thân",
      "overview": "Học cách chào hỏi, giới thiệu tên, tuổi, nghề nghiệp, sở thích và đặt câu hỏi cơ bản về người khác.",
      "version": 0,
      "questions": [
        {
          "id": "790f424e-a66f-4c29-bae8-32e4714071d4",
          "lesson_id": "171d300b-f05f-467d-9239-06ef76ed43d1",
          "sequence": 1,
          "question_id": "b90aa510-c823-466c-a748-9cec0ef4899a",
          "question_type": "SPEAKING"
        },
        {
          "id": "cdd6f734-a2a4-4178-86e8-a62a9a5349a0",
          "lesson_id": "171d300b-f05f-467d-9239-06ef76ed43d1",
          "sequence": 2,
          "question_id": "076703bc-1a52-45f8-badb-1ed137431f3d",
          "question_type": "SPEAKING"
        }
      ]
    },
    {
      "id": "b7d09d09-5354-4183-8aee-4705d2678f38",
      "course_id": "af271718-6002-4dc9-b063-a7e8cdbd0077",
      "sequence": 2,
      "title": "Common Expressions in Daily Life – Các mẫu câu giao tiếp hàng ngày",
      "overview": "Tổng hợp các mẫu câu phổ biến trong cuộc sống như cảm ơn, xin lỗi, đề nghị, hỏi ý kiến và diễn đạt cảm xúc.",
      "version": 0,
      "questions": [
        {
          "id": "b6814630-2184-45e3-8d73-945668e16ca7",
          "lesson_id": "b7d09d09-5354-4183-8aee-4705d2678f38",
          "sequence": 1,
          "question_id": "6ce91d32-835b-4746-8ab1-5d335f54df37",
          "question_type": "SPEAKING"
        }
      ]
    },
    {
      "id": "62f6567f-6db2-4f51-804e-a9fd046d2011",
      "course_id": "af271718-6002-4dc9-b063-a7e8cdbd0077",
      "sequence": 3,
      "title": "Talking About Family & Friends – Nói về gia đình và bạn bè",
      "overview": "Học cách giới thiệu thành viên trong gia đình, miêu tả mối quan hệ và nói về bạn bè thân thiết.",
      "version": 0,
      "questions": [
        {
          "id": "5bef4f8f-3556-4917-9846-8d587bb4fc0f",
          "lesson_id": "62f6567f-6db2-4f51-804e-a9fd046d2011",
          "sequence": 1,
          "question_id": "c7b86c48-6f12-4db8-97cf-c989d45a4dff",
          "question_type": "SPEAKING"
        }
      ]
    }
  ]
}
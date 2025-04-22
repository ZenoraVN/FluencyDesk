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
        },
        {
          "id": "1ca3290a-4501-45ca-8bce-0a573ed4bed5",
          "lesson_id": "171d300b-f05f-467d-9239-06ef76ed43d1",
          "sequence": 3,
          "question_id": "37d2aa1a-6477-4377-b9ea-7072359fd5c8",
          "question_type": "SPEAKING"
        },
        {
          "id": "552ea0d7-b0cb-472d-8f8d-911acad8d312",
          "lesson_id": "171d300b-f05f-467d-9239-06ef76ed43d1",
          "sequence": 4,
          "question_id": "f2b494d4-a47f-44d8-a29d-2559afa4411f",
          "question_type": "SPEAKING"
        },
        {
          "id": "363baa35-49ed-470b-b777-4243470ea020",
          "lesson_id": "171d300b-f05f-467d-9239-06ef76ed43d1",
          "sequence": 5,
          "question_id": "6ce91d32-835b-4746-8ab1-5d335f54df37",
          "question_type": "SPEAKING"
        },
        {
          "id": "adf386c8-24e7-4333-88e6-a7a331d9e1ed",
          "lesson_id": "171d300b-f05f-467d-9239-06ef76ed43d1",
          "sequence": 6,
          "question_id": "c7b86c48-6f12-4db8-97cf-c989d45a4dff",
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
    },
    {
      "id": "87e00687-1fa7-4e8b-a0e9-e20ef4c6147b",
      "course_id": "af271718-6002-4dc9-b063-a7e8cdbd0077",
      "sequence": 4,
      "title": "Asking for & Giving Directions – Hỏi và chỉ đường",
      "overview": "Học cách hỏi đường, hiểu hướng dẫn và sử dụng từ vựng về vị trí, phương hướng trong giao tiếp.",
      "version": 0,
      "questions": [
        {
          "id": "593e36ec-a3aa-4a1e-a0b3-ba73947f6711",
          "lesson_id": "87e00687-1fa7-4e8b-a0e9-e20ef4c6147b",
          "sequence": 1,
          "question_id": "e0c094e8-d642-4d87-a07d-f041129424e8",
          "question_type": "SPEAKING"
        }
      ]
    },
    {
      "id": "5c31ee75-a3bb-4696-958c-dfa3fec8677d",
      "course_id": "af271718-6002-4dc9-b063-a7e8cdbd0077",
      "sequence": 5,
      "title": "Shopping & Ordering Food – Mua sắm và gọi món ăn",
      "overview": "Thực hành cách hỏi giá, trả giá, gọi món trong nhà hàng, và diễn đạt nhu cầu khi đi mua sắm.",
      "version": 0
    },
    {
      "id": "995d7974-f69f-4e6a-a68f-1504d509857a",
      "course_id": "af271718-6002-4dc9-b063-a7e8cdbd0077",
      "sequence": 6,
      "title": "Making & Receiving Phone Calls – Gọi và nhận điện thoại",
      "overview": "Học các mẫu câu cơ bản khi nghe điện thoại, để lại tin nhắn và xử lý tình huống giao tiếp qua điện thoại.",
      "version": 0
    },
    {
      "id": "da2bd392-149e-4b0a-8bab-0a799a755948",
      "course_id": "af271718-6002-4dc9-b063-a7e8cdbd0077",
      "sequence": 7,
      "title": "Making Small Talk – Hội thoại ngắn trong giao tiếp",
      "overview": "Cách bắt chuyện, giữ cuộc trò chuyện tiếp tục và kết thúc hội thoại một cách tự nhiên.",
      "version": 0
    },
    {
      "id": "2604c2f6-6a3c-4b6b-854f-8186867a5b9d",
      "course_id": "af271718-6002-4dc9-b063-a7e8cdbd0077",
      "sequence": 8,
      "title": "Talking About Work & Hobbies – Nói về công việc và sở thích",
      "overview": "Giới thiệu về công việc hiện tại, sở thích cá nhân và cách hỏi về công việc của người khác.",
      "version": 0
    },
    {
      "id": "606709ba-9534-4d02-b76f-ca43fff1c9f8",
      "course_id": "af271718-6002-4dc9-b063-a7e8cdbd0077",
      "sequence": 9,
      "title": "Making Appointments & Plans – Đặt lịch hẹn và lên kế hoạch",
      "overview": "Cách sắp xếp cuộc hẹn, đặt lịch gặp gỡ và diễn đạt kế hoạch trong tương lai.",
      "version": 0
    },
    {
      "id": "042c6010-303c-438a-986a-f7ada790fe69",
      "course_id": "af271718-6002-4dc9-b063-a7e8cdbd0077",
      "sequence": 10,
      "title": "Handling Emergencies & Asking for Help – Xử lý tình huống khẩn cấp và nhờ giúp đỡ",
      "overview": "Học các mẫu câu cần thiết khi gặp vấn đề như tai nạn, mất đồ, ốm đau hoặc cần sự giúp đỡ từ người khác.",
      "version": 0
    }
  ]
}
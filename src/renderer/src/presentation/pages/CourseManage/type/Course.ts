export interface CourseSearchRequest {
  page?: number
  page_size?: number
  type?: string
  title?: string
  skills?: string // chỉ 1 skill
  tags?: string // chỉ 1 tag
  level?: string
  status?: string
  creator_id?: string
  creator_role?: string
  is_random?: boolean
  is_owner?: boolean
}

export type CourseType = 'BOOK' | 'OTHER'

export interface Course {
  id: string
  creator_id: string
  creator_role: string
  status: string
  type: CourseType
  title: string
  overview: string
  skills: string[]
  level: string
  image_url?: string
  tags: string[]
  version: number
  updated_at?: string // Thời gian cập nhật gần nhất
}

export interface CreateCourseRequest {
  title: string
  overview: string
  skills: string[]
  level: string
  image: File | null
  tags: string[]
  type: CourseType
}

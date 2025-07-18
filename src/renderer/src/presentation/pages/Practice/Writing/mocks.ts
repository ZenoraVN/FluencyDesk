import type { MyExamType, TaskType, WritingPreviewData } from './types'

export const TEST_WRITING_CHECKER_SECTION = true

// Mock data for checker demo
export const fakeExam: MyExamType = {
  key: 'IELTS',
  label: 'IELTS',
  info: '2 task types',
  purpose: 'For studying or working in English-speaking countries',
  tasks: [
    {
      key: 'task2',
      name: 'Task 2 (Essay)',
      description: 'Essay argumentative/opinion',
      time: '40 minutes',
      words: '~250 words',
      topics: [
        'Environment',
        'Technology',
        'Education',
        'Health',
        'Society',
        'Business',
        'Travel',
        'Culture'
      ],
      minParagraphs: 3
    }
  ]
}

export const fakeTask: TaskType = fakeExam.tasks[0]

export const fakePreview: WritingPreviewData = {
  text: 'Some people believe that unpaid community service should be a compulsory part of high school programmes. To what extent do you agree or disagree?',
  chart: null
}

export const fakeAnswer: string = `In recent yearss there is growing debates about whether unpaid community servise such as volunteering helping eldery, or cleaning public areas should be mandetory part of high school education. While some peoples argue it optional, I strongly agree integrate community service into school programms offers significant educational and social benefit for students and society as whole.

Firstty, mandatory community service equip students with essential lifes skills that academical subjects often overlook. Participating in voluntar work foster empathy, teamwork comunication and a sense of responsibility. For instance, helping at a shelter or organising local clean up campains expose students to real world problmes and encourages them take initiative. These experiences not only make students more well rounded individuals but also prepare they better for the challenges of adult life.

Opponents might argued that forcing students to volunteer could lead them to resentment and superficial engagement. However with proper planning and guidenc, schools can design programs match students interest and strengths. For example, a student passionate about animals could volunteers at rescue centre, while another interested in education could help tutter younger children. When students see the value in what they are doing, motivation naturally follows.

In conclusion, i firmely believe incorporating community service into highschool programmes bring numerous longterm benefits. It help develop essential lifeskills, foster civic responsibility and promote a strong connection between youth and society. Rather than viewing it as burden, we should see it as an investement in building a more compassionate and engaged generation. Furthermore, this policy cultivates leadership and interpersonal skills.
It also improves critical thinking abilities.
Moreover, it encourages time management and problem-solving skills.
`

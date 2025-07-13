// import React from 'react'
// import { useParams } from 'react-router-dom'
// import { QUESTION_DEFINITIONS, SKILLS } from './types/questionDetail'
// import * as LucideIcons from 'lucide-react'
// import { FillInTheBlankExampleDrawer } from '../LessonEdit/components/example/FillInTheBlankExampleDrawer'
// import { CreateQuestionSection } from './components/CreateQuestionSection'
// import ChoiceQuestionSection from './components/ChoiceQuestionSection'

// const QuestionCreatePage: React.FC = () => {
//   const { lessonId } = useParams<{ lessonId: string }>()
//   const [selectedSkill, setSelectedSkill] = React.useState<
//     import('./types/questionDetail').SkillType
//   >(SKILLS[0].value as import('./types/questionDetail').SkillType)

//   // For opening the fill in the blank example drawer
//   const [showFillBlankDrawer, setShowFillBlankDrawer] = React.useState(false)

//   // For create section overlay (and target skill/type)
//   const [showCreateSection, setShowCreateSection] = React.useState(false)
//   const [questionTypeToCreate, setQuestionTypeToCreate] = React.useState<string | null>(null)
//   const [skillForCreate, setSkillForCreate] = React.useState<string | null>(null)

//   if (!lessonId)
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-red-500 font-semibold">Thiếu lessonId</div>
//       </div>
//     )

//   const filteredQuestions = QUESTION_DEFINITIONS.filter((q) =>
//     q.skills.includes(selectedSkill as import('./types/questionDetail').SkillType)
//   )

//   // Handler for viewing example (fill in the blank)
//   const handleViewExample = (q: (typeof QUESTION_DEFINITIONS)[number]) => {
//     if (q.type === 'fill_in_the_blank') {
//       setShowFillBlankDrawer(true)
//     } else {
//       alert('View functionality not implemented')
//     }
//   }

//   // Handler for creating a question type (e.g. on Plus click)
//   const handleCreateQuestion = (q: (typeof QUESTION_DEFINITIONS)[number]) => {
//     setShowCreateSection(true)
//     setQuestionTypeToCreate(q.type)
//     setSkillForCreate(q.skills[0] || selectedSkill) // fallback if multi-skill, use selected
//   }

//   const creating = showCreateSection && questionTypeToCreate && skillForCreate

//   return (
//     <>
//       {!creating && (
//         <ChoiceQuestionSection
//           selectedSkill={selectedSkill}
//           onSelectSkill={setSelectedSkill}
//           questions={filteredQuestions}
//           onViewExample={handleViewExample}
//           onCreateQuestion={handleCreateQuestion}
//         />
//       )}
//       <FillInTheBlankExampleDrawer
//         open={showFillBlankDrawer}
//         onClose={() => setShowFillBlankDrawer(false)}
//       />
//       <CreateQuestionSection
//         open={!!creating}
//         onClose={() => {
//           setShowCreateSection(false)
//           setQuestionTypeToCreate(null)
//           setSkillForCreate(null)
//         }}
//         initialSkill={skillForCreate as any}
//         initialType={questionTypeToCreate as any}
//       />
//     </>
//   )
// }

// export default QuestionCreatePage

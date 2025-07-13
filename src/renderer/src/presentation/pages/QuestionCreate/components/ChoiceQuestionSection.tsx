// import React from 'react'
// import { SKILLS, QuestionDefinition, SkillType } from '../types/questionDetail'
// import { QuestionFilter } from './QuestionFilter'
// import { QuestionGrid } from './QuestionGrid'

// export interface ChoiceQuestionSectionProps {
//   selectedSkill: SkillType
//   onSelectSkill: (skill: SkillType) => void
//   questions: QuestionDefinition[]
//   onViewExample: (q: QuestionDefinition) => void
//   onCreateQuestion: (q: QuestionDefinition) => void
// }

// export const ChoiceQuestionSection: React.FC<ChoiceQuestionSectionProps> = ({
//   selectedSkill,
//   onSelectSkill,
//   questions,
//   onViewExample,
//   onCreateQuestion
// }) => {
//   return (
//     <div className="w-full min-h-screen flex items-start px-4 py-8 gap-8">
//       <QuestionFilter selectedSkill={selectedSkill} onSelect={onSelectSkill} />
//       <main className="flex-1 flex flex-col rounded-xl p-6">
//         <h1 className="text-xl md:text-2xl font-bold text-[#233c5c] mb-6">
//           Questions for{' '}
//           <span style={{ color: SKILLS.find((s) => s.value === selectedSkill)?.color }}>
//             {SKILLS.find((s) => s.value === selectedSkill)?.label}
//           </span>
//         </h1>
//         {questions.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-12">
//             <span className="text-gray-400 mb-4" style={{ fontSize: 48 }}>
//               📂
//             </span>
//             <p className="text-gray-500 text-lg">No questions available for this skill</p>
//             <p className="text-gray-400 mt-2">Try selecting a different skill category</p>
//           </div>
//         ) : (
//           <QuestionGrid
//             questions={questions}
//             onViewExample={onViewExample}
//             onCreateQuestion={onCreateQuestion}
//             skillsList={SKILLS}
//           />
//         )}
//       </main>
//     </div>
//   )
// }

// export default ChoiceQuestionSection

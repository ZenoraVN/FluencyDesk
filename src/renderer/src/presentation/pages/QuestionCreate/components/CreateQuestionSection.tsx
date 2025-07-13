// import { FC, useState, useEffect } from 'react'
// import { useForm, FormProvider } from 'react-hook-form'
// import { X } from 'lucide-react'
// import { Button } from '../../../../components/ui/button'
// import { SkillType, QuestionType, SKILLS, QUESTION_TYPES } from '../types/questionDetail'
// import { BaseQuestionForm } from './forms/BaseQuestionForm'
// import { ListeningDetailForm, ListeningDetailFormData } from './forms/ListeningDetailForm'
// import { ReadingDetailForm, ReadingDetailFormData } from './forms/ReadingDetailForm'
// import { FillInBlankForm } from './forms/FillInBlankForm'
// import { ChoiceOneForm } from './forms/ChoiceOneForm'
// import { ChoiceMultiForm } from './forms/ChoiceMultiForm'
// import { MatchingForm } from './forms/MatchingForm'
// import { TrueFalseNotGivenForm } from './forms/TrueFalseNotGivenForm'
// import { ErrorIdentificationForm } from './forms/ErrorIdentificationForm'
// import { SentenceCompletionForm } from './forms/SentenceCompletionForm'
// import { ConversationalRepetitionForm } from './forms/ConversationalRepetitionForm'
// import { OpenParagraphForm } from './forms/OpenParagraphForm'
// import { OpenConversationForm } from './forms/OpenConversationForm'
// import { WordRepetitionForm } from './forms/WordRepetitionForm'
// import { PhraseRepetitionForm } from './forms/PhraseRepetitionForm'
// import { AIForm } from './forms/AIForm'

// interface FormState {
//   data: any
//   hasErrors: boolean
// }

// interface CreateQuestionSectionProps {
//   open: boolean
//   onClose: () => void
//   initialSkill?: SkillType | null
//   initialType?: QuestionType | null
// }

// export const CreateQuestionSection: FC<CreateQuestionSectionProps> = ({
//   open,
//   onClose,
//   initialSkill = null,
//   initialType = null
// }) => {
//   const [selectedSkill, setSelectedSkill] = useState<SkillType | null>(initialSkill)
//   const [selectedType, setSelectedType] = useState<QuestionType | null>(initialType)
//   const [detailData, setDetailData] = useState<FormState | null>(null)
//   const [aiData, setAIData] = useState<any>(null)

//   useEffect(() => {
//     if (!open) {
//       setSelectedSkill(initialSkill)
//       setSelectedType(initialType)
//       setDetailData(null)
//       setAIData(null)
//     }
//   }, [open, initialSkill, initialType])

//   // Nếu truyền initialSkill, set lên khi mount
//   useEffect(() => {
//     if (initialSkill) {
//       setSelectedSkill(initialSkill)
//     }
//   }, [initialSkill])

//   // Nếu truyền initialType, set lên khi mount
//   useEffect(() => {
//     if (initialType) {
//       setSelectedType(initialType)
//     }
//   }, [initialType])

//   // Tùy chỉnh hookform cho mọi giá trị cha
//   const methods = useForm<any>({
//     mode: 'onChange',
//     defaultValues: {
//       skill: initialSkill ? initialSkill : undefined,
//       type: initialType ? initialType : undefined,
//       topic: [],
//       tags: [],
//       level: 'intermediate',
//       score: 10,
//       instruction: ''
//     }
//   })

//   useEffect(() => {
//     if (aiData) {
//       if (aiData.topic) methods.setValue('topic', aiData.topic)
//       if (aiData.tags) methods.setValue('tags', aiData.tags)
//       if (aiData.level) methods.setValue('level', aiData.level)
//       if (aiData.instruction) methods.setValue('instruction', aiData.instruction)

//       if (aiData.fill_in_the_blank_question && aiData.fill_in_the_blank_answers) {
//         methods.setValue('fill_in_the_blank_question', aiData.fill_in_the_blank_question)
//         methods.setValue('fill_in_the_blank_answers', aiData.fill_in_the_blank_answers)
//       }
//       if (aiData.choice_one_question && aiData.choice_one_options) {
//         methods.setValue('choice_one_question', aiData.choice_one_question)
//         methods.setValue('choice_one_options', aiData.choice_one_options)
//       }
//       if (aiData.choice_multi_question && aiData.choice_multi_options) {
//         methods.setValue('choice_multi_question', aiData.choice_multi_question)
//         methods.setValue('choice_multi_options', aiData.choice_multi_options)
//       }
//       if (aiData.matchings) {
//         methods.setValue('matchings', aiData.matchings)
//       }
//       if (aiData.true_false_not_givens) {
//         methods.setValue('true_false_not_givens', aiData.true_false_not_givens)
//       }
//       if (aiData.error_identification_question && aiData.error_identification_answers) {
//         methods.setValue('error_identification_question', aiData.error_identification_question)
//         methods.setValue('error_identification_answers', aiData.error_identification_answers)
//       }
//       if (aiData.sentence_completions) {
//         methods.setValue('sentence_completions', aiData.sentence_completions)
//       }
//       if (aiData.conversational_repetition && aiData.conversational_repetition_qa) {
//         methods.setValue('conversational_repetition', aiData.conversational_repetition)
//         methods.setValue('conversational_repetition_qa', aiData.conversational_repetition_qa)
//       }
//       if (aiData.open_paragraph) {
//         methods.setValue('open_paragraph', aiData.open_paragraph)
//       }
//       if (aiData.open_conversation) {
//         methods.setValue('open_conversation', aiData.open_conversation)
//       }
//     }
//   }, [aiData, methods])

//   const renderTypeForm = () => {
//     if (!selectedType) return null
//     switch (selectedType) {
//       case 'fill_in_the_blank':
//         return <FillInBlankForm />
//       case 'choice_one':
//         return <ChoiceOneForm />
//       case 'choice_multi':
//         return <ChoiceMultiForm />
//       case 'matching':
//         return <MatchingForm />
//       case 'true_false_not_given':
//         return <TrueFalseNotGivenForm />
//       case 'error_identification':
//         return <ErrorIdentificationForm />
//       case 'sentence_completion':
//         return <SentenceCompletionForm />
//       case 'conversational_repetition':
//         return <ConversationalRepetitionForm />
//       case 'open_paragraph':
//         return <OpenParagraphForm />
//       case 'open_conversation':
//         return <OpenConversationForm initialData={aiData?.open_conversation || undefined} />
//       case 'word_repetition':
//         return <WordRepetitionForm lessonId="" sequence={0} onClose={onClose} />
//       case 'phrase_repetition':
//         return <PhraseRepetitionForm lessonId="" sequence={0} onClose={onClose} />
//       default:
//         return null
//     }
//   }

//   const QUESTION_TYPES_BY_SKILL: Record<SkillType, QuestionType[]> = {
//     listening: [
//       'fill_in_the_blank',
//       'choice_one',
//       'choice_multi',
//       'matching',
//       'true_false_not_given'
//     ],
//     reading: [
//       'fill_in_the_blank',
//       'choice_one',
//       'choice_multi',
//       'matching',
//       'true_false_not_given'
//     ],
//     grammar: [
//       'fill_in_the_blank',
//       'choice_one',
//       'choice_multi',
//       'error_identification',
//       'sentence_completion'
//     ],
//     speaking: [
//       'word_repetition',
//       'phrase_repetition',
//       'conversational_repetition',
//       'open_conversation',
//       'open_paragraph'
//     ],
//     writing: ['open_paragraph'],
//     vocabulary: []
//   }

//   if (!open) return null

//   // ========== DESIGN AS EMBEDDED SECTION (not overlay) ==========
//   return (
//     <FormProvider {...methods}>
//       <section className="flex w-full h-[85vh] max-h-[850px] my-8 rounded-xl shadow border border-gray-200 bg-white overflow-hidden">
//         {/* LEFT: FORMS/SETUP */}
//         <div className="w-1/2 h-full p-8 overflow-y-auto border-r border-gray-200 bg-gray-50 relative">
//           {/* Close button on top right */}
//           <button
//             type="button"
//             aria-label="Close"
//             className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-gray-100 transition"
//             onClick={onClose}
//           >
//             <X className="w-6 h-6 text-gray-400" />
//           </button>

//           {/* SKILL SELECT — only show if NOT preselected */}
//           {!selectedSkill && !initialSkill && (
//             <div>
//               <h2 className="text-lg font-semibold mb-2">Chọn kỹ năng</h2>
//               <div className="grid grid-cols-2 gap-4">
//                 {SKILLS.map((skill) => (
//                   <button
//                     key={skill.value}
//                     type="button"
//                     className="p-4 border rounded-lg hover:border-[#52aaa5] bg-white shadow-sm transition"
//                     onClick={() => {
//                       setSelectedSkill(skill.value as SkillType)
//                       methods.setValue('skill', skill.value)
//                       setSelectedType(null)
//                     }}
//                   >
//                     <div className="text-base font-semibold text-[#52aaa5] mb-1">{skill.label}</div>
//                     <div className="text-sm text-[#718096]">{skill.description}</div>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* TYPE SELECT — only show if NOT preselected */}
//           {selectedSkill && !selectedType && !initialType && (
//             <div className="mt-6">
//               <h2 className="text-lg font-semibold mb-2">Chọn dạng câu hỏi</h2>
//               <div className="space-y-2">
//                 {QUESTION_TYPES_BY_SKILL[selectedSkill].map((qType) => (
//                   <button
//                     key={qType}
//                     type="button"
//                     className="w-full p-4 border rounded-lg hover:border-[#52aaa5] bg-white shadow-sm text-left"
//                     onClick={() => {
//                       setSelectedType(qType)
//                       methods.setValue('type', qType)
//                     }}
//                   >
//                     <div className="text-base font-semibold text-[#52aaa5] mb-1">
//                       {QUESTION_TYPES[qType].label}
//                     </div>
//                     <div className="text-sm text-[#718096]">{QUESTION_TYPES[qType].overview}</div>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* MAIN QUESTION FORM AREA */}
//           {selectedSkill && selectedType && (
//             <>
//               <div className="mb-8">
//                 <AIForm
//                   skill={selectedSkill}
//                   type={selectedType}
//                   onResult={setAIData}
//                   transcript={
//                     selectedSkill === 'listening' ? detailData?.data?.transcript || '' : undefined
//                   }
//                   passage={
//                     selectedSkill === 'reading' ? detailData?.data?.passage || '' : undefined
//                   }
//                 />
//               </div>
//               <div>
//                 <BaseQuestionForm skill={selectedSkill} type={selectedType} />
//               </div>
//               {(selectedSkill === 'listening' || selectedSkill === 'reading') && (
//                 <div className="mt-10">
//                   {selectedSkill === 'listening' ? (
//                     <ListeningDetailForm
//                       onChange={(data: ListeningDetailFormData) =>
//                         setDetailData({ data, hasErrors: false })
//                       }
//                     />
//                   ) : (
//                     <ReadingDetailForm
//                       onChange={(data: ReadingDetailFormData) =>
//                         setDetailData({ data, hasErrors: false })
//                       }
//                     />
//                   )}
//                 </div>
//               )}
//             </>
//           )}
//         </div>

//         {/* RIGHT: DETAILS/PREVIEW */}
//         <div className="w-1/2 h-full p-8 overflow-y-auto bg-white">
//           {selectedSkill && selectedType && (
//             <>
//               <div className="mb-6">
//                 <h2 className="text-lg font-semibold text-[#2D3748]">Chi tiết câu hỏi</h2>
//               </div>
//               {renderTypeForm()}
//             </>
//           )}
//         </div>
//       </section>
//     </FormProvider>
//   )
// }

// export default CreateQuestionSection

import { FC } from "react";
import ReactDOM from "react-dom";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import { X } from "lucide-react";
import { QuestionDetail } from "../types/questionDetail";
import { ViewBaseQuestionSection } from "./views/ViewBaseQuestionSection";
import { ViewChoiceOneSection } from "./views/ViewChoiceOneSection";
import { ViewChoiceMultiSection } from "./views/ViewChoiceMultiSection";
import { ViewListeningDetailSection } from "./views/ViewListeningDetailSection";
import { ViewConversationalRepetitionSection } from "./views/ViewConversationalRepetitionSection";
import { ViewErrorIdentificationSection } from "./views/ViewErrorIdentificationSection";
import { ViewFillInBlankSection } from "./views/ViewFillInBlankSection";
import { ViewMatchingSection } from "./views/ViewMatchingSection";
import { ViewOpenConversationSection } from "./views/ViewOpenConversationSection";
import { ViewOpenParagraphSection } from "./views/ViewOpenParagraphSection";
import { ViewReadingDetailSection } from "./views/ViewReadingDetailSection";
import { ViewSentenceCompletionSection } from "./views/ViewSentenceCompletionSection";
import { ViewTrueFalseNotGivenSection } from "./views/ViewTrueFalseNotGivenSection";

interface ViewQuestionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  question: QuestionDetail | null;
}

function renderDetailSection(question: QuestionDetail) {
  const views: JSX.Element[] = [];

  // Listening section (show on any listening-type question)
  if (question.skill === "listening" && question.listening_question_detail) {
    views.push(
      <ViewListeningDetailSection key="listening" question={question} />
    );
  }

  // Reading section (show on any reading-type question)
  // Nếu bạn dùng passage/title, sửa tương ứng ở đây!
  if (question.skill === "reading" && question.reading_question_detail) {
    views.push(<ViewReadingDetailSection key="reading" question={question} />);
  }

  switch (question.type) {
    case "choice_one":
      views.push(<ViewChoiceOneSection key="choice_one" question={question} />);
      break;
    case "choice_multi":
      views.push(
        <ViewChoiceMultiSection key="choice_multi" question={question} />
      );
      break;
    case "fill_in_the_blank":
      views.push(
        <ViewFillInBlankSection key="fillblank" question={question} />
      );
      break;
    case "matching":
      views.push(<ViewMatchingSection key="matching" question={question} />);
      break;
    case "true_false_not_given":
      views.push(
        <ViewTrueFalseNotGivenSection key="tfng" question={question} />
      );
      break;
    case "error_identification":
      views.push(
        <ViewErrorIdentificationSection key="errorid" question={question} />
      );
      break;
    case "sentence_completion":
      views.push(
        <ViewSentenceCompletionSection key="sentencecom" question={question} />
      );
      break;
    case "conversational_repetition":
      views.push(
        <ViewConversationalRepetitionSection
          key="converse"
          question={question}
        />
      );
      break;
    case "open_conversation":
      views.push(
        <ViewOpenConversationSection key="openconvo" question={question} />
      );
      break;
    case "open_paragraph":
      views.push(
        <ViewOpenParagraphSection key="openpara" question={question} />
      );
      break;
    // Không default
  }
  return <>{views}</>;
}

export const ViewQuestionDrawer: FC<ViewQuestionDrawerProps> = ({
  isOpen,
  onClose,
  question,
}) => {
  if (!question) return null;
  return ReactDOM.createPortal(
    <Drawer
      open={isOpen}
      onClose={onClose}
      direction="right"
      size="40vw"
      style={{
        height: "100dvh",
        maxWidth: "40vw",
        background: "#f6f6f0",
        padding: 0,
        border: "none",
      }}
      className="!rounded-none !bg-[#f6f6f0]"
      overlayColor="rgba(0,0,0,0.2)"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#f6f6f0] px-4 py-4 border-b border-[#52aaa5]/10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#2D3748]">
              Chi tiết câu hỏi
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-[#718096] hover:text-[#52aaa5] hover:bg-[#52aaa5]/10 rounded-xl transition-colors"
              aria-label="Đóng"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <ViewBaseQuestionSection question={question} />
          {renderDetailSection(question)}
        </div>
        {/* Footer */}
        <div className="border-t text-xs text-[#718096] font-mono px-6 py-2 bg-[#f6f6f0] select-all">
          ID: {question.id}
        </div>
      </div>
    </Drawer>,
    document.body
  );
};

export default ViewQuestionDrawer;

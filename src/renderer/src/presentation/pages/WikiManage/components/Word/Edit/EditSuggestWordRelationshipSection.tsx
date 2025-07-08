import React from "react";
import { Button } from "../../../../../components/ui/button";
import {
  Plus,
  RefreshCw,
  Trash2,
  Check,
  Settings2,
  Sparkles,
} from "lucide-react";
import { SuggestedRelationship, RelationshipType } from "../../../type/wiki";
import { relationshipTypeLabels } from "./EditWordRelationshipSection";
import { GeminiSetting } from "../../../../../components/form/GeminiSettingForm";

interface Props {
  suggestedRelationships: SuggestedRelationship[];
  selectedRelationships: Set<number>;
  handleToggleRelationship: (index: number) => void;
  handleRemoveSuggested: (index: number) => void;
  handleCheckRelationship: (
    text: string,
    type: "word" | "phrase",
    index: number
  ) => void;
  setCreateText: React.Dispatch<React.SetStateAction<string>>;
  setShowCreatePhraseDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCreateWordDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  onAddSelectedRelationships: () => Promise<void> | void;
  onReloadSuggestions: () => void;
  showGeminiSettings: boolean;
  setShowGeminiSettings: React.Dispatch<React.SetStateAction<boolean>>;
  onQuickCreateWord: (text: string, callback?: () => void) => Promise<void>;
  onQuickCreatePhrase: (text: string, callback?: () => void) => Promise<void>;
  isQuickCreatingWord: boolean;
  isQuickCreatingPhrase: boolean;
  isLoading: boolean;
}

export function EditSuggestWordRelationshipSection({
  suggestedRelationships,
  selectedRelationships,
  handleToggleRelationship,
  handleRemoveSuggested,
  handleCheckRelationship,
  setCreateText,
  setShowCreatePhraseDrawer,
  setShowCreateWordDrawer,
  onAddSelectedRelationships,
  onReloadSuggestions,
  showGeminiSettings,
  setShowGeminiSettings,
  onQuickCreateWord,
  onQuickCreatePhrase,
  isQuickCreatingWord,
  isQuickCreatingPhrase,
  isLoading,
}: Props) {
  // Giữ nhiều index "hold" cùng lúc cho nút RefreshCw
  const [holdingRefreshIndexes, setHoldingRefreshIndexes] = React.useState<
    Set<number>
  >(new Set());

  // Loading state cho nút "Thêm"
  const [isAddingRelationships, setIsAddingRelationships] =
    React.useState(false);

  // Thêm index vào set hold
  const holdRefresh = (idx: number) =>
    setHoldingRefreshIndexes((prev) => new Set(prev).add(idx));
  // Gỡ index khỏi set hold
  const unholdRefresh = (idx: number) =>
    setHoldingRefreshIndexes((prev) => {
      const next = new Set(prev);
      next.delete(idx);
      return next;
    });

  return (
    <div>
      {/* HEADER + BUTTON GROUP */}
      <div className="flex items-center justify-between mb-3 pl-1">
        <h4 className="text-base font-medium text-gray-600">Đề xuất</h4>
        <div className="flex gap-2">
          <Button
            onClick={onReloadSuggestions}
            variant="ghost"
            size="sm"
            disabled={isLoading}
            className={`flex items-center gap-1 text-primary border-primary hover:bg-primary/15 hover:text-primary/90 active:scale-95 active:bg-primary/30 active:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-opacity-60 font-semibold border transition-all duration-150 group`}
            aria-label="Tải lại gợi ý"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>{isLoading ? "Đang tải..." : "Tải gợi ý"}</span>
          </Button>
          <Button
            onClick={() => setShowGeminiSettings((show) => !show)}
            variant="ghost"
            size="sm"
            className={`flex items-center gap-1 text-[#319c93] border-[#319c93]/50 hover:bg-[#e6f6f5] hover:text-[#27635b] active:scale-95 active:bg-[#d3ede7] active:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#319c93] focus-visible:ring-opacity-60 font-semibold border transition-all duration-150`}
            aria-label="Cài đặt Gemini"
          >
            <Settings2 className="h-4 w-4" />
            <span>Cài đặt Gemini</span>
          </Button>
          {selectedRelationships.size > 0 && (
            <Button
              onClick={async () => {
                setIsAddingRelationships(true);
                try {
                  await onAddSelectedRelationships();
                } finally {
                  setIsAddingRelationships(false);
                }
              }}
              variant="default"
              size="sm"
              disabled={isAddingRelationships}
              className={
                `flex items-center gap-1.5 bg-[#52aaa5] hover:bg-[#319c93] text-white rounded-lg font-semibold px-3 py-1.5 text-base min-h-[38px] border border-[#319c93]/70 
                active:scale-95 active:opacity-80 focus-visible:ring-2 focus-visible:ring-[#319c93] transition-all duration-150` +
                (isAddingRelationships ? " opacity-70 pointer-events-none" : "")
              }
              aria-label={`Thêm ${selectedRelationships.size} mối quan hệ đã chọn`}
            >
              {isAddingRelationships ? (
                <span className="animate-spin mr-2">
                  <RefreshCw className="h-4 w-4" />
                </span>
              ) : (
                <Check className="h-4 w-4" />
              )}
              {isAddingRelationships ? (
                "Đang thêm..."
              ) : (
                <>Thêm {selectedRelationships.size}</>
              )}
            </Button>
          )}
        </div>
      </div>
      {/* Gemini Setting Popup */}
      {showGeminiSettings && (
        <div className="mb-4">
          <GeminiSetting
            onSettingsSaved={() => setShowGeminiSettings(false)}
            onCancel={() => setShowGeminiSettings(false)}
          />
        </div>
      )}
      {/* SUGGESTED RELATIONSHIPS LIST */}
      <div className="space-y-2">
        {suggestedRelationships.length === 0 && (
          <div className="text-gray-400 px-2 italic text-base">
            Chưa có gợi ý nào.
          </div>
        )}
        {suggestedRelationships.map((relationship, index) => (
          <div
            key={`${relationship.text}-${relationship.relationship_type}`}
            className={`
              relative flex flex-row items-center p-3 rounded-lg border gap-2 transition-all group
              ${
                relationship.exists
                  ? "border-primary/10 bg-primary/5"
                  : "border-red-200 bg-red-50"
              }
              hover:border-[#319c93] active:scale-[0.99] active:border-[#319c93] active:bg-[#d3ede7] cursor-pointer
            `}
          >
            <div className="flex gap-3 items-start w-full">
              {relationship.exists && (
                <input
                  type="checkbox"
                  checked={selectedRelationships.has(index)}
                  onChange={() => handleToggleRelationship(index)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-primary accent-primary focus:ring-primary"
                  aria-label={`Chọn mối quan hệ: ${relationship.text}`}
                />
              )}
              <div className="w-full">
                <div className="font-semibold text-gray-900 flex flex-wrap items-center gap-2 text-[15px]">
                  {relationship.text}
                  {relationship.mean_vietnamese && (
                    <span className="text-[14px] text-gray-500 italic">
                      ({relationship.mean_vietnamese})
                    </span>
                  )}
                  <p className="text-xs">
                    {relationship.relationship_type in relationshipTypeLabels
                      ? relationshipTypeLabels[
                          relationship.relationship_type as RelationshipType
                        ].label
                      : relationship.relationship_type}
                  </p>
                </div>
                {relationship.explanation && (
                  <div className="text-[14px] text-gray-500 mt-1 border-primary/20 mr-2">
                    {relationship.explanation}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col justify-center items-center ml-3 gap-0 h-full">
              {!relationship.exists && (
                <>
                  {relationship.related_type === "word" && (
                    <Button
                      onClick={async () => {
                        await onQuickCreateWord(relationship.text, () =>
                          handleCheckRelationship(
                            relationship.text,
                            relationship.related_type,
                            index
                          )
                        );
                      }}
                      variant="ghost"
                      size="icon"
                      className="rounded transition-all duration-150 text-[#eb8801] hover:bg-yellow-100 hover:text-yellow-600 active:scale-90 active:bg-yellow-200 p-1"
                      aria-label={`Tạo nhanh từ: ${relationship.text}`}
                      type="button"
                      disabled={isQuickCreatingWord}
                    >
                      {isQuickCreatingWord ? (
                        <Sparkles className="h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                  {relationship.related_type === "phrase" && (
                    <Button
                      onClick={async () => {
                        await onQuickCreatePhrase(relationship.text, () =>
                          handleCheckRelationship(
                            relationship.text,
                            relationship.related_type,
                            index
                          )
                        );
                      }}
                      variant="ghost"
                      size="icon"
                      className="rounded transition-all duration-150 text-[#eb8801] hover:bg-yellow-100 hover:text-yellow-600 active:scale-90 active:bg-yellow-200 p-1"
                      aria-label={`Tạo nhanh cụm từ: ${relationship.text}`}
                      type="button"
                      disabled={isQuickCreatingPhrase}
                    >
                      {isQuickCreatingPhrase ? (
                        <Sparkles className="h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                  {/* NÚT PLUS: khi bấm, giữ hiệu ứng trên RefreshCw của suggestion này */}
                  <Button
                    onClick={() => {
                      setCreateText(relationship.text);
                      holdRefresh(index);
                      if (relationship.related_type === "phrase") {
                        setShowCreatePhraseDrawer(true);
                      } else {
                        setShowCreateWordDrawer(true);
                      }
                    }}
                    variant="ghost"
                    size="icon"
                    className="rounded transition-all duration-150 text-[#319c93] hover:bg-[#e6f6f5] hover:text-[#27635b] active:scale-90 active:bg-[#d3ede7] p-1"
                    aria-label={`Tạo mới ${relationship.text}`}
                    type="button"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  {/* NÚT REFRESHCW: hiệu ứng hold nếu trùng index */}
                  <Button
                    onClick={() => {
                      handleCheckRelationship(
                        relationship.text,
                        relationship.related_type,
                        index
                      );
                      unholdRefresh(index); // tắt hiệu ứng khi click
                    }}
                    variant="ghost"
                    size="icon"
                    className={`rounded transition-all duration-150 text-red-500
                      hover:bg-red-100 hover:text-red-600 active:scale-90 active:bg-red-200 p-1
                      ${
                        holdingRefreshIndexes.has(index)
                          ? "bg-[#e6f6f5] ring-2 ring-[#52aaa5]/70 ring-offset-2 shadow-lg shadow-[#319c93]/10 border-2 border-[#52aaa5] animate-pulse"
                          : ""
                      }
                    `}
                    aria-label={`Kiểm tra ${relationship.text}`}
                    type="button"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => handleRemoveSuggested(index)}
                    variant="ghost"
                    size="icon"
                    className="rounded transition-all duration-150 text-red-700 hover:bg-red-200 active:scale-90 active:bg-red-300 p-1"
                    aria-label={`Xóa suggestion: ${relationship.text}`}
                    type="button"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EditSuggestWordRelationshipSection;

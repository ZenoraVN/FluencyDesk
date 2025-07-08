import { useState } from "react";
import apiService from "../../../../../../service/ApiService";
import { GeminiPhraseRelationship } from "../../../services/GeminiPhraseRelationship";
import {
  Relationship,
  SuggestedRelationship,
  RelationshipType,
} from "../../../type/wiki";
import { EditExistingPhraseRelationshipSection } from "./EditExistingPhraseRelationshipSection";
import { EditSuggestPhraseRelationshipSection } from "./EditSuggestPhraseRelationshipSection";

export const relationshipTypeLabels: Record<
  RelationshipType,
  { label: string; color: string }
> = {
  word_synonym: {
    label: "Từ đồng nghĩa",
    color: "bg-green-50 text-green-700 border-green-200",
  },
  word_antonym: {
    label: "Từ trái nghĩa",
    color: "bg-orange-50 text-orange-700 border-orange-200",
  },
  synonym: {
    label: "Cụm từ đồng nghĩa",
    color: "bg-gray-50 text-gray-700 border-gray-200",
  },
  antonym: {
    label: "Cụm từ trái nghĩa",
    color: "bg-gray-50 text-gray-700 border-gray-200",
  },
  inflection: {
    label: "Dạng biến thể",
    color: "bg-green-100 text-green-700 border-green-200",
  },
  rhyme: {
    label: "Vần",
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
  hypernym: {
    label: "Từ bao quát",
    color: "bg-orange-100 text-orange-700 border-orange-200",
  },
  collocation: {
    label: "Cụm từ thường gặp",
    color: "bg-pink-100 text-pink-700 border-pink-200",
  },
};

interface PhraseData {
  id: string;
  phrase: string;
  relationships: Relationship[];
}
interface PhraseRelationshipSectionProps {
  data: PhraseData;
  existingRelationships: Relationship[];
  setExistingRelationships: React.Dispatch<
    React.SetStateAction<Relationship[]>
  >;
  suggestedRelationships: SuggestedRelationship[];
  setSuggestedRelationships: React.Dispatch<
    React.SetStateAction<SuggestedRelationship[]>
  >;
  selectedRelationships: Set<number>;
  setSelectedRelationships: React.Dispatch<React.SetStateAction<Set<number>>>;
  setShowCreatePhraseDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCreateWordDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  setShowGeminiSettings?: React.Dispatch<React.SetStateAction<boolean>>;
  setCreateText: React.Dispatch<React.SetStateAction<string>>;
  handleQuickCreateWord: (text: string, callback?: () => void) => Promise<void>;
  handleQuickCreatePhrase: (
    text: string,
    callback?: () => void
  ) => Promise<void>;
  isQuickCreatingWord: boolean;
  isQuickCreatingPhrase: boolean;
}

export function EditPhraseRelationshipSection({
  data,
  existingRelationships,
  setExistingRelationships,
  suggestedRelationships,
  setSuggestedRelationships,
  selectedRelationships,
  setSelectedRelationships,
  setShowCreatePhraseDrawer,
  setShowCreateWordDrawer,
  setCreateText,
  handleQuickCreateWord,
  handleQuickCreatePhrase,
  isQuickCreatingWord,
  isQuickCreatingPhrase,
}: PhraseRelationshipSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showGeminiSettings, setShowGeminiSettings] = useState(false);

  const handleCheckRelationship = async (
    text: string,
    type: "word" | "phrase",
    index: number
  ) => {
    try {
      const endpoint =
        type === "phrase" ? "/wiki/phrase/find" : "/wiki/words/find";
      const response = await apiService.get<any>(
        `${endpoint}?phrase=${encodeURIComponent(text)}`
      );
      const exists =
        response.code === 200 &&
        response.data &&
        response.data.id !== undefined;
      setSuggestedRelationships((prev) => {
        const newRelationships = [...prev];
        if (newRelationships[index]) {
          newRelationships[index] = { ...newRelationships[index], exists };
        }
        return newRelationships;
      });
      return exists;
    } catch (error) {
      setSuggestedRelationships((prev) => {
        const newRelationships = [...prev];
        if (newRelationships[index]) {
          newRelationships[index] = {
            ...newRelationships[index],
            exists: false,
          };
        }
        return newRelationships;
      });
      return false;
    }
  };

  const handleCreateBulkRelationships = async () => {
    if (!data?.id) return;
    try {
      const selectedItems = Array.from(selectedRelationships).map(
        (index) => suggestedRelationships[index]
      );
      if (!selectedItems.length) return;
      const reqBody = {
        relationships: selectedItems.map((item) => ({
          text: item.text,
          related_type: item.related_type,
          relationship_type: item.relationship_type,
        })),
      };
      await apiService.post(
        `/wiki/phrase/relationships/bulk/${data.id}`,
        reqBody
      );
      const response = await apiService.get<{
        code: number;
        message: string;
        data: PhraseData;
      }>(`/wiki/phrase/${data.id}`);
      if (response?.data?.relationships) {
        setExistingRelationships(response.data.relationships);
        setSuggestedRelationships((prev) =>
          prev.filter((_, index) => !selectedRelationships.has(index))
        );
        setSelectedRelationships(new Set());
      }
    } catch (error) {}
  };

  const handleToggleRelationship = (index: number) => {
    const newSelected = new Set(selectedRelationships);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRelationships(newSelected);
  };

  const handleRemoveSuggested = (index: number) => {
    setSuggestedRelationships((prev) => prev.filter((_, i) => i !== index));
    setSelectedRelationships((prev) => {
      const next = new Set(prev);
      next.delete(index);
      // Cập nhật lại chỉ số các phần tử phía sau
      return new Set(Array.from(next).map((i) => (i > index ? i - 1 : i)));
    });
  };

  const handleRemoveRelationship = async (relationshipId: string) => {
    try {
      await apiService.delete(`/wiki/phrase/relationships/${relationshipId}`);
      setExistingRelationships((prev) =>
        prev.filter((r) => r.id !== relationshipId)
      );
    } catch (error) {}
  };

  const loadSuggestions = async () => {
    if (!data) return;
    setIsLoading(true);
    try {
      const suggestions = await GeminiPhraseRelationship.suggestRelationships(
        data.id,
        data.phrase,
        existingRelationships
      );
      const enrichedSuggestions = await Promise.all(
        suggestions.map(async (suggestion, index) => {
          const exists = await handleCheckRelationship(
            suggestion.text,
            suggestion.related_type,
            index
          );
          return {
            ...suggestion,
            exists,
          };
        })
      );
      setSuggestedRelationships(enrichedSuggestions);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="space-y-4 text-[16px]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-800">
            Mối quan hệ từ vựng
          </h3>
        </div>
      </div>
      {/* Existing Relationships */}
      <EditExistingPhraseRelationshipSection
        existingRelationships={existingRelationships}
        handleRemoveRelationship={handleRemoveRelationship}
      />
      {/* Suggested Relationships */}
      <EditSuggestPhraseRelationshipSection
        isLoading={isLoading}
        suggestedRelationships={suggestedRelationships}
        handleToggleRelationship={handleToggleRelationship}
        selectedRelationships={selectedRelationships}
        handleRemoveSuggested={handleRemoveSuggested}
        handleCheckRelationship={handleCheckRelationship}
        setCreateText={setCreateText}
        setShowCreatePhraseDrawer={setShowCreatePhraseDrawer}
        setShowCreateWordDrawer={setShowCreateWordDrawer}
        onAddSelectedRelationships={handleCreateBulkRelationships}
        onReloadSuggestions={loadSuggestions}
        showGeminiSettings={showGeminiSettings}
        setShowGeminiSettings={setShowGeminiSettings}
        onQuickCreateWord={handleQuickCreateWord}
        onQuickCreatePhrase={handleQuickCreatePhrase}
        isQuickCreatingWord={isQuickCreatingWord}
        isQuickCreatingPhrase={isQuickCreatingPhrase}
      />
    </section>
  );
}

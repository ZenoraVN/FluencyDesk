import { useState, useEffect } from "react";
import { Sheet, SheetContent } from "../../../../../components/ui/sheet";
import ApiService from "../../../../../../service/ApiService";
import { GeminiService } from "../../../../../../service/GeminiService";
import { CreateWordDrawer } from "../../Word/Create/CreateWordDrawer";
import { CreatePhraseDrawer } from "../Create/CreatePhraseDrawer";
import { EditPhraseBaseSection } from "./EditPhraseBaseSection";
import { EditPhraseRelationshipSection } from "./EditPhraseRelationshipSection";
import { EditDefinitionSection } from "../../common/EditDefinitionSection";
import { EditPhrasePartOfSpeechSection } from "./EditPhrasePartOfSpeechSection";
import { EditUsageNoteSection } from "../../common/EditUsageNoteSection";
import { EditImageSection } from "../../common/EditImageSection";
import {
  Relationship,
  SuggestedRelationship,
  Definition,
} from "../../../type/wiki";

interface PhraseData {
  id: string;
  phrase: string;
  pronunciation: string;
  frequency: string;
  image_urls: string[];
  usage_notes: string[];
  language_level: string;
  created_at: string;
  updated_at: string;
  definitions: Definition[];
  relationships: Relationship[];
}

type EditingField =
  | "phrase"
  | "pronunciation"
  | "frequency"
  | "language_level"
  | "images"
  | null;

type ApiStatus = "idle" | "success" | "error" | "modified";
type StatusField = Exclude<EditingField, null>;

interface FieldStatuses {
  phrase: ApiStatus;
  pronunciation: ApiStatus;
  frequency: ApiStatus;
  language_level: ApiStatus;
  images: ApiStatus;
}

interface EditPhraseDrawerProps {
  open: boolean;
  onClose: () => void;
  data?: PhraseData;
  onRefresh?: () => void;
  handleQuickCreateWord: (text: string, callback?: () => void) => Promise<void>;
  handleQuickCreatePhrase: (
    text: string,
    callback?: () => void
  ) => Promise<void>;
  isQuickCreatingWord: boolean;
  isQuickCreatingPhrase: boolean;
}

export function EditPhraseDrawer({
  open,
  onClose,
  data,
  onRefresh,
  handleQuickCreateWord,
  handleQuickCreatePhrase,
  isQuickCreatingWord,
  isQuickCreatingPhrase,
}: EditPhraseDrawerProps) {
  // State
  const [, setEditingField] = useState<EditingField>(null);
  const [phraseValue, setPhraseValue] = useState("");
  const [pronunciationValue, setPronunciationValue] = useState("");
  const [frequencyValue, setFrequencyValue] = useState("");
  const [languageLevelValue, setLanguageLevelValue] = useState("");
  const [fieldStatuses, setFieldStatuses] = useState<FieldStatuses>({
    phrase: "idle",
    pronunciation: "idle",
    frequency: "idle",
    language_level: "idle",
    images: "idle",
  });

  // Images
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageFilePreviews, setImageFilePreviews] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageSaveLoading, setImageSaveLoading] = useState(false);
  const [deletedImageIndexes, setDeletedImageIndexes] = useState<Set<number>>(
    new Set()
  );
  const [keptImageUrls, setKeptImageUrls] = useState<string[]>([]);

  // Usage notes
  const [usageNoteInput, setUsageNoteInput] = useState("");
  const [usageNotes, setUsageNotes] = useState<string[]>([]);

  // Definitions
  const [definitions, setDefinitions] = useState<Definition[]>([]);
  const [newDefinition, setNewDefinition] = useState({
    parts_of_speech: "",
    definition: "",
    examples: [{ example_sentence: "", mean_example_sentence: "" }],
  });

  // Relationships
  const [showCreateWordDrawer, setShowCreateWordDrawer] = useState(false);
  const [showCreatePhraseDrawer, setShowCreatePhraseDrawer] = useState(false);
  const [, setShowGeminiSettings] = useState(false);
  const [, setHasCheckedGeminiApi] = useState(false);
  const [createText, setCreateText] = useState("");
  const [suggestedRelationships, setSuggestedRelationships] = useState<
    SuggestedRelationship[]
  >([]);
  const [selectedRelationships, setSelectedRelationships] = useState<
    Set<number>
  >(new Set());
  const [existingRelationships, setExistingRelationships] = useState<
    Relationship[]
  >([]);

  // Sync state with data (giống hệt như EditWordDrawer)
  useEffect(() => {
    if (data) {
      setPhraseValue(data.phrase ?? "");
      setPronunciationValue(data.pronunciation ?? "");
      setFrequencyValue(data.frequency ?? "");
      setLanguageLevelValue(data.language_level ?? "");
      setKeptImageUrls(data.image_urls ?? []);
      setImageFiles([]);
      setImageFilePreviews([]);
      setUsageNoteInput("");
      setUsageNotes(data.usage_notes ?? []);
      setDefinitions(data.definitions ?? []);
      setExistingRelationships(data.relationships ?? []);
      setFieldStatuses({
        phrase: "idle",
        pronunciation: "idle",
        frequency: "idle",
        language_level: "idle",
        images: "idle",
      });
      setSelectedRelationships(new Set());
      setSuggestedRelationships([]);
      setImageError(null);
      setDeletedImageIndexes(new Set());
      setShowCreateWordDrawer(false);
      setShowCreatePhraseDrawer(false);
      setCreateText("");
    }
  }, [data]);
  useEffect(() => {
    // Cleanup preview URLs
    return () => {
      imageFilePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageFilePreviews]);
  useEffect(() => {
    const checkGeminiApi = async () => {
      try {
        const settings = await GeminiService.getSettings();
        if (!settings) setShowGeminiSettings(true);
        setHasCheckedGeminiApi(true);
      } catch (error) {
        setShowGeminiSettings(true);
      }
    };
    checkGeminiApi();
  }, []);

  // Image handlers
  const handleCancelImages = () => {
    imageFilePreviews.forEach((url) => URL.revokeObjectURL(url));
    setKeptImageUrls(data?.image_urls || []);
    setImageFiles([]);
    setImageFilePreviews([]);
    setImageError(null);
    setDeletedImageIndexes(new Set());
    setFieldStatuses((prev) => ({ ...prev, images: "idle" }));
  };

  const handleSaveImages = async () => {
    if (!data?.id) return;
    setImageSaveLoading(true);
    const allUrls = keptImageUrls;
    const allFiles = imageFiles;
    const total = allUrls.length + allFiles.length;
    const keepIdx = Array.from({ length: total }, (_, i) => i).filter(
      (i) => !deletedImageIndexes.has(i)
    );
    const keptUrlsFiltered = keepIdx
      .filter((i) => i < allUrls.length)
      .map((i) => allUrls[i]);
    const imageFilesFiltered = keepIdx
      .filter((i) => i >= allUrls.length)
      .map((i) => allFiles[i - allUrls.length]);
    try {
      const formData = new FormData();
      formData.append("field", "image_urls");
      formData.append("value", JSON.stringify(keptUrlsFiltered));
      imageFilesFiltered.forEach((file) => formData.append("images", file));
      await ApiService.put(`/wiki/phrase/${data.id}`, formData, true, true);
      setFieldStatuses((prev) => ({ ...prev, images: "success" }));
      setImageFiles([]);
      imageFilePreviews.forEach((url) => URL.revokeObjectURL(url));
      setImageFilePreviews([]);
      setDeletedImageIndexes(new Set());
      if (onRefresh) await onRefresh();
    } catch {
      setFieldStatuses((prev) => ({ ...prev, images: "error" }));
    } finally {
      setImageSaveLoading(false);
    }
  };

  // Usage note handler
  const handleSaveUsageNotes = async (notes: string[]) => {
    if (!data?.id) return;
    await ApiService.put(`/wiki/phrase/${data.id}`, {
      field: "usage_notes",
      value: JSON.stringify(notes),
    });
  };

  // FIELD CHANGE/SAVE/CANCEL Handlers
  const handleFieldChange = async (field: EditingField, value: string) => {
    if (!field) return;
    const statusField = field as StatusField;
    switch (field) {
      case "phrase":
        setPhraseValue(value);
        setFieldStatuses((prev) => ({ ...prev, [statusField]: "modified" }));
        break;
      case "pronunciation":
        setPronunciationValue(value);
        setFieldStatuses((prev) => ({ ...prev, [statusField]: "modified" }));
        break;
      case "frequency":
        setFrequencyValue(value);
        setFieldStatuses((prev) => ({ ...prev, frequency: "modified" }));
        break;
      case "language_level":
        setLanguageLevelValue(value);
        setFieldStatuses((prev) => ({ ...prev, language_level: "modified" }));
        break;
    }
  };

  const handleSave = async (field: EditingField, valueToSave?: string) => {
    if (!field || !data) return;
    const statusField = field as StatusField;
    try {
      const value =
        valueToSave ??
        (() => {
          switch (field) {
            case "phrase":
              return phraseValue;
            case "pronunciation":
              return pronunciationValue;
            case "frequency":
              return frequencyValue;
            case "language_level":
              return languageLevelValue;
            default:
              return "";
          }
        })();
      await ApiService.put(`/wiki/phrase/${data.id}`, { field, value });
      setFieldStatuses((prev) => ({ ...prev, [statusField]: "success" }));
      setEditingField(null);
    } catch {
      setFieldStatuses((prev) => ({ ...prev, [statusField]: "error" }));
    }
  };

  const handleCancel = (field: EditingField) => {
    if (!field || !data) return;
    const statusField = field as StatusField;
    switch (field) {
      case "phrase":
        setPhraseValue(data.phrase ?? "");
        break;
      case "pronunciation":
        setPronunciationValue(data.pronunciation ?? "");
        break;
      case "frequency":
        setFrequencyValue(data.frequency ?? "");
        break;
      case "language_level":
        setLanguageLevelValue(data.language_level ?? "");
        break;
    }
    setFieldStatuses((prev) => ({ ...prev, [statusField]: "idle" }));
    setEditingField(null);
  };

  // ------------- DEF/EXAMPLE HANDLERS -------------
  const handleAddDefinition = async () => {
    if (!data?.id) return;
    try {
      const response = await ApiService.post<{
        code: number;
        message: string;
        data: Definition;
      }>(`/wiki/phrase/${data.id}/definitions`, {
        parts_of_speech: newDefinition.parts_of_speech,
        definition: newDefinition.definition,
        is_main_definition: false,
        examples: newDefinition.examples,
      });
      if (response?.data) setDefinitions([...definitions, response.data]);
      setNewDefinition({
        parts_of_speech: "",
        definition: "",
        examples: [{ example_sentence: "", mean_example_sentence: "" }],
      });
    } catch {}
  };

  const handleSetMainDefinition = async (definitionId: string) => {
    try {
      await ApiService.put(`/wiki/phrase/definitions/${definitionId}`, {
        field: "is_main_definition",
        value: "true",
      });
      setDefinitions((definitions) =>
        definitions.map((def) => ({
          ...def,
          is_main_definition: def.id === definitionId,
        }))
      );
      if (onRefresh) await onRefresh();
    } catch (error) {}
  };

  const handleUpdateDefinition = async (
    definitionId: string,
    field: string,
    value: string
  ) => {
    try {
      if (!data?.id) return;
      await ApiService.put(
        `/wiki/phrase/${data.id}/definitions/${definitionId}`,
        {
          field,
          value,
        }
      );
      setDefinitions(
        definitions.map((def) =>
          def.id === definitionId ? { ...def, [field]: value } : def
        )
      );
    } catch {}
  };

  const handleRemoveDefinition = async (definitionId: string) => {
    try {
      await ApiService.delete(`/wiki/phrase/definitions/${definitionId}`);
      setDefinitions(definitions.filter((def) => def.id !== definitionId));
    } catch {}
  };

  const handleAddExample = async (
    phraseId: string,
    definitionId: string,
    example: { example_sentence: string; mean_example_sentence: string }
  ) => {
    await ApiService.post(
      `/wiki/phrase/${phraseId}/definitions/${definitionId}/examples`,
      example
    );
    if (onRefresh) await onRefresh();
  };

  const handleRemoveExample = async (
    definitionId: string,
    exampleId: string
  ) => {
    try {
      await ApiService.delete(`/wiki/phrase/definitions/examples/${exampleId}`);
      setDefinitions(
        definitions.map((def) =>
          def.id === definitionId
            ? {
                ...def,
                examples: def.examples.filter((ex) => ex.id !== exampleId),
              }
            : def
        )
      );
    } catch {}
  };

  if (!data) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-[40vw] overflow-y-auto bg-[#f6f6f0]"
      >
        <CreateWordDrawer
          open={showCreateWordDrawer}
          onClose={() => setShowCreateWordDrawer(false)}
          defaultWord={createText}
        />
        <CreatePhraseDrawer
          open={showCreatePhraseDrawer}
          onClose={() => setShowCreatePhraseDrawer(false)}
          defaultPhrase={createText}
        />

        <div className="space-y-6">
          <EditPhraseBaseSection
            phrase={phraseValue}
            pronunciation={pronunciationValue}
            frequency={frequencyValue}
            languageLevel={languageLevelValue}
            fieldStatuses={fieldStatuses}
            onChange={handleFieldChange}
            onSave={handleSave}
            onCancel={handleCancel}
          />
          <EditImageSection
            keptImageUrls={keptImageUrls}
            setKeptImageUrls={setKeptImageUrls}
            imageFiles={imageFiles}
            setImageFiles={setImageFiles}
            imageFilePreviews={imageFilePreviews}
            setImageFilePreviews={setImageFilePreviews}
            deletedImageIndexes={deletedImageIndexes}
            setDeletedImageIndexes={setDeletedImageIndexes}
            fieldStatus={fieldStatuses.images}
            setFieldStatus={(val) =>
              setFieldStatuses((prev) => ({ ...prev, images: val }))
            }
            imageError={imageError}
            setImageError={setImageError}
            imageSaveLoading={imageSaveLoading}
            handleSaveImages={handleSaveImages}
            handleCancelImages={handleCancelImages}
            originalImageUrlsLength={data?.image_urls?.length || 0}
          />
          <EditPhraseRelationshipSection
            data={data}
            existingRelationships={existingRelationships}
            setExistingRelationships={setExistingRelationships}
            suggestedRelationships={suggestedRelationships}
            setSuggestedRelationships={setSuggestedRelationships}
            selectedRelationships={selectedRelationships}
            setSelectedRelationships={setSelectedRelationships}
            setShowGeminiSettings={setShowGeminiSettings}
            setShowCreatePhraseDrawer={setShowCreatePhraseDrawer}
            setShowCreateWordDrawer={setShowCreateWordDrawer}
            setCreateText={setCreateText}
            handleQuickCreateWord={handleQuickCreateWord}
            handleQuickCreatePhrase={handleQuickCreatePhrase}
            isQuickCreatingWord={isQuickCreatingWord}
            isQuickCreatingPhrase={isQuickCreatingPhrase}
          />
          <EditUsageNoteSection
            usageNoteInput={usageNoteInput}
            setUsageNoteInput={setUsageNoteInput}
            usageNotes={usageNotes}
            setUsageNotes={setUsageNotes}
            onSaveNotes={handleSaveUsageNotes}
          />
          <EditDefinitionSection
            wordId={data.id}
            definitions={definitions}
            newDefinition={newDefinition}
            setNewDefinition={setNewDefinition}
            onAddDefinition={handleAddDefinition}
            onUpdateDefinition={handleUpdateDefinition}
            onRemoveDefinition={handleRemoveDefinition}
            onAddExample={handleAddExample}
            onRemoveExample={handleRemoveExample}
            onSetMainDefinition={handleSetMainDefinition}
            PartOfSpeechSection={EditPhrasePartOfSpeechSection}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

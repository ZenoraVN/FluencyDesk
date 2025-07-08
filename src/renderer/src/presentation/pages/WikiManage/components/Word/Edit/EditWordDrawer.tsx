import { useState, useEffect } from "react";
import { Sheet, SheetContent } from "../../../../../components/ui/sheet";
import ApiService from "../../../../../../service/ApiService";
import { GeminiService } from "../../../../../../service/GeminiService";
import { CreateWordDrawer } from "../Create/CreateWordDrawer";
import { CreatePhraseDrawer } from "../../Phrase/Create/CreatePhraseDrawer";
import { EditWordBaseSection } from "./EditWordBaseSection";
import { EditWordRelationshipSection } from "./EditWordRelationshipSection";
import { EditDefinitionSection } from "../../common/EditDefinitionSection";
import { EditWordPartOfSpeechSection } from "./EditWordPartOfSpeechSection";
import { EditUsageNoteSection } from "../../common/EditUsageNoteSection";
import { EditImageSection } from "../../common/EditImageSection";

import {
  WordData,
  Relationship,
  SuggestedRelationship,
  Definition,
} from "../../../type/wiki";

type EditingField =
  | "word"
  | "pronunciation"
  | "frequency"
  | "language_level"
  | "images"
  | null;
type ApiStatus = "idle" | "success" | "error" | "modified";
type StatusField = Exclude<EditingField, null>;
interface FieldStatuses {
  word: ApiStatus;
  pronunciation: ApiStatus;
  frequency: ApiStatus;
  language_level: ApiStatus;
  images: ApiStatus;
}
interface EditWordDrawerProps {
  open: boolean;
  onClose: () => void;
  data?: WordData;
  onRefresh?: () => void;
  handleQuickCreateWord: (text: string, callback?: () => void) => Promise<void>;
  handleQuickCreatePhrase: (
    text: string,
    callback?: () => void
  ) => Promise<void>;
  isQuickCreatingWord: boolean;
  isQuickCreatingPhrase: boolean;
  onPreviewImages?: (
    images: { src: string; name?: string; size?: string; type?: string }[],
    index: number
  ) => void;
}

export function EditWordDrawer({
  open,
  onClose,
  data,
  onRefresh,
  handleQuickCreateWord,
  handleQuickCreatePhrase,
  isQuickCreatingWord,
  isQuickCreatingPhrase,
  onPreviewImages,
}: EditWordDrawerProps) {
  const [showCreateWordDrawer, setShowCreateWordDrawer] = useState(false);
  const [showCreatePhraseDrawer, setShowCreatePhraseDrawer] = useState(false);
  const [, setShowGeminiSettings] = useState(false);
  const [, setHasCheckedGeminiApi] = useState(false);
  const [createText, setCreateText] = useState("");
  const [, setEditingField] = useState<EditingField>(null);
  const [wordValue, setWordValue] = useState("");
  const [pronunciationValue, setPronunciationValue] = useState("");
  const [frequencyValue, setFrequencyValue] = useState("");
  const [languageLevelValue, setLanguageLevelValue] = useState("");
  const [fieldStatuses, setFieldStatuses] = useState<FieldStatuses>({
    word: "idle",
    pronunciation: "idle",
    frequency: "idle",
    language_level: "idle",
    images: "idle",
  });

  // IMAGE STATES
  const [keptImageUrls, setKeptImageUrls] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageFilePreviews, setImageFilePreviews] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageSaveLoading, setImageSaveLoading] = useState(false);
  const [deletedImageIndexes, setDeletedImageIndexes] = useState<Set<number>>(
    new Set()
  );

  // USAGE NOTES/DEF/ETC
  const [usageNoteInput, setUsageNoteInput] = useState("");
  const [usageNotes, setUsageNotes] = useState<string[]>([]);
  const [definitions, setDefinitions] = useState<Definition[]>([]);
  const [newDefinition, setNewDefinition] = useState({
    parts_of_speech: "",
    definition: "",
    examples: [{ example_sentence: "", mean_example_sentence: "" }],
  });

  // Relationship
  const [suggestedRelationships, setSuggestedRelationships] = useState<
    SuggestedRelationship[]
  >([]);
  const [selectedRelationships, setSelectedRelationships] = useState<
    Set<number>
  >(new Set());
  const [existingRelationships, setExistingRelationships] = useState<
    Relationship[]
  >([]);

  // ----- EFFECTS -----
  useEffect(() => {
    if (data?.relationships) setExistingRelationships(data.relationships);
  }, [data?.relationships]);

  useEffect(() => {
    const checkGeminiApi = async () => {
      try {
        const settings = await GeminiService.getSettings();
        if (!settings) setShowGeminiSettings(true);
        setHasCheckedGeminiApi(true);
      } catch {
        setShowGeminiSettings(true);
      }
    };
    checkGeminiApi();
  }, []);

  // Reset toàn bộ state khi đổi từ
  useEffect(() => {
    if (data) {
      setKeptImageUrls(data.image_urls || []);
      setWordValue(data.word ?? "");
      setPronunciationValue(data.pronunciation ?? "");
      setFrequencyValue(data.frequency ?? "");
      setLanguageLevelValue(data.language_level ?? "");
      setUsageNotes(data.usage_notes || []);
      setDefinitions(data.definitions || []);
      setImageFiles([]);
      setImageFilePreviews([]);
      setUsageNoteInput("");
      setSuggestedRelationships([]);
      setSelectedRelationships(new Set());
      setExistingRelationships(data.relationships || []);
      setImageError(null);
      setDeletedImageIndexes(new Set());
      setFieldStatuses({
        word: "idle",
        pronunciation: "idle",
        frequency: "idle",
        language_level: "idle",
        images: "idle",
      });
    }
  }, [data]);

  useEffect(() => {
    // Cleanup preview URLs
    return () => {
      imageFilePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageFilePreviews]);

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
      await ApiService.put(`/wiki/word/${data.id}`, formData, true, true);
      setFieldStatuses((prev) => ({ ...prev, images: "success" }));

      setImageFiles([]);
      imageFilePreviews.forEach((url) => URL.revokeObjectURL(url));
      setImageFilePreviews([]);
      setDeletedImageIndexes(new Set());

      // Gọi reload lại data từ backend để lấy url ảnh thật!
      if (onRefresh) await onRefresh();
    } catch {
      setFieldStatuses((prev) => ({ ...prev, images: "error" }));
    } finally {
      setImageSaveLoading(false);
    }
  };

  // ------ Usage Note Handler ------
  const handleSaveUsageNotes = async (notes: string[]) => {
    if (!data?.id) return;
    await ApiService.put(`/wiki/word/${data.id}`, {
      field: "usage_notes",
      value: JSON.stringify(notes),
    });
  };

  const handleSetMainDefinition = async (definitionId: string) => {
    try {
      await ApiService.put(`/wiki/word/definitions/${definitionId}`, {
        field: "is_main_definition",
        value: "true",
      });
      // Cập nhật local state để reflect UI
      setDefinitions((definitions) =>
        definitions.map((def) => ({
          ...def,
          is_main_definition: def.id === definitionId,
        }))
      );
      if (onRefresh) await onRefresh(); // (Không cần thiết nữa, update ngay local state cũng được)
    } catch (error) {
      // handle error UI nếu cần
    }
  };

  // ----- FIELD CHANGE HANDLERS -----
  const handleFieldChange = async (field: EditingField, value: string) => {
    console.log("handleFieldChange:", field, value);
    if (!field) return;
    const statusField = field as StatusField;
    switch (field) {
      case "word":
        setWordValue(value);
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
    if (!field) return;
    const statusField = field as StatusField;
    try {
      const value =
        valueToSave ??
        (() => {
          switch (field) {
            case "word":
              return wordValue;
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
      await ApiService.put(`/wiki/word/${data!.id}`, { field, value });
      setFieldStatuses((prev) => ({ ...prev, [statusField]: "success" }));
      setEditingField(null);
    } catch {
      setFieldStatuses((prev) => ({ ...prev, [statusField]: "error" }));
    }
  };
  const handleCancel = (field: EditingField) => {
    if (!field) return;
    const statusField = field as StatusField;
    switch (field) {
      case "word":
        setWordValue(data?.word ?? "");
        break;
      case "pronunciation":
        setPronunciationValue(data?.pronunciation ?? "");
        break;
      case "frequency":
        setFrequencyValue(data?.frequency ?? "");
        break;
      case "language_level":
        setLanguageLevelValue(data?.language_level ?? "");
        break;
    }
    setFieldStatuses((prev) => ({ ...prev, [statusField]: "idle" }));
    setEditingField(null);
  };

  // ------------- DEF/EXAMPLE/USAGE NOTE HANDLERS -------------
  const handleAddDefinition = async () => {
    try {
      const isFirstDefinition = !definitions || definitions.length === 0;

      const response = await ApiService.post<{
        code: number;
        message: string;
        data: Definition;
      }>(`/wiki/word/${data!.id}/definitions`, {
        parts_of_speech: newDefinition.parts_of_speech,
        definition: newDefinition.definition,
        is_main_definition: isFirstDefinition,
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

  const handleUpdateDefinition = async (
    definitionId: string,
    field: string,
    value: string
  ) => {
    try {
      if (!data?.id) return;
      await ApiService.put(
        `/wiki/word/${data.id}/definitions/${definitionId}`,
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

  const handleAddExample = async (
    wordId: string,
    definitionId: string,
    example: { example_sentence: string; mean_example_sentence: string }
  ) => {
    await ApiService.post(
      `/wiki/word/${wordId}/definitions/${definitionId}/examples`,
      example
    );
    if (onRefresh) await onRefresh();
  };

  const handleDeleteExample = async (
    definitionId: string,
    exampleId: string
  ) => {
    try {
      await ApiService.delete(
        `/wiki/word/${
          data!.id
        }/definitions/${definitionId}/examples/${exampleId}`
      );
      setDefinitions((oldDefs) =>
        oldDefs.map((def) =>
          def.id === definitionId
            ? {
                ...def,
                examples: def.examples.filter((ex) => ex.id !== exampleId),
              }
            : def
        )
      );
    } catch (e) {
      // Optionally, show toast error here
    }
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
          <EditWordBaseSection
            word={wordValue}
            pronunciation={pronunciationValue}
            frequency={frequencyValue}
            languageLevel={languageLevelValue}
            fieldStatuses={fieldStatuses}
            onChange={handleFieldChange}
            onSave={handleSave}
            onCancel={handleCancel}
          />
          {/* ---- SECTION 2: Images ---- */}
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
            onPreviewImages={onPreviewImages}
          />
          {/* ---- SECTION 3: Relationship Section ---- */}
          <EditWordRelationshipSection
            data={{
              id: data.id,
              word: data.word,
              relationships: existingRelationships,
            }}
            existingRelationships={existingRelationships}
            setExistingRelationships={setExistingRelationships}
            suggestedRelationships={suggestedRelationships}
            setSuggestedRelationships={setSuggestedRelationships}
            selectedRelationships={selectedRelationships}
            setSelectedRelationships={setSelectedRelationships}
            setShowCreatePhraseDrawer={setShowCreatePhraseDrawer}
            setShowCreateWordDrawer={setShowCreateWordDrawer}
            setCreateText={setCreateText}
            handleQuickCreateWord={handleQuickCreateWord}
            handleQuickCreatePhrase={handleQuickCreatePhrase}
            isQuickCreatingWord={isQuickCreatingWord}
            isQuickCreatingPhrase={isQuickCreatingPhrase}
          />
          {/* ---- SECTION 4: Usage Note ---- */}
          <EditUsageNoteSection
            usageNoteInput={usageNoteInput}
            setUsageNoteInput={setUsageNoteInput}
            usageNotes={usageNotes}
            setUsageNotes={setUsageNotes}
            onSaveNotes={handleSaveUsageNotes}
          />
          {/* ---- SECTION 5: Definition Section ---- */}
          <EditDefinitionSection
            wordId={data.id}
            definitions={definitions}
            newDefinition={newDefinition}
            setNewDefinition={setNewDefinition}
            onAddDefinition={handleAddDefinition}
            onUpdateDefinition={handleUpdateDefinition}
            onRemoveDefinition={(definitionId) => {
              setDefinitions((defs) =>
                defs.filter((def) => def.id !== definitionId)
              );
            }}
            onAddExample={handleAddExample}
            onRemoveExample={handleDeleteExample}
            onSetMainDefinition={handleSetMainDefinition}
            PartOfSpeechSection={EditWordPartOfSpeechSection}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

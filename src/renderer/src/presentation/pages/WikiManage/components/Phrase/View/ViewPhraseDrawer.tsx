import { Sheet, SheetContent } from "../../../../../components/ui/sheet";

interface Definition {
  id: string;
  parts_of_speech: string;
  definition: string;
  is_main_definition: boolean;
  examples: Array<{
    id: string;
    example_sentence: string;
    mean_example_sentence: string;
    created_at: string;
    updated_at: string;
  }>;
  created_at: string;
  updated_at: string;
}

interface Relationship {
  id: string;
  related_id: string;
  related_type: string;
  relationship_type: string;
  word: string;
  created_at: string;
  updated_at: string;
}

interface PhraseData {
  id: string;
  phrase: string;
  pronunciation: string;
  frequency: string;
  image_urls: string[];
  language_level: string;
  created_at: string;
  updated_at: string;
  definitions: Definition[];
  relationships: Relationship[];
}

interface ViewPhraseDrawerProps {
  open: boolean;
  onClose: () => void;
  data?: PhraseData;
}

const frequencyLabels = {
  high: { label: "Cao", color: "bg-green-100 text-green-700 border-green-200" },
  medium: {
    label: "Trung bình",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  low: { label: "Thấp", color: "bg-red-100 text-red-700 border-red-200" },
};

const levelLabels = {
  beginner: {
    label: "Beginner",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  intermediate: {
    label: "Intermediate",
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
  advanced: {
    label: "Advanced",
    color: "bg-pink-100 text-pink-700 border-pink-200",
  },
};

const partsOfSpeechLabels = {
  verb: {
    label: "Động từ",
    color: "bg-indigo-100 text-indigo-700 border-indigo-200",
  },
  noun: {
    label: "Danh từ",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  adjective: {
    label: "Tính từ",
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  adverb: {
    label: "Trạng từ",
    color: "bg-rose-100 text-rose-700 border-rose-200",
  },
};

export function ViewPhraseDrawer({
  open,
  onClose,
  data,
}: ViewPhraseDrawerProps) {
  if (!data) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-[40vw] overflow-y-auto bg-[#f6f6f0]"
      >
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-semibold text-[#2D3748] mb-2">
              {data.phrase}
            </h2>
            <p className="text-lg text-[#718096] font-medium">
              {data.pronunciation}
            </p>
          </div>

          {/* Badges */}
          <div className="flex gap-2">
            <span
              className={`px-3 py-1 rounded-lg border ${
                frequencyLabels[data.frequency as keyof typeof frequencyLabels]
                  ?.color
              }`}
            >
              {
                frequencyLabels[data.frequency as keyof typeof frequencyLabels]
                  ?.label
              }
            </span>
            <span
              className={`px-3 py-1 rounded-lg border ${
                levelLabels[data.language_level as keyof typeof levelLabels]
                  ?.color
              }`}
            >
              {
                levelLabels[data.language_level as keyof typeof levelLabels]
                  ?.label
              }
            </span>
          </div>

          {/* Images */}
          {data.image_urls?.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-[#2D3748] font-medium">Hình ảnh</h3>
              <div className="grid grid-cols-2 gap-4">
                {data.image_urls?.map((url, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden"
                  >
                    <img
                      src={url}
                      alt={`${data.phrase} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Words */}
          {data.relationships?.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-[#2D3748] font-medium">Từ liên quan</h3>
              <div className="flex flex-wrap gap-2">
                {data.relationships?.map((rel) => (
                  <div
                    key={rel.id}
                    className={`px-3 py-1 rounded-lg border ${
                      partsOfSpeechLabels[
                        rel.relationship_type as keyof typeof partsOfSpeechLabels
                      ]?.color
                    }`}
                  >
                    <span className="text-sm">{rel.word}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Definitions */}
          {data.definitions?.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-[#2D3748] font-medium">Định nghĩa</h3>
              {data.definitions?.map((def) => (
                <div
                  key={def.id}
                  className="rounded-lg border border-[#52aaa5]/10 p-4 space-y-4 bg-white"
                >
                  {/* Parts of Speech */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-lg border ${
                        partsOfSpeechLabels[
                          def.parts_of_speech as keyof typeof partsOfSpeechLabels
                        ]?.color
                      }`}
                    >
                      {
                        partsOfSpeechLabels[
                          def.parts_of_speech as keyof typeof partsOfSpeechLabels
                        ]?.label
                      }
                    </span>
                    {def.is_main_definition && (
                      <span className="px-3 py-1 rounded-lg bg-[#52aaa5]/10 text-[#52aaa5] text-sm">
                        Định nghĩa chính
                      </span>
                    )}
                  </div>

                  {/* Definition */}
                  <p className="text-[#2D3748]">{def.definition}</p>

                  {/* Examples */}
                  {def.examples?.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-[#718096]">
                        Ví dụ:
                      </h4>
                      {def.examples?.map((example) => (
                        <div
                          key={example.id}
                          className="pl-4 border-l-2 border-[#52aaa5]/20 space-y-1"
                        >
                          <p className="text-[#2D3748]">
                            {example.example_sentence}
                          </p>
                          <p className="text-[#718096]">
                            {example.mean_example_sentence}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

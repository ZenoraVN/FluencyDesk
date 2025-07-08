import { Relationship } from "../../../type/wiki";
import { X } from "lucide-react";
import { relationshipTypeLabels } from "./EditWordRelationshipSection";
import { RELATIONSHIP_TYPES } from "../constants";

interface Props {
  existingRelationships: Relationship[];
  handleRemoveRelationship: (relationshipId: string) => void;
}

export function EditExistingWordRelationshipSection({
  existingRelationships,
  handleRemoveRelationship,
}: Props) {
  const relationshipsByType = RELATIONSHIP_TYPES.map((t) => ({
    type: t,
    items: existingRelationships.filter((r) => r.relationship_type === t),
  }));

  return (
    <div>
      <div className="space-y-2">
        {relationshipsByType.map(({ type, items }) => (
          <div key={type}>
            {/* Title */}
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-block rounded-lg text-[15px] text-black">
                {relationshipTypeLabels[type]?.label || type}
              </span>
              <span className="text-gray-400 text-[15px] font-medium">
                ({items.length})
              </span>
            </div>
            {/* Content */}
            <div className="border border-gray-300 rounded-lg p-2 hover:outline hover:outline-[#52aaa5] hover:outline-1">
              <div className="flex flex-wrap gap-2">
                {items.length === 0 && (
                  <div className="text-gray-400 italic text-[15px] px-2 py-1">
                    Chưa có
                  </div>
                )}
                {items.map((relationship) => (
                  <button
                    key={relationship.id}
                    type="button"
                    aria-label="Xóa relationship"
                    onClick={() => handleRemoveRelationship(relationship.id)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-900 font-medium text-[15px] hover:bg-gray-100 transition"
                  >
                    <span>{relationship.word || relationship.phrase}</span>
                    {relationship.mean_vietnamese && (
                      <span className="ml-1 text-gray-500 italic font-normal text-[14px]">
                        ({relationship.mean_vietnamese})
                      </span>
                    )}
                    <X className="w-4 h-4 text-red-500 hover:text-red-700" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

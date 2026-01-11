import type { Ead3Response } from "../models/ead3.types";
import type { Bookmark } from "../models/bookmarks.types";
import { TEMP_CATEGORIES } from "../models/bookmarks.types";
import type { Category } from "../models/bookmarks.types";

export function buildBookmark(record: Ead3Response): Bookmark {
  const unitId = record.archDesc.did.unitId.text;

  const digitalObjectCount = record.digitalObjectCount ?? 0;

  return {
    mode: "add-from-search",
    id: crypto.randomUUID(),
    archive: "NARA",
    eadId: unitId,
    level: record.archDesc.level,
    title: record.archDesc.did.unitTitle,
    path: record.path ?? [],
    material:
      record.archDesc.localType || record.archDesc.dsc?.head
        ? {
            type: record.archDesc.localType,
            media: record.archDesc.dsc?.head,
          }
        : undefined,
    category: TEMP_CATEGORIES[0] as Category,
    customName: "",
    onlineAvailable: digitalObjectCount > 0,
    createdAt: new Date().toISOString(),
  };
}

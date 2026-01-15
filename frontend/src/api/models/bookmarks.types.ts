import type { PathSegment } from "./ead3.types";
import type { ArchiveName, WindowMode } from "./archive.types";

export interface BookmarkCategory {
  id: string; // UUID
  name: string;
  order: number;
  color?: string;
  createdAt: string;
}

export interface Tag {
  id: string; // uuid
  name: string; // canonical name (lowercase)
  label: string; // display name
  createdAt: string;
}

export interface Bookmark {
  mode: WindowMode;
  id: string; // internal UUID
  archive: ArchiveName;
  eadId: string; // unitId / persistent id
  title: string; // archDesc.did.unitTitle
  path: PathSegment[]; // EAD3 Path (ancestors only)
  ead3: {
    level: string; // record.archDesc.level (raw string - can be any value)
    localType?: string; // record.archDesc.localType
    dscHead?: string; // record.archDesc.dsc?.head
    digitalObjectCount: number; // record.digitalObjectCount ?? 0
  };
  categoryId: string;
  tags?: string[];
  createdAt: string;
  customName: string;
  note?: string; // user note (optional)
  url: string;
}

// Re-export for convenience
export type {
  ARCHIVES,
  LEVELS,
  ArchiveName,
  WindowMode,
} from "./archive.types";

import type { PathSegment } from "./ead3.types";

export interface BookmarkCategory {
  id: string; //} UUID
  name: string;
  order: number;
  color?: string;
}

export interface Tag {
  id: string; // uuid
  name: string; // canonical name (lowercase)
  label: string; // display name
  createdAt: string;
}

export const WINDOW_MODES = ["add-manual", "add-from-search", "edit"] as const;
export type WindowMode = (typeof WINDOW_MODES)[number];

export const ARCHIVES = ["NARA", "UKNA"] as const;
export type ArchiveName = (typeof ARCHIVES)[number];

export interface Bookmark {
  mode: WindowMode;
  id: string; // internal UUID
  archive: ArchiveName;
  eadId: string; // unitId / persistent id
  title: string; // archDesc.did.unitTitle
  path: PathSegment[]; // EAD3 Path (ancestors only)
  ead3: {
    level: string; // record.archDesc.level (raw)
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

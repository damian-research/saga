import type { PathSegment } from "./ead3.types";

export const TEMP_CATEGORIES = [
  "General",
  "Research",
  "WWII",
  "Intelligence",
  "Operations",
  "Technology",
] as const;

export type Category = (typeof TEMP_CATEGORIES)[number];

export const WINDOW_MODES = ["add-manual", "add-from-search", "edit"] as const;
export type WindowMode = (typeof WINDOW_MODES)[number];

export const ARCHIVES = ["NARA", "UKNA"] as const;
export type ArchiveName = (typeof ARCHIVES)[number];

export interface Bookmark {
  mode: WindowMode;
  id: string; // internal UUID
  archive: ArchiveName;
  eadId: string; // unitId / persistent id
  level: string; // EAD level: recordgrp | series | file | item
  title: string; // archDesc.did.unitTitle
  path: PathSegment[]; // EAD3 Path (ancestors only)

  material?: {
    type?: string; // Textual Records
    media?: string; // Loose Sheets
  };

  category: Category;
  customName: string;
  onlineAvailable: boolean; // derived (dao count > 0)

  createdAt: string; // ISO
  note?: string; // user note (optional)
}

// archive.types.ts

// ===== ARCHIVES =====
export const ARCHIVES = ["NARA", "UKNA"] as const;
export type ArchiveName = (typeof ARCHIVES)[number];

// ===== LEVEL OF DESCRIPTION =====
export const LEVELS = [
  "recordGroup",
  "collection",
  "series",
  "fileUnit",
  "item",
] as const;
export type LevelOfDescription = (typeof LEVELS)[number];

export const LEVEL_LABELS: Record<LevelOfDescription, string> = {
  recordGroup: "Record Group",
  collection: "Collection",
  series: "Series",
  fileUnit: "File Unit",
  item: "Item",
};

// Helper function to get display label
export function getLevelLabel(level: string): string {
  return LEVEL_LABELS[level as LevelOfDescription] ?? level;
}

// ===== WINDOW MODES =====
export const WINDOW_MODES = ["add-manual", "add-from-search", "edit"] as const;
export type WindowMode = (typeof WINDOW_MODES)[number];

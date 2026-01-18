// archive.types.ts

// ===== ARCHIVES =====
export const ARCHIVES = ["NARA", "UKNA"] as const;
export type ArchiveName = (typeof ARCHIVES)[number];

// ===== WINDOW MODES =====
export const WINDOW_MODES = ["add-manual", "add-from-search", "edit"] as const;
export type WindowMode = (typeof WINDOW_MODES)[number];

// ===== LEVEL OF DESCRIPTION =====
export const LevelOfDescription = {
  RecordGroup: "RecordGroup",
  Collection: "Collection",
  Series: "Series",
  FileUnit: "FileUnit",
  Item: "Item",
  Fonds: "Fonds",
} as const;

export type LevelOfDescription =
  (typeof LevelOfDescription)[keyof typeof LevelOfDescription];

export function toEad3String(level: LevelOfDescription): string {
  const map: { [key: string]: string } = {
    [LevelOfDescription.RecordGroup]: "recordGroup",
    [LevelOfDescription.Collection]: "collection",
    [LevelOfDescription.Series]: "series",
    [LevelOfDescription.FileUnit]: "fileUnit",
    [LevelOfDescription.Item]: "item",
    [LevelOfDescription.Fonds]: "fonds",
  };
  return map[level] || "item";
}

export function parseLevelOfDescription(level?: string): LevelOfDescription {
  if (!level) return LevelOfDescription.Item;

  switch (level.toLowerCase()) {
    case "recordgroup":
    case "recordgrp":
      return LevelOfDescription.RecordGroup;
    case "collection":
      return LevelOfDescription.Collection;
    case "series":
      return LevelOfDescription.Series;
    case "fileunit":
    case "file":
      return LevelOfDescription.FileUnit;
    case "item":
      return LevelOfDescription.Item;
    case "fonds":
      return LevelOfDescription.Fonds;
    default:
      return LevelOfDescription.Item;
  }
}

export function getHierarchyOrder(level: LevelOfDescription): number {
  const order: { [key: string]: number } = {
    [LevelOfDescription.RecordGroup]: 0,
    [LevelOfDescription.Fonds]: 1,
    [LevelOfDescription.Collection]: 2,
    [LevelOfDescription.Series]: 3,
    [LevelOfDescription.FileUnit]: 4,
    [LevelOfDescription.Item]: 5,
  };
  return order[level] ?? 99;
}

export function getLabel(level: LevelOfDescription): string {
  const labels: { [key: string]: string } = {
    [LevelOfDescription.RecordGroup]: "Record Group",
    [LevelOfDescription.Collection]: "Collection",
    [LevelOfDescription.Series]: "Series",
    [LevelOfDescription.FileUnit]: "File Unit",
    [LevelOfDescription.Item]: "Item",
    [LevelOfDescription.Fonds]: "Fonds",
  };
  return labels[level] || "Item";
}

export function getLevelLabel(level: string): string {
  return getLabel(parseLevelOfDescription(level));
}

export const LEVEL_OF_DESCRIPTION_VALUES = Object.values(
  LevelOfDescription,
) as LevelOfDescription[];

export const LevelOfDescriptionExtensions = {
  ToEad3String: toEad3String,
  ParseLevel: parseLevelOfDescription,
  GetHierarchyOrder: getHierarchyOrder,
  GetLabel: getLabel,
};

// ===== LEVEL OF DESCRIPTION =====
// export const LEVELS = [
//   "recordGroup",
//   "collection",
//   "series",
//   "fileUnit",
//   "item",
// ] as const;
// export type LevelOfDescription = (typeof LEVELS)[number];

// export const LEVEL_LABELS: Record<LevelOfDescription, string> = {
//   recordGroup: "Record Group",
//   collection: "Collection",
//   series: "Series",
//   fileUnit: "File Unit",
//   item: "Item",
// };

// Helper function to get display label
// export function getLevelLabel(level: string): string {
//   return LEVEL_LABELS[level as LevelOfDescription] ?? level;
// }

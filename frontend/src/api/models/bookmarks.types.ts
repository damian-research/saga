export interface Bookmark {
  id: string; // internal UUID
  category: string;
  customName?: string;
  originalTitle: string;
  level: string; // L1/L2/L3/L4/L5 or equivalent
  recordType: string; // Series / Item / File / etc.
  archiveName: string; // NARA / UK National Archives / etc.
  onlineAvailable: boolean;
  openRef: {
    archive: "NARA" | "UK";
    id: string | number; // naId or Cxxxx
  };
}

// Catalogue levels per Discovery
export type UkCatalogueLevel = 1 | 2 | 3 | 6 | 7;

export interface UknaSearchRecord {
  id: string; // Cxxxx
  title: string;
  level: UkCatalogueLevel; // parsed L1–L3 only at search stage
  department?: string; // CAB, FO, BT…
  reference?: string; // optional textual ref
  hasDigitalObjects?: boolean;
  detailsUrl: string; // URL to Discovery details page
}

export interface UknaHierarchyNode {
  level: UkCatalogueLevel;
  title: string;
  reference?: string;
}

export interface UknaDetailsRecord {
  id: string;
  title: string;
  reference?: string;
  dates?: string[]; // normalized, backend decides format
  department?: string;
  subjects: string[];
  path: UknaHierarchyNode[];
  detailsUrl: string;
  previewUrl?: string;
  hasPreview: boolean;
}

export interface UknaHierarchyNode {
  level: UkCatalogueLevel;
  title: string;
  reference?: string;
}

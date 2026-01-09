// Catalogue levels per Discovery
export type UkCatalogueLevel = 1 | 2 | 3 | 4 | 5;

export interface UkSearchRecord {
  id: string; // Cxxxx
  title: string;
  level: UkCatalogueLevel; // parsed L1–L3 only at search stage
  department?: string; // CAB, FO, BT…
  reference?: string; // optional textual ref
  hasDigitalObjects?: boolean;
}

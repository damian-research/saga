// ===== search.types.ts =====
import type { LevelOfDescription } from "./archive.types";

export interface SearchFormState {
  q: string;
  limit: number;
  title?: string;
  naId?: string;
  onlineAvailable: boolean;
  personOrOrg?: string;
  dataSource?: string;
  levelOfDescription?: LevelOfDescription;
  recordGroupNumber?: string;
  microfilmId?: string;
  localId?: string;
  ancestorNaId?: string;
  firstChildOnly?: boolean;
}

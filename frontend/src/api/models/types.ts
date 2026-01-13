export interface SearchFormState {
  q: string;
  limit: number;
  title?: string;
  naId?: string;
  onlineAvailable: boolean;
  personOrOrg?: string;
  dataSource?: string;
  levelOfDescription?:
    | "recordGroup"
    | "collection"
    | "series"
    | "fileUnit"
    | "item";
  recordGroupNumber?: string;
  microfilmId?: string;
  localId?: string;
}

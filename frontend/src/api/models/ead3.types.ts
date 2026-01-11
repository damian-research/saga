//   naId: number;
//   title: string;
//   level: string;
//   distance: number;
// }

// export interface RawRecord {
//   naId: number;
//   title: string;
//   levelDescription: string;
//   materialType?: string;
//   sourceReference?: string;
//   description?: string;
//   ancestors: Ancestor[];
//   path: PathSegment[];
//   totalDigitalObjects?: number;
// }

// export interface FullRecord {
//   naId: number;
//   title: string;
//   ancestors: Ancestor[];
//   digitalObjects: DigitalObject[];
// }

// export interface DigitalObject {
//   objectType: string;
//   objectUrl: string;
//   objectFileSize: number;
// }

// export interface PathSegment {
//   type: "recordGroup" | "series" | "fileUnit" | "item";
//   label: string; // render
//   naId: number; // link, navigation
// }

// ============================================================================
// EAD3 TYPESCRIPT MODELS
// ============================================================================

export interface Ead3Response {
  control: Control;
  archDesc: ArchDesc;
}

export interface Control {
  recordId: string;
  fileDesc: FileDesc;
  maintenanceAgency: MaintenanceAgency;
  maintenanceHistory: MaintenanceHistory;
}

export interface FileDesc {
  titleStmt: TitleStmt;
  publicationStmt: PublicationStmt;
}

export interface TitleStmt {
  titleProper: string;
  subtitle?: string;
  author?: string;
}

export interface PublicationStmt {
  publisher: string;
  date: EadDate;
}

export interface EadDate {
  text: string;
  normal?: string;
  calendar?: string;
  era?: string;
}

export interface MaintenanceAgency {
  agencyCode: string;
  agencyName: string;
}

export interface MaintenanceHistory {
  maintenanceEvents: MaintenanceEvent[];
}

export interface MaintenanceEvent {
  eventType: { value: string };
  eventDateTime: { text: string; standardDateTime: string };
  agentType: { value: string };
  agent: string;
}

export interface ArchDesc {
  level: string;
  localType?: string;
  did: Did;
  dsc?: Dsc;
}

export interface Did {
  head?: string;
  unitTitle: string;
  unitId: UnitId;
  unitDate?: UnitDate;
  repository?: Repository;
  origination?: Origination;
  abstract?: Abstract;
  langMaterial?: LangMaterial;
}

export interface UnitId {
  text: string;
  identifier?: string;
}

export interface UnitDate {
  text: string;
  normal?: string;
  calendar?: string;
  era?: string;
}

export interface Repository {
  corpName: CorpName;
}

export interface CorpName {
  parts: Part[];
}

export interface Part {
  localType: string;
  text: string;
  rules?: string;
  lang?: string;
}

export interface Origination {
  persName?: PersName;
  corpName?: CorpName;
}

export interface PersName {
  identifier?: string;
  relator?: string;
  rules?: string;
  parts: Part[];
}

export interface Abstract {
  text: string;
  lang?: string;
}

export interface LangMaterial {
  languageSet: {
    language: { langCode: string; text: string };
    script: { scriptCode: string; text: string };
  };
}

export interface Dsc {
  dscType: string;
  head?: string;
  components: Component[];
}

export interface Component {
  level: string;
  did: ComponentDid;
  scopeContent?: ScopeContent;
}

export interface ComponentDid {
  unitId: string;
  unitTitle: UnitTitle;
  unitDate?: UnitDate;
  daoSet?: DaoSet;
}

export interface UnitTitle {
  text: string;
  lang?: string;
  genreForm?: GenreForm;
}

export interface GenreForm {
  parts: Part[];
}

export interface DaoSet {
  coverage: string;
  daos: Dao[];
}

export interface Dao {
  href: string;
  linkTitle?: string;
  localType?: string;
  daoType?: string;
  show?: string;
  actuate?: string;
}

export interface ScopeContent {
  chronList: ChronList;
}

export interface ChronList {
  chronItems: ChronItem[];
}

export interface ChronItem {
  dateSingle: DateSingle;
  event: Event;
}

export interface DateSingle {
  standardDate: string;
  text: string;
}

export interface Event {
  localType: string;
  personNames?: PersName[];
  corporateNames?: CorpName[];
  geographicNames?: GeogName[];
  subjects?: Subject[];
}

export interface GeogName {
  identifier?: string;
  part: string;
  geographicCoordinates?: {
    coordinateSystem: string;
    text: string;
  };
}

export interface Subject {
  parts: Part[];
}

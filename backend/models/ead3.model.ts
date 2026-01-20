import type { LevelOfDescription } from "./archive.types";

// ============================================================================
// EAD3 MODELS
// ============================================================================

// xmlRoot("ead", Namespace = "http://ead3.archivists.org/schema/")]
export interface Ead {
  /** xml: <control> */
  control: Control;

  /** xml: <archdesc> */
  archDesc: ArchDesc;

  /** custom field, not serialized */
  path?: PathSegment[];

  /** custom field, not serialized */
  digitalObjectCount?: number;
}

export interface PathSegment {
  /** Archival level (EAD semantics), e.g. "recordgrp", "series", "file", "fonds" */
  level: string;

  /** Archive-specific identifier (string for cross-archive support */
  id: string;

  /** Human-readable label, e.g. "RG# 34445", "Series Motion Pictures */
  label: string;
}

// --------------------------------------------------------------------------
// CONTROL SECTION
// --------------------------------------------------------------------------

export interface Control {
  /** xml: countryencoding */
  countryEncoding?: string;

  /** xml: dateencoding */
  dateEncoding?: string;

  /** xml: langencoding */
  langEncoding?: string;

  /** xml: relatedencoding */
  relatedEncoding?: string;

  /** xml: scriptencoding */
  scriptEncoding?: string;

  /** xml: <recordid> */
  recordId?: string;

  /** xml: <filedesc> */
  fileDesc?: FileDesc;

  /** xml: <maintenancestatus> */
  maintenanceStatus?: MaintenanceStatus;

  /** xml: <maintenanceagency> */
  maintenanceAgency?: MaintenanceAgency;

  /** xml: <languagedeclaration> */
  languageDeclaration?: LanguageDeclaration;

  /** xml: <localtypedeclaration> */
  localTypeDeclaration?: LocalTypeDeclaration;

  /** xml: <maintenancehistory> */
  maintenanceHistory?: MaintenanceHistory;
}

export interface FileDesc {
  /** xml: <titlestmt> */
  titleStmt: TitleStmt;

  /** xml: <publicationstmt> */
  publicationStmt: PublicationStmt;

  /** xml: <notestmt> */
  noteStmt?: NoteStmt;
}

export interface TitleStmt {
  /** xml: <titleproper> */
  titleProper: string;

  /** xml: <subtitle> */
  subtitle?: string;

  /** xml: <author> */
  author?: string;
}

export interface PublicationStmt {
  /** xml: <publisher> */
  publisher?: string;

  /** xml: <date> */
  address?: Address;

  /** xml: <date> */
  date?: EadDate;
}

export interface Address {
  /** xml: <addressline>[] */
  addressLines?: string[];
}

export interface EadDate {
  /** xml: text */
  text: string;

  /** xml: normal */
  normal?: string;

  /** xml: calendar */
  calendar?: string;

  /** xml: era */
  era?: string;
}

export interface NoteStmt {
  /** xml: <controlnote> */
  controlNote?: ControlNote;
}

export interface ControlNote {
  /** xml: <p> */
  paragraph?: ParagraphWithRef;
}

export interface ParagraphWithRef {
  /** xml: text() */
  text?: string;

  /** xml: <ref> */
  ref?: Reference;
}

export interface Reference {
  /** xml: @show */
  show?: string;

  /** xml: @actuate */
  actuate?: string;

  /** xml: @href */
  href?: string;

  /** xml: text() */
  text?: string;
}

export interface LanguageDeclaration {
  /** xml: <language> */
  language?: Language;

  /** xml: <script> */
  script?: Script;

  /** xml: <descriptivenote> */
  descriptiveNote?: DescriptiveNote;
}

export interface Language {
  /** xml: langcode */
  langCode?: string;

  /** xml: text */
  text?: string;
}

export interface Script {
  /** xml: scriptcode */
  scriptCode?: string;

  /** xml: text() */
  text?: string;
}

export interface DescriptiveNote {
  /** xml: <p> */
  paragraph?: string;
}

export interface LocalTypeDeclaration {
  /** xml: <abbr> */
  abbreviation?: string;

  /** xml: <citation> */
  citation?: Citation;

  /** xml: <descriptivenote> */
  descriptiveNote?: DescriptiveNote;
}

export interface Citation {
  /** xml: href */
  href?: string;

  /** xml: linktitle */
  linkTitle?: string;

  /** xml: actuate */
  actuate?: string;

  /** xml: show */
  show?: string;

  /** xml: text() */
  text?: string;
}

export interface EventType {
  /** xml: value */
  value?: string;
}

export interface EventDateTime {
  /** xml: standarddatetime */
  standardDateTime?: string;

  /** xml: text */
  text?: string;
}

export interface AgentType {
  /** xml: value */
  value?: string;
}

export interface MaintenanceAgency {
  /** xml: countrycode */
  countryCode?: string;

  /** xml: <agencycode> */
  agencyCode?: string;

  /** xml: <agencyname> */
  agencyName?: string;
}

export interface MaintenanceStatus {
  /** xml: value */
  value?: string;
}

export interface MaintenanceHistory {
  /** xml: <maintenanceevent> */
  maintenanceEvents: MaintenanceEvent[];
}

export interface MaintenanceEvent {
  /** xml: <eventtype> */
  eventType?: EventType;

  /** xml: <eventdatetime> */
  eventDateTime?: EventDateTime;

  /** xml: <agenttype> */
  agentType?: AgentType;

  /** xml: <agent> */
  agent?: string;

  /** xml: <eventdescription> */
  eventDescription?: string;
}

// --------------------------------------------------------------------------
// ARCHDESC & DID
// --------------------------------------------------------------------------

export interface ArchDesc {
  /** xml: level */
  level: LevelOfDescription | string;

  /** xml: localtype */
  localType?: string;

  /** xml: <did> */
  did: Did;

  /** xml: <dsc> */
  dsc?: Dsc;

  /** xml: <controlaccess> */
  controlAccess?: ControlAccess;
}

export interface Did {
  /** xml: <head> */
  head?: string;

  /** xml: <unittitle> */
  unitTitle: string;

  /** xml: <unitid> */
  unitId: UnitId;

  /** xml: <unitdate> */
  unitDate?: UnitDate;

  /** xml: <repository> */
  repository?: Repository;

  /** xml: <origination> */
  origination?: Origination;

  /** xml: <abstract> */
  abstract?: Abstract;

  /** xml: <langmaterial> */
  langMaterial?: LangMaterial;
}

export interface UnitId {
  /** xml: text() */
  text: string;

  /** xml: identifier */
  identifier?: string;
}

export interface UnitDate {
  /** xml: text() */
  text: string;

  /** xml: normal */
  normal?: string;

  /** xml: calendar */
  calendar?: string;

  /** xml: era */
  era?: string;
}

export interface Repository {
  /** xml: <corpname> */
  corpName: CorpName;
}

export interface CorpName {
  /** xml: identifier */
  identifier?: string;

  /** xml: relator */
  relator?: string;

  /** xml: rules */
  rules?: string;

  /** xml: <part>[] */
  parts?: Part[];

  /** xml: text() */
  text?: string;
}

export interface Part {
  /** xml: localtype */
  localType: string;

  /** xml: text() */
  text: string;

  /** xml: rules */
  rules?: string;

  /** xml: @xml:lang */
  lang?: string;
}

export interface Origination {
  /** xml: <persname> */
  persName?: PersName;
}

export interface PersName {
  /** xml: identifier */
  identifier?: string;

  /** xml: relator */
  relator?: string;

  /** xml: rules */
  rules?: string;

  /** xml: <part>[] */
  parts: Part[];
}

export interface Abstract {
  /** xml: text() */
  text: string;

  /** xml: lang */
  lang?: string;
}

export interface LangMaterial {
  /** xml: <languageset> */
  languageSet?: LanguageSet;
}

export interface LanguageSet {
  /** xml: <language> */
  language?: Language;

  /** xml: <script> */
  script?: Script;

  /** xml: <descriptivenote> */
  descriptiveNote?: DescriptiveNote;
}

// --------------------------------------------------------------------------
// DSC / COMPONENTS / DIGITAL OBJECTS
// --------------------------------------------------------------------------

export interface Dsc {
  /** xml: dsctype */
  dscType: string;

  /** xml: <head> */
  head?: string;

  /** xml: <c>[] */
  components: Component[];
}

export interface ControlAccess {
  /** xml: <head> */
  head?: string;

  /** xml: <subject>[] */
  subjects?: Subject[];
}

export interface Component {
  /** xml: level */
  level: string;

  /** xml: <did> */
  did: ComponentDid;

  /** xml: <scopecontent> */
  scopeContent?: ScopeContent;
}

export interface ComponentDid {
  /** xml: <unitid> */
  unitId: string;

  /** xml: <unittitle> */
  unitTitle: UnitTitle;

  /** xml: <unitdate> */
  unitDate?: UnitDate;

  /** xml: <daoset> */
  daoSet?: DaoSet;
}

export interface UnitTitle {
  /** xml: text() */
  text: string;

  /** xml: @xml:lang */
  lang?: string;

  /** xml: <genreform> */
  genreForm?: GenreForm;
}

export interface GenreForm {
  /** xml: <part>[] */
  parts: Part[];
}

export interface DaoSet {
  /** xml: @coverage */
  coverage: string;

  /** xml: <dao>[] */
  daos: Dao[];
}

export interface Dao {
  /** xml: daotype */
  daoType?: string;

  /** xml: coverage */
  coverage?: string;

  /** xml: actuate */
  actuate?: string;

  /** xml: show */
  show?: string;

  /** xml: linktitle */
  linkTitle?: string;

  /** xml: localtype */
  localType?: string;

  /** xml: href */
  href?: string;
}

// --------------------------------------------------------------------------
// SCOPECONTENT / CHRONLIST
// --------------------------------------------------------------------------

export interface ScopeContent {
  /** xml: <chronlist> */
  chronList: ChronList;
}

export interface ChronList {
  /** xml: <chronitem>[] */
  chronItems: ChronItem[];
}

export interface ChronItem {
  /** xml: <datesingle> */
  dateSingle: DateSingle;

  /** xml: <event> */
  event: Event;
}

export interface DateSingle {
  /** xml: standarddate */
  standardDate: string;

  /** xml: text() */
  text: string;
}

export interface Event {
  /** xml: @localtype */
  localType: string;

  /** xml: <persname>[] */
  personNames?: PersName[];

  /** xml: <corpname>[] */
  corporateNames?: CorpName[];

  /** xml: <geogname>[] */
  geographicNames?: GeogName[];

  /** xml: <subject>[] */
  subjects?: Subject[];
}

export interface GeogName {
  /** xml: identifier */
  identifier?: string;

  /** xml: <part> */
  part?: string;

  /** xml: <geographiccoordinates> */
  geographicCoordinates?: GeographicCoordinates;
}

export interface GeographicCoordinates {
  /** xml: coordinatesystem */
  coordinateSystem?: string;

  /** xml: text() */
  text?: string;
}

export interface Subject {
  /** xml: <part>[] */
  parts?: Part[];
}

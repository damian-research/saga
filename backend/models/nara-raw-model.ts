// backend/models/nara-raw.model.ts

// ============================================================================
// NARA API RESPONSE MODELS
// ============================================================================

export interface NaraResponse {
  /** json: body */
  body?: Body;

  /** json: statusCode */
  statusCode: number;

  /** json: headers */
  headers?: { [key: string]: string };
}

export interface Body {
  /** json: hits */
  hits?: Hits;

  /** json: aggregations */
  aggregations?: Aggregations;
}

export interface Hits {
  /** json: total */
  total?: Total;

  /** json: max_score */
  max_score?: number;

  /** json: hits */
  hits?: Hit[];
}

export interface Total {
  /** json: value */
  value: number;

  /** json: relation */
  relation?: string;
}

export interface Hit {
  /** json: _index */
  _index?: string;

  /** json: _id */
  _id?: string;

  /** json: _score */
  _score: number;

  /** json: _source */
  _source?: Source;

  /** json: fields */
  fields?: Fields;

  /** json: sort */
  sort?: any[];
}

export interface Source {
  /** json: metadata */
  metadata?: Metadata;

  /** json: record */
  record?: Record;
}

export interface Metadata {
  /** json: fileName */
  fileName?: string;

  /** json: controlGroup */
  controlGroup?: ControlGroup;

  /** json: ingestTime */
  ingestTime?: string;

  /** json: uuid */
  uuid?: string;
}

export interface ControlGroup {
  /** json: indexName */
  indexName?: string;

  /** json: type */
  type?: string;

  /** json: naId */
  naId: number;
}

export interface Record {
  /** json: levelOfDescription */
  levelOfDescription?: string;

  /** json: recordType */
  recordType?: string;

  /** json: subjects */
  subjects?: SubjectNara[];

  /** json: useRestriction */
  useRestriction?: Restriction;

  /** json: accessRestriction */
  accessRestriction?: Restriction;

  /** json: audiovisual */
  audiovisual?: string;

  /** json: title */
  title?: string;

  /** json: coverageEndDate */
  coverageEndDate?: NaraDate;

  /** json: coverageStartDate */
  coverageStartDate?: NaraDate;

  /** json: physicalOccurrences */
  physicalOccurrences?: PhysicalOccurrence[];

  /** json: pinnedTerms */
  pinnedTerms?: string[];

  /** json: dataControlGroup */
  dataControlGroup?: DataControlGroup;

  /** json: generalRecordsTypes */
  generalRecordsTypes?: string[];

  /** json: generalNotes */
  generalNotes?: string[];

  /** json: microformPublications */
  microformPublications?: MicroformPublication[];

  /** json: variantControlNumbers */
  variantControlNumbers?: VariantControlNumber[];

  /** json: digitalObjects */
  digitalObjects?: DigitalObject[];

  /** json: otherTitles */
  otherTitles?: string[];

  /** json: ancestors */
  ancestors?: Ancestor[];

  /** json: scopeAndContentNote */
  scopeAndContentNote?: string;

  /** json: naId */
  naId: number;
}

export interface SubjectNara {
  /** json: heading */
  heading?: string;

  /** json: authorityType */
  authorityType?: string;

  /** json: naId */
  naId: number;
}

export interface Restriction {
  /** json: status */
  status?: string;

  /** json: note */
  note?: string;

  /** json: specificRestriction */
  specificRestriction?: string[];
}

export interface NaraDate {
  /** json: month */
  month?: number;

  /** json: year */
  year: number;

  /** json: day */
  day?: number;

  /** json: logicalDate */
  logicalDate?: string;
}

export interface PhysicalOccurrence {
  /** json: referenceUnits */
  referenceUnits?: ReferenceUnit[];

  /** json: mediaOccurrences */
  mediaOccurrences?: MediaOccurrence[];

  /** json: copyStatus */
  copyStatus?: string;
}

export interface ReferenceUnit {
  /** json: address1 */
  address1?: string;

  /** json: address2 */
  address2?: string;

  /** json: city */
  city?: string;

  /** json: state */
  state?: string;

  /** json: postalCode */
  postalCode?: string;

  /** json: phone */
  phone?: string;

  /** json: fax */
  fax?: string;

  /** json: email */
  email?: string;

  /** json: name */
  name?: string;

  /** json: mailCode */
  mailCode?: string;
}

export interface MediaOccurrence {
  /** json: specificMediaType */
  specificMediaType?: string;

  /** json: generalMediaTypes */
  generalMediaTypes?: string[];

  /** json: containerId */
  containerId?: string;
}

export interface DataControlGroup {
  /** json: groupName */
  groupName?: string;

  /** json: groupId */
  groupId?: string;

  /** json: groupCd */
  groupCd?: string;
}

export interface MicroformPublication {
  /** json: identifier */
  identifier?: string;

  /** json: title */
  title?: string;

  /** json: note */
  note?: string;
}

export interface VariantControlNumber {
  /** json: note */
  note?: string;

  /** json: number */
  number?: string;

  /** json: type */
  type?: string;
}

export interface DigitalObject {
  /** json: objectFilename */
  objectFilename?: string;

  /** json: objectUrl */
  objectUrl?: string;

  /** json: objectFileSize */
  objectFileSize: number;

  /** json: objectId */
  objectId?: string;

  /** json: objectDescription */
  objectDescription?: string;

  /** json: objectType */
  objectType?: string;

  /** json: objectDesignator */
  objectDesignator?: string;
}

export interface Ancestor {
  /** json: inclusiveStartDate */
  inclusiveStartDate?: NaraDate;

  /** json: inclusiveEndDate */
  inclusiveEndDate?: NaraDate;

  /** json: distance */
  distance: number;

  /** json: levelOfDescription */
  levelOfDescription?: string;

  /** json: recordGroupNumber */
  recordGroupNumber?: number;

  /** json: title */
  title?: string;

  /** json: naId */
  naId: number;

  /** json: creators */
  creators?: Creator[];
}

export interface Creator {
  /** json: creatorType */
  creatorType?: string;

  /** json: heading */
  heading?: string;

  /** json: authorityType */
  authorityType?: string;

  /** json: establishDate */
  establishDate?: NaraDate;

  /** json: abolishDate */
  abolishDate?: NaraDate;

  /** json: naId */
  naId: number;
}

export interface Fields {
  /** json: totalDigitalObjects */
  totalDigitalObjects?: number[];

  /** json: firstDigitalObject */
  firstDigitalObject?: FirstDigitalObject[];
}

export interface FirstDigitalObject {
  /** json: objectUrl */
  objectUrl?: string;

  /** json: objectId */
  objectId?: string;

  /** json: objectType */
  objectType?: string;
}

export interface Aggregations {
  /** json: typeOfMaterials */
  typeOfMaterials?: AggregationBucket;

  /** json: collectionIdentifier */
  collectionIdentifier?: CollectionIdentifierAggregation;

  /** json: referenceUnits */
  referenceUnits?: AggregationBucket;

  /** json: levelOfDescription */
  levelOfDescription?: AggregationBucket;

  /** json: recordGroupNumber */
  recordGroupNumber?: RecordGroupAggregation;

  /** json: availableOnline */
  availableOnline?: AvailableOnlineAggregation;

  /** json: dataSource */
  dataSource?: AggregationBucket;

  /** json: objectType */
  objectType?: AggregationBucket;

  /** json: localIdentifierCount */
  localIdentifierCount?: LocalIdentifierCount;
}

export interface AggregationBucket {
  /** json: doc_count_error_upper_bound */
  doc_count_error_upper_bound: number;

  /** json: sum_other_doc_count */
  sum_other_doc_count: number;

  /** json: buckets */
  buckets?: Bucket[];
}

export interface Bucket {
  /** json: key */
  key?: string;

  /** json: doc_count */
  doc_count: number;
}

export interface CollectionIdentifierAggregation {
  /** json: doc_count */
  doc_count: number;
  /** json: filter_collections */
  filter_collections?: FilterCollections;
}

export interface FilterCollections {
  /** json: doc_count */
  doc_count: number;
  /** json: collections */
  collections?: AggregationBucket;
}

export interface RecordGroupAggregation {
  /** json: doc_count */
  doc_count: number;
  /** json: filter_recordGroups */
  filter_recordGroups?: FilterRecordGroups;
}

export interface FilterRecordGroups {
  /** json: doc_count */
  doc_count: number;

  /** json: recordGroups */
  recordGroups?: AggregationBucket;
}

export interface AvailableOnlineAggregation {
  /** json: doc_count */
  doc_count: number;
}

export interface LocalIdentifierCount {
  /** json: doc_count */
  doc_count: number;
}

// ============================================================================
// MAPPING: NARA API → EAD3 MODEL
// ============================================================================

/*
FIELD MAPPING FROM NARA TO EAD3:

┌─────────────────────────────────────────────────────────────────────────┐
│ CONTROL SECTION (Metadata about the document)                           │
└─────────────────────────────────────────────────────────────────────────┘

NARA → EAD3
─────────────────────────────────────────────────────────────────────────
metadata.uuid                    → Control.RecordId
metadata.fileName                → Control.FileDesc.TitleStmt.TitleProper
"NARA Digital Conversion"        → Control.FileDesc.TitleStmt.Author
metadata.ingestTime              → Control.FileDesc.PublicationStmt.Date.Text
metadata.ingestTime              → Control.FileDesc.PublicationStmt.Date.Normal
"National Archives and Records Administration" → Control.FileDesc.PublicationStmt.Publisher
"derived"                        → Control.MaintenanceStatus.Value
"US-DNA"                        → Control.MaintenanceAgency.AgencyCode
"National Archives and Records Administration" → Control.MaintenanceAgency.AgencyName
metadata.ingestTime              → Control.MaintenanceHistory.MaintenanceEvents[0].EventDateTime.Text
metadata.ingestTime              → Control.MaintenanceHistory.MaintenanceEvents[0].EventDateTime.StandardDateTime
"created"                        → Control.MaintenanceHistory.MaintenanceEvents[0].EventType.Value
"machine"                        → Control.MaintenanceHistory.MaintenanceEvents[0].AgentType.Value
"NARA Digital Archive System"   → Control.MaintenanceHistory.MaintenanceEvents[0].Agent
"microformPublications[]"       → Comtrol.FileDesc.NoteStmt.COntroleNote.Paragraph

┌─────────────────────────────────────────────────────────────────────────┐
│ ARCHDESC & DID SECTION (Archive content description)                    │
└─────────────────────────────────────────────────────────────────────────┘

NARA → EAD3
─────────────────────────────────────────────────────────────────────────
record.levelOfDescription        → ArchDesc.Level
record.generalRecordsTypes       → ArchDesc.LocalType (joined with " / ")
record.title                     → ArchDesc.Did.UnitTitle
record.naId                      → ArchDesc.Did.UnitId.Text
record.naId                      → ArchDesc.Did.UnitId.Identifier (with "nara:" prefix)
record.coverageStartDate.logicalDate → ArchDesc.Did.UnitDate.Normal (start part)
record.coverageEndDate.logicalDate   → ArchDesc.Did.UnitDate.Normal (end part)
record.coverageStartDate + coverageEndDate → ArchDesc.Did.UnitDate.Text (formatted range)
"gregorian"                      → ArchDesc.Did.UnitDate.Calendar
"ce"                            → ArchDesc.Did.UnitDate.Era
record.scopeAndContentNote       → ArchDesc.Did.Abstract.Text
record.generalNotes              → ArchDesc.Did.Abstract.Text (if scopeAndContentNote is null)
record.useRestriction            → ArchDesc.ControlAccess.Subject.Part
record.accessRestriction         → ArchDesc.ControlAccess.Subject.Part

┌─────────────────────────────────────────────────────────────────────────┐
│ REPOSITORY                                                              │
└─────────────────────────────────────────────────────────────────────────┘

NARA → EAD3
─────────────────────────────────────────────────────────────────────────
physicalOccurrences[0].referenceUnits[0].name → Did.Repository.CorpName.Parts[0].Text
"corpname"                       → Did.Repository.CorpName.Parts[0].LocalType

┌─────────────────────────────────────────────────────────────────────────┐
│ ORIGINATION (CREATORS)                                                  │
└─────────────────────────────────────────────────────────────────────────┘

NARA → EAD3
─────────────────────────────────────────────────────────────────────────
ancestors[].creators (where creatorType = "Most Recent") → Did.Origination.PersName
ancestors[].creators.naId        → Did.Origination.PersName.Identifier
"creator"                        → Did.Origination.PersName.Relator
ancestors[].creators.heading     → Did.Origination.PersName.Parts[0].Text
"persname"                       → Did.Origination.PersName.Parts[0].LocalType
ancestors[].creators.creatorType → Did.Origination.PersName.Parts[1].Text
"role"                          → Did.Origination.PersName.Parts[1].LocalType
ancestors[].creators.establishDate + abolishDate → Did.Origination.PersName.Parts[2].Text
"dates"                         → Did.Origination.PersName.Parts[2].LocalType

┌─────────────────────────────────────────────────────────────────────────┐
│ DSC & COMPONENTS (Digital Objects)                                      │
└─────────────────────────────────────────────────────────────────────────┘

NARA → EAD3
─────────────────────────────────────────────────────────────────────────
"combined"                       → ArchDesc.Dsc.DscType
physicalOccurrences[].mediaOccurrences[].generalMediaTypes → Dsc.Head (joined with " / ")
record.digitalObjects[]          → Dsc.Components[]

Per Digital Object:
"item"                          → Component.Level
digitalObjects[].objectId        → Component.Did.UnitId
digitalObjects[].objectDescription → Component.Did.UnitTitle.Text
digitalObjects[].objectFilename  → Component.Did.UnitTitle.Text (fallback if description is null)
digitalObjects[].objectType      → Component.Did.UnitTitle.GenreForm.Parts[0].Text
"type_record"                    → Component.Did.UnitTitle.GenreForm.Parts[0].LocalType
"whole"                         → Component.Did.DaoSet.Coverage
digitalObjects[].objectUrl       → Component.Did.DaoSet.Daos[0].Href
digitalObjects[].objectDescription → Component.Did.DaoSet.Daos[0].LinkTitle
digitalObjects[].objectType      → Component.Did.DaoSet.Daos[0].LocalType
"derived"                        → Component.Did.DaoSet.Daos[0].DaoType
"new"                           → Component.Did.DaoSet.Daos[0].Show
"onrequest"                     → Component.Did.DaoSet.Daos[0].Actuate

ScopeContent:
DateTime.UtcNow                  → Component.ScopeContent.ChronList.ChronItems[0].DateSingle.StandardDate
"Digital object available"       → Component.ScopeContent.ChronList.ChronItems[0].DateSingle.Text
"digital_object"                 → Component.ScopeContent.ChronList.ChronItems[0].Event.LocalType
digitalObjects[].objectFilename  → Component.ScopeContent.ChronList.ChronItems[0].Event.Subjects[0].Parts[0].Text
"object"                        → Component.ScopeContent.ChronList.ChronItems[0].Event.Subjects[0].Parts[0].LocalType

┌─────────────────────────────────────────────────────────────────────────┐
│ PATH (Hierarchy from Ancestors)                                         │
└─────────────────────────────────────────────────────────────────────────┘

NARA → EAD3
─────────────────────────────────────────────────────────────────────────
ancestors[] (filtered & ordered) → Path[]
ancestors[].naId                 → PathSegment.Id
ancestors[].levelOfDescription   → PathSegment.Level (normalized)
  "recordGroup" or "recordgrp"   → "recordgrp"
  "fileUnit"                     → "file"
  other                          → lowercase

Label formatting:
  recordGroup/recordgrp:         → "RG# {recordGroupNumber} – {title}"
  series:                        → "Series {title}"
  fileUnit:                      → "File {title}"
  other:                         → "{title}"

Filtering rules:
- Exclude ancestors with same naId as record.naId
- Exclude ancestors with same levelOfDescription as record.levelOfDescription
- Order by hierarchy: recordGroup(0), fonds(1), series(2), fileUnit(3), item(4)

┌─────────────────────────────────────────────────────────────────────────┐
│ DIGITAL OBJECT COUNT                                                    │
└─────────────────────────────────────────────────────────────────────────┘

NARA → EAD3
─────────────────────────────────────────────────────────────────────────
fields.totalDigitalObjects[0]    → Ead.DigitalObjectCount (if available)
record.digitalObjects.length     → Ead.DigitalObjectCount (fallback)
0                               → Ead.DigitalObjectCount (default)

┌─────────────────────────────────────────────────────────────────────────┐
│ UNMAPPED NARA FIELDS (Available but not currently mapped to EAD3)       │
└─────────────────────────────────────────────────────────────────────────┘

- record.subjects[]
- record.audiovisual
- record.pinnedTerms[]
- record.dataControlGroup
- record.variantControlNumbers[]
- record.otherTitles[]
- digitalObjects[].objectFileSize
- digitalObjects[].objectDesignator
- physicalOccurrences[].copyStatus
- physicalOccurrences[].mediaOccurrences[].specificMediaType
- physicalOccurrences[].mediaOccurrences[].containerId
- physicalOccurrences[].referenceUnits[] (address fields available but not mapped)
- aggregations (entire section not mapped to EAD3)

┌─────────────────────────────────────────────────────────────────────────┐
│ NOTES                                                                   │
└─────────────────────────────────────────────────────────────────────────┘

- All null fields in NARA are preserved as null in EAD3
- Date formatting: ISO 8601 for standardDateTime, human-readable for text
- Multiple creators: only "Most Recent" creator is mapped to Origination
- Digital objects: each becomes a separate Component at "item" level
- Path segments: automatically filtered and ordered by hierarchical level
*/

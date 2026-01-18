// backend/models/nara-raw.model.ts

export interface NaraResponse {
  body?: Body;
  statusCode: number;
  headers?: { [key: string]: string };
}

export interface Body {
  hits?: Hits;
  aggregations?: Aggregations;
}

export interface Hits {
  total?: Total;
  max_score?: number;
  hits?: Hit[];
}

export interface Total {
  value: number;
  relation?: string;
}

export interface Hit {
  _index?: string;
  _id?: string;
  _score: number;
  _source?: Source;
  fields?: Fields;
  sort?: any[];
}

export interface Source {
  metadata?: Metadata;
  record?: Record;
}

export interface Metadata {
  fileName?: string;
  controlGroup?: ControlGroup;
  ingestTime?: string;
  uuid?: string;
}

export interface ControlGroup {
  indexName?: string;
  type?: string;
  naId: number;
}

export interface Record {
  levelOfDescription?: string;
  recordType?: string;
  subjects?: SubjectNara[];
  useRestriction?: Restriction;
  accessRestriction?: Restriction;
  audiovisual?: string;
  title?: string;
  coverageEndDate?: NaraDate;
  coverageStartDate?: NaraDate;
  physicalOccurrences?: PhysicalOccurrence[];
  pinnedTerms?: string[];
  dataControlGroup?: DataControlGroup;
  generalRecordsTypes?: string[];
  generalNotes?: string[];
  microformPublications?: MicroformPublication[];
  variantControlNumbers?: VariantControlNumber[];
  digitalObjects?: DigitalObject[];
  otherTitles?: string[];
  ancestors?: Ancestor[];
  scopeAndContentNote?: string;
  naId: number;
}

export interface SubjectNara {
  heading?: string;
  authorityType?: string;
  naId: number;
}

export interface Restriction {
  status?: string;
  note?: string;
  specificRestriction?: string[];
}

export interface NaraDate {
  month?: number;
  year: number;
  day?: number;
  logicalDate?: string;
}

export interface PhysicalOccurrence {
  referenceUnits?: ReferenceUnit[];
  mediaOccurrences?: MediaOccurrence[];
  copyStatus?: string;
}

export interface ReferenceUnit {
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  phone?: string;
  fax?: string;
  email?: string;
  name?: string;
  mailCode?: string;
}

export interface MediaOccurrence {
  specificMediaType?: string;
  generalMediaTypes?: string[];
  containerId?: string;
}

export interface DataControlGroup {
  groupName?: string;
  groupId?: string;
  groupCd?: string;
}

export interface MicroformPublication {
  identifier?: string;
  title?: string;
  note?: string;
}

export interface VariantControlNumber {
  note?: string;
  number?: string;
  type?: string;
}

export interface DigitalObject {
  objectFilename?: string;
  objectUrl?: string;
  objectFileSize: number;
  objectId?: string;
  objectDescription?: string;
  objectType?: string;
  objectDesignator?: string;
}

export interface Ancestor {
  inclusiveStartDate?: NaraDate;
  inclusiveEndDate?: NaraDate;
  distance: number;
  levelOfDescription?: string;
  recordGroupNumber?: number;
  title?: string;
  naId: number;
  creators?: Creator[];
}

export interface Creator {
  creatorType?: string;
  heading?: string;
  authorityType?: string;
  establishDate?: NaraDate;
  abolishDate?: NaraDate;
  naId: number;
}

export interface Fields {
  totalDigitalObjects?: number[];
  firstDigitalObject?: FirstDigitalObject[];
}

export interface FirstDigitalObject {
  objectUrl?: string;
  objectId?: string;
  objectType?: string;
}

export interface Aggregations {
  typeOfMaterials?: AggregationBucket;
  collectionIdentifier?: CollectionIdentifierAggregation;
  referenceUnits?: AggregationBucket;
  levelOfDescription?: AggregationBucket;
  recordGroupNumber?: RecordGroupAggregation;
  availableOnline?: AvailableOnlineAggregation;
  dataSource?: AggregationBucket;
  objectType?: AggregationBucket;
  localIdentifierCount?: LocalIdentifierCount;
}

export interface AggregationBucket {
  doc_count_error_upper_bound: number;
  sum_other_doc_count: number;
  buckets?: Bucket[];
}

export interface Bucket {
  key?: string;
  doc_count: number;
}

export interface CollectionIdentifierAggregation {
  doc_count: number;
  filter_collections?: FilterCollections;
}

export interface FilterCollections {
  doc_count: number;
  collections?: AggregationBucket;
}

export interface RecordGroupAggregation {
  doc_count: number;
  filter_recordGroups?: FilterRecordGroups;
}

export interface FilterRecordGroups {
  doc_count: number;
  recordGroups?: AggregationBucket;
}

export interface AvailableOnlineAggregation {
  doc_count: number;
}

export interface LocalIdentifierCount {
  doc_count: number;
}

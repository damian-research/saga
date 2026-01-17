namespace Saga.Data.Models;

// ============================================================================
// NARA API RESPONSE MODELS
// ============================================================================

public class NaraResponse
{
    [JsonPropertyName("body")]
    public Body? Body { get; set; }

    [JsonPropertyName("statusCode")]
    public int StatusCode { get; set; }

    [JsonPropertyName("headers")]
    public Dictionary<string, string>? Headers { get; set; }
}

public class Body
{
    [JsonPropertyName("hits")]
    public Hits? Hits { get; set; }

    [JsonPropertyName("aggregations")]
    public Aggregations? Aggregations { get; set; }
}

public class Hits
{
    [JsonPropertyName("total")]
    public Total? Total { get; set; }

    [JsonPropertyName("max_score")]
    public double? MaxScore { get; set; }

    [JsonPropertyName("hits")]
    public List<Hit>? HitsList { get; set; }
}

public class Total
{
    [JsonPropertyName("value")]
    public int Value { get; set; }

    [JsonPropertyName("relation")]
    public string? Relation { get; set; }
}

public class Hit
{
    [JsonPropertyName("_index")]
    public string? Index { get; set; }

    [JsonPropertyName("_id")]
    public string? Id { get; set; }

    [JsonPropertyName("_score")]
    public double Score { get; set; }

    [JsonPropertyName("_source")]
    public Source? Source { get; set; }

    [JsonPropertyName("fields")]
    public Fields? Fields { get; set; }

    [JsonPropertyName("sort")]
    public List<object>? Sort { get; set; }
}

public class Source
{
    [JsonPropertyName("metadata")]
    public Metadata? Metadata { get; set; }

    [JsonPropertyName("record")]
    public Record? Record { get; set; }
}

public class Metadata
{
    [JsonPropertyName("fileName")]
    public string? FileName { get; set; }

    [JsonPropertyName("controlGroup")]
    public ControlGroup? ControlGroup { get; set; }

    [JsonPropertyName("ingestTime")]
    public string? IngestTime { get; set; }

    [JsonPropertyName("uuid")]
    public string? Uuid { get; set; }
}

public class ControlGroup
{
    [JsonPropertyName("indexName")]
    public string? IndexName { get; set; }

    [JsonPropertyName("type")]
    public string? Type { get; set; }

    [JsonPropertyName("naId")]
    public int NaId { get; set; }
}

public class Record
{
    [JsonPropertyName("levelOfDescription")]
    public string? LevelOfDescription { get; set; }

    [JsonPropertyName("recordType")]
    public string? RecordType { get; set; }

    [JsonPropertyName("subjects")]
    public List<SubjectNara>? Subjects { get; set; }

    [JsonPropertyName("useRestriction")]
    public Restriction? UseRestriction { get; set; }

    [JsonPropertyName("accessRestriction")]
    public Restriction? AccessRestriction { get; set; }

    [JsonPropertyName("audiovisual")]
    public string? Audiovisual { get; set; }

    [JsonPropertyName("title")]
    public string? Title { get; set; }

    [JsonPropertyName("coverageEndDate")]
    public NaraDate? CoverageEndDate { get; set; }

    [JsonPropertyName("coverageStartDate")]
    public NaraDate? CoverageStartDate { get; set; }

    [JsonPropertyName("physicalOccurrences")]
    public List<PhysicalOccurrence>? PhysicalOccurrences { get; set; }

    [JsonPropertyName("pinnedTerms")]
    public List<string>? PinnedTerms { get; set; }

    [JsonPropertyName("dataControlGroup")]
    public DataControlGroup? DataControlGroup { get; set; }

    [JsonPropertyName("generalRecordsTypes")]
    public List<string>? GeneralRecordsTypes { get; set; }

    [JsonPropertyName("generalNotes")]
    public List<string>? GeneralNotes { get; set; }

    [JsonPropertyName("microformPublications")]
    public List<MicroformPublication>? MicroformPublications { get; set; }

    [JsonPropertyName("variantControlNumbers")]
    public List<VariantControlNumber>? VariantControlNumbers { get; set; }

    [JsonPropertyName("digitalObjects")]
    public List<DigitalObject>? DigitalObjects { get; set; }

    [JsonPropertyName("otherTitles")]
    public List<string>? OtherTitles { get; set; }

    [JsonPropertyName("ancestors")]
    public List<Ancestor>? Ancestors { get; set; }

    [JsonPropertyName("scopeAndContentNote")]
    public string? ScopeAndContentNote { get; set; }

    [JsonPropertyName("naId")]
    public int NaId { get; set; }
}

public class SubjectNara
{
    [JsonPropertyName("heading")]
    public string? Heading { get; set; }

    [JsonPropertyName("authorityType")]
    public string? AuthorityType { get; set; }

    [JsonPropertyName("naId")]
    public int NaId { get; set; }
}

public class Restriction
{
    [JsonPropertyName("status")]
    public string? Status { get; set; }

    [JsonPropertyName("note")]
    public string? Note { get; set; }

    [JsonPropertyName("specificRestriction")]
    public List<string>? SpecificRestriction { get; set; }
}

public class NaraDate
{
    [JsonPropertyName("month")]
    public int? Month { get; set; }

    [JsonPropertyName("year")]
    public int Year { get; set; }

    [JsonPropertyName("day")]
    public int? Day { get; set; }

    [JsonPropertyName("logicalDate")]
    public string? LogicalDate { get; set; }
}

public class PhysicalOccurrence
{
    [JsonPropertyName("referenceUnits")]
    public List<ReferenceUnit>? ReferenceUnits { get; set; }

    [JsonPropertyName("mediaOccurrences")]
    public List<MediaOccurrence>? MediaOccurrences { get; set; }

    [JsonPropertyName("copyStatus")]
    public string? CopyStatus { get; set; }
}

public class ReferenceUnit
{
    [JsonPropertyName("address1")]
    public string? Address1 { get; set; }

    [JsonPropertyName("address2")]
    public string? Address2 { get; set; }

    [JsonPropertyName("city")]
    public string? City { get; set; }

    [JsonPropertyName("state")]
    public string? State { get; set; }

    [JsonPropertyName("postalCode")]
    public string? PostalCode { get; set; }

    [JsonPropertyName("phone")]
    public string? Phone { get; set; }

    [JsonPropertyName("fax")]
    public string? Fax { get; set; }

    [JsonPropertyName("email")]
    public string? Email { get; set; }

    [JsonPropertyName("name")]
    public string? Name { get; set; }

    [JsonPropertyName("mailCode")]
    public string? MailCode { get; set; }
}

public class MediaOccurrence
{
    [JsonPropertyName("specificMediaType")]
    public string? SpecificMediaType { get; set; }

    [JsonPropertyName("generalMediaTypes")]
    public List<string>? GeneralMediaTypes { get; set; }

    [JsonPropertyName("containerId")]
    public string? ContainerId { get; set; }
}

public class DataControlGroup
{
    [JsonPropertyName("groupName")]
    public string? GroupName { get; set; }

    [JsonPropertyName("groupId")]
    public string? GroupId { get; set; }

    [JsonPropertyName("groupCd")]
    public string? GroupCd { get; set; }
}

public class MicroformPublication
{
    [JsonPropertyName("identifier")]
    public string? Identifier { get; set; }

    [JsonPropertyName("title")]
    public string? Title { get; set; }

    [JsonPropertyName("note")]
    public string? Note { get; set; }
}

public class VariantControlNumber
{
    [JsonPropertyName("note")]
    public string? Note { get; set; }

    [JsonPropertyName("number")]
    public string? Number { get; set; }

    [JsonPropertyName("type")]
    public string? Type { get; set; }
}

public class DigitalObject
{
    [JsonPropertyName("objectFilename")]
    public string? ObjectFilename { get; set; }

    [JsonPropertyName("objectUrl")]
    public string? ObjectUrl { get; set; }

    [JsonPropertyName("objectFileSize")]
    public long ObjectFileSize { get; set; }

    [JsonPropertyName("objectId")]
    public string? ObjectId { get; set; }

    [JsonPropertyName("objectDescription")]
    public string? ObjectDescription { get; set; }

    [JsonPropertyName("objectType")]
    public string? ObjectType { get; set; }

    [JsonPropertyName("objectDesignator")]
    public string? ObjectDesignator { get; set; }
}

public class Ancestor
{
    [JsonPropertyName("inclusiveStartDate")]
    public NaraDate? InclusiveStartDate { get; set; }

    [JsonPropertyName("inclusiveEndDate")]
    public NaraDate? InclusiveEndDate { get; set; }

    [JsonPropertyName("distance")]
    public int Distance { get; set; }

    [JsonPropertyName("levelOfDescription")]
    public string? LevelOfDescription { get; set; }

    [JsonPropertyName("recordGroupNumber")]
    public int? RecordGroupNumber { get; set; }

    [JsonPropertyName("title")]
    public string? Title { get; set; }

    [JsonPropertyName("naId")]
    public int NaId { get; set; }

    [JsonPropertyName("creators")]
    public List<Creator>? Creators { get; set; }
}

public class Creator
{
    [JsonPropertyName("creatorType")]
    public string? CreatorType { get; set; }

    [JsonPropertyName("heading")]
    public string? Heading { get; set; }

    [JsonPropertyName("authorityType")]
    public string? AuthorityType { get; set; }

    [JsonPropertyName("establishDate")]
    public NaraDate? EstablishDate { get; set; }

    [JsonPropertyName("abolishDate")]
    public NaraDate? AbolishDate { get; set; }

    [JsonPropertyName("naId")]
    public int NaId { get; set; }
}

public class Fields
{
    [JsonPropertyName("totalDigitalObjects")]
    public List<int>? TotalDigitalObjects { get; set; }

    [JsonPropertyName("firstDigitalObject")]
    public List<FirstDigitalObject>? FirstDigitalObject { get; set; }
}

public class FirstDigitalObject
{
    [JsonPropertyName("objectUrl")]
    public string? ObjectUrl { get; set; }

    [JsonPropertyName("objectId")]
    public string? ObjectId { get; set; }

    [JsonPropertyName("objectType")]
    public string? ObjectType { get; set; }
}

public class Aggregations
{
    [JsonPropertyName("typeOfMaterials")]
    public AggregationBucket? TypeOfMaterials { get; set; }

    [JsonPropertyName("collectionIdentifier")]
    public CollectionIdentifierAggregation? CollectionIdentifier { get; set; }

    [JsonPropertyName("referenceUnits")]
    public AggregationBucket? ReferenceUnits { get; set; }

    [JsonPropertyName("levelOfDescription")]
    public AggregationBucket? LevelOfDescription { get; set; }

    [JsonPropertyName("recordGroupNumber")]
    public RecordGroupAggregation? RecordGroupNumber { get; set; }

    [JsonPropertyName("availableOnline")]
    public AvailableOnlineAggregation? AvailableOnline { get; set; }

    [JsonPropertyName("dataSource")]
    public AggregationBucket? DataSource { get; set; }

    [JsonPropertyName("objectType")]
    public AggregationBucket? ObjectType { get; set; }

    [JsonPropertyName("localIdentifierCount")]
    public LocalIdentifierCount? LocalIdentifierCount { get; set; }
}

public class AggregationBucket
{
    [JsonPropertyName("doc_count_error_upper_bound")]
    public int DocCountErrorUpperBound { get; set; }

    [JsonPropertyName("sum_other_doc_count")]
    public int SumOtherDocCount { get; set; }

    [JsonPropertyName("buckets")]
    public List<Bucket>? Buckets { get; set; }
}

public class Bucket
{
    [JsonPropertyName("key")]
    public string? Key { get; set; }

    [JsonPropertyName("doc_count")]
    public int DocCount { get; set; }
}

public class CollectionIdentifierAggregation
{
    [JsonPropertyName("doc_count")]
    public int DocCount { get; set; }

    [JsonPropertyName("filter_collections")]
    public FilterCollections? FilterCollections { get; set; }
}

public class FilterCollections
{
    [JsonPropertyName("doc_count")]
    public int DocCount { get; set; }

    [JsonPropertyName("collections")]
    public AggregationBucket? Collections { get; set; }
}

public class RecordGroupAggregation
{
    [JsonPropertyName("doc_count")]
    public int DocCount { get; set; }

    [JsonPropertyName("filter_recordGroups")]
    public FilterRecordGroups? FilterRecordGroups { get; set; }
}

public class FilterRecordGroups
{
    [JsonPropertyName("doc_count")]
    public int DocCount { get; set; }

    [JsonPropertyName("recordGroups")]
    public AggregationBucket? RecordGroups { get; set; }
}

public class AvailableOnlineAggregation
{
    [JsonPropertyName("doc_count")]
    public int DocCount { get; set; }
}

public class LocalIdentifierCount
{
    [JsonPropertyName("doc_count")]
    public int DocCount { get; set; }
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
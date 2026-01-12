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
│ CONTROL SECTION (Metadata about the document)                          │
└─────────────────────────────────────────────────────────────────────────┘

NARA → EAD3
─────────────────────────────────────────────────────────────────────────
metadata.uuid                    → Control.RecordId
metadata.fileName                → Control.FileDesc.TitleStmt.TitleProper
metadata.ingestTime              → Control.MaintenanceHistory.MaintenanceEvent.EventDateTime
metadata.controlGroup.naId       → Did.UnitId.Identifier
"NARA"                          → Control.MaintenanceAgency.AgencyName
"National Archives"             → Control.FileDesc.PublicationStmt.Publisher

┌─────────────────────────────────────────────────────────────────────────┐
│ DESCRIPTION SECTION (Archive content description)                       │
└─────────────────────────────────────────────────────────────────────────┘

NARA → EAD3
─────────────────────────────────────────────────────────────────────────
record.title                     → Did.UnitTitle
record.naId                      → Did.UnitId.Text
record.levelOfDescription        → ArchDesc.Level
record.coverageStartDate         → Did.UnitDate.Normal (start)
record.coverageEndDate           → Did.UnitDate.Normal (end)
record.scopeAndContentNote       → Did.Abstract.Text
record.generalNotes              → ScopeContent notes
record.otherTitles               → UnitTitle variants

┌─────────────────────────────────────────────────────────────────────────┐
│ CREATORS & SUBJECTS                                                     │
└─────────────────────────────────────────────────────────────────────────┘

NARA → EAD3
─────────────────────────────────────────────────────────────────────────
ancestors[].creators             → Did.Origination.PersName or CorpName
ancestors[].creators.heading     → PersName.Parts (with localtype="persname")
ancestors[].creators.creatorType → PersName.Parts (with localtype="role")
subjects[].heading               → Subject.Parts (with localtype="topic")
subjects[].authorityType         → Subject.Parts (with localtype="type")

┌─────────────────────────────────────────────────────────────────────────┐
│ PHYSICAL OCCURRENCES & LOCATIONS                                        │
└─────────────────────────────────────────────────────────────────────────┘

NARA → EAD3
─────────────────────────────────────────────────────────────────────────
physicalOccurrences[].referenceUnits[].name  → Repository.CorpName.Parts
physicalOccurrences[].referenceUnits[].address1 → Address.AddressLines[0]
physicalOccurrences[].referenceUnits[].address2 → Address.AddressLines[1]
physicalOccurrences[].referenceUnits[].city  → Address.AddressLines[2]
physicalOccurrences[].mediaOccurrences       → GenreForm.Parts (media type)
physicalOccurrences[].copyStatus             → GenreForm.Parts (status)

┌─────────────────────────────────────────────────────────────────────────┐
│ DIGITAL OBJECTS & LINKS                                                 │
└─────────────────────────────────────────────────────────────────────────┘

NARA → EAD3
─────────────────────────────────────────────────────────────────────────
digitalObjects[].objectUrl       → ComponentDid.DaoSet.Dao.Href
digitalObjects[].objectType      → ComponentDid.DaoSet.Dao.LocalType
digitalObjects[].objectDescription → ComponentDid.DaoSet.Dao.LinkTitle
digitalObjects[].objectFileSize  → (not mapped in EAD3)
digitalObjects[].objectId        → (metadata, not displayed)

OR from fields:
fields.firstDigitalObject[].objectUrl → Dao.Href

┌─────────────────────────────────────────────────────────────────────────┐
│ HIERARCHY & ANCESTORS                                                   │
└─────────────────────────────────────────────────────────────────────────┘

NARA → EAD3
─────────────────────────────────────────────────────────────────────────
ancestors[]                      → Component hierarchy (nested)
ancestors[].levelOfDescription   → Component.Level
ancestors[].title                → Component.Did.UnitTitle
ancestors[].naId                 → Component.Did.UnitId
ancestors[].recordGroupNumber    → (display in title or separate field)
ancestors[].distance             → (hierarchy depth, not explicitly mapped)

┌─────────────────────────────────────────────────────────────────────────┐
│ ADDITIONAL IDENTIFIERS                                                  │
└─────────────────────────────────────────────────────────────────────────┘

NARA → EAD3
─────────────────────────────────────────────────────────────────────────
variantControlNumbers[].number   → UnitId (additional identifiers)
variantControlNumbers[].type     → UnitId attribute or note
microformPublications[].identifier → Reference note
microformPublications[].title    → Reference note

┌─────────────────────────────────────────────────────────────────────────┐
│ ACCESS & RESTRICTIONS                                                   │
└─────────────────────────────────────────────────────────────────────────┘

NARA → EAD3
─────────────────────────────────────────────────────────────────────────
useRestriction.status            → AccessRestriction notes
accessRestriction.status         → AccessRestriction notes
audiovisual                      → GenreForm.Parts (media indicator)

┌─────────────────────────────────────────────────────────────────────────┐
│ EXAMPLE MAPPING FOR Record Group #11 (Example 1)                       │
└─────────────────────────────────────────────────────────────────────────┘

NARA Field                                    → EAD3 Location
────────────────────────────────────────────────────────────────────────
record.naId: 596314                           → Did.UnitId: "596314"
record.title: "Nineteenth Amendment..."      → Did.UnitTitle
record.levelOfDescription: "item"            → ArchDesc.Level: "item"
record.coverageStartDate.logicalDate         → UnitDate.Normal: "1919-06-04/1919-06-04"
ancestors[0].title: "General Records..."     → Parent Component.Did.UnitTitle
ancestors[0].recordGroupNumber: 11           → Display: "RG 11"
digitalObjects[0].objectUrl                  → Dao.Href
physicalOccurrences[0].referenceUnits[0].name → Repository.CorpName

┌─────────────────────────────────────────────────────────────────────────┐
│ EXAMPLE MAPPING FOR File Unit (Example 2)                              │
└─────────────────────────────────────────────────────────────────────────┘

NARA Field                                    → EAD3 Location
────────────────────────────────────────────────────────────────────────
record.naId: 73088101                        → Did.UnitId: "73088101"
record.title: "Brandt, Karl"                 → Did.UnitTitle
record.levelOfDescription: "fileUnit"        → ArchDesc.Level: "fileUnit"
ancestors[0].recordGroupNumber: 59           → Display: "RG 59"
fields.firstDigitalObject[0].objectUrl       → Dao.Href
microformPublications[0].identifier: "M679"  → Reference note
*/
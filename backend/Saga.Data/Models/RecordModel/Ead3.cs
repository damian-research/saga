#nullable enable
namespace Saga.Data.Models.RecordModel;

// [XmlRoot("ead", Namespace = "http://ead3.archivists.org/schema/")]
public class Ead
{
    // [XmlElement("control")]
    public required Control Control { get; set; }

    // [XmlElement("archdesc")]
    public required ArchDesc ArchDesc { get; set; }

    public List<PathSegment>? Path { get; set; }

    public int DigitalObjectCount { get; set; }
}

public class Control
{
    // [XmlAttribute("countryencoding")]
    public string? CountryEncoding { get; set; }

    // [XmlAttribute("dateencoding")]
    public string? DateEncoding { get; set; }

    // [XmlAttribute("langencoding")]
    public string? LangEncoding { get; set; }

    // [XmlAttribute("relatedencoding")]
    public string? RelatedEncoding { get; set; }

    // [XmlAttribute("scriptencoding")]
    public string? ScriptEncoding { get; set; }

    // [XmlElement("recordid")]
    public string? RecordId { get; set; }

    // [XmlElement("filedesc")]
    public FileDesc? FileDesc { get; set; }

    // [XmlElement("maintenancestatus")]
    public MaintenanceStatus? MaintenanceStatus { get; set; }

    // [XmlElement("maintenanceagency")]
    public MaintenanceAgency? MaintenanceAgency { get; set; }

    // [XmlElement("languagedeclaration")]
    public LanguageDeclaration? LanguageDeclaration { get; set; }

    // [XmlElement("localtypedeclaration")]
    public LocalTypeDeclaration? LocalTypeDeclaration { get; set; }

    // [XmlElement("maintenancehistory")]
    public MaintenanceHistory? MaintenanceHistory { get; set; }
}

public class FileDesc
{
    // [XmlElement("titlestmt")]
    public TitleStmt? TitleStmt { get; set; }

    // [XmlElement("publicationstmt")]
    public PublicationStmt? PublicationStmt { get; set; }

    // [XmlElement("notestmt")]
    public NoteStmt? NoteStmt { get; set; }
}

public class TitleStmt
{
    // [XmlElement("titleproper")]
    public string? TitleProper { get; set; }

    // [XmlElement("subtitle")]
    public string? Subtitle { get; set; }

    // [XmlElement("author")]
    public string? Author { get; set; }
}

public class PublicationStmt
{
    // [XmlElement("publisher")]
    public string? Publisher { get; set; }

    // [XmlElement("date")]
    public EadDate? Date { get; set; }

    // [XmlElement("address")]
    public Address? Address { get; set; }
}

public class Address
{
    // [XmlElement("addressline")]
    public List<string>? AddressLines { get; set; }
}

public class NoteStmt
{
    // [XmlElement("controlnote")]
    public ControlNote? ControlNote { get; set; }
}

public class ControlNote
{
    // [XmlElement("p")]
    public ParagraphWithRef? Paragraph { get; set; }
}

public class ParagraphWithRef
{
    // [XmlText]
    public string? Text { get; set; }

    // [XmlElement("ref")]
    public Reference? Ref { get; set; }
}

public class Reference
{
    // [XmlAttribute("show")]
    public string? Show { get; set; }

    // [XmlAttribute("actuate")]
    public string? Actuate { get; set; }

    // [XmlAttribute("href")]
    public string? Href { get; set; }

    // [XmlText]
    public string? Text { get; set; }
}

public class MaintenanceStatus
{
    // [XmlAttribute("value")]
    public string? Value { get; set; }
}

public class MaintenanceAgency
{
    // [XmlAttribute("countrycode")]
    public string? CountryCode { get; set; }

    // [XmlElement("agencycode")]
    public string? AgencyCode { get; set; }

    // [XmlElement("agencyname")]
    public string? AgencyName { get; set; }
}

public class LanguageDeclaration
{
    // [XmlElement("language")]
    public Language? Language { get; set; }

    // [XmlElement("script")]
    public Script? Script { get; set; }

    // [XmlElement("descriptivenote")]
    public DescriptiveNote? DescriptiveNote { get; set; }
}

public class Language
{
    // [XmlAttribute("langcode")]
    public string? LangCode { get; set; }

    // [XmlText]
    public string? Text { get; set; }
}

public class Script
{
    // [XmlAttribute("scriptcode")]
    public string? ScriptCode { get; set; }

    // [XmlText]
    public string? Text { get; set; }
}

public class DescriptiveNote
{
    // [XmlElement("p")]
    public string? Paragraph { get; set; }
}

public class LocalTypeDeclaration
{
    // [XmlElement("abbr")]
    public string? Abbreviation { get; set; }

    // [XmlElement("citation")]
    public Citation? Citation { get; set; }

    // [XmlElement("descriptivenote")]
    public DescriptiveNote? DescriptiveNote { get; set; }
}

public class Citation
{
    // [XmlAttribute("href")]
    public string? Href { get; set; }

    // [XmlAttribute("linktitle")]
    public string? LinkTitle { get; set; }

    // [XmlAttribute("actuate")]
    public string? Actuate { get; set; }

    // [XmlAttribute("show")]
    public string? Show { get; set; }

    // [XmlText]
    public string? Text { get; set; }
}

public class MaintenanceHistory
{
    // [XmlElement("maintenanceevent")]
    public List<MaintenanceEvent>? MaintenanceEvents { get; set; }
}

public class MaintenanceEvent
{
    // [XmlElement("eventtype")]
    public EventType? EventType { get; set; }

    // [XmlElement("eventdatetime")]
    public EventDateTime? EventDateTime { get; set; }

    // [XmlElement("agenttype")]
    public AgentType? AgentType { get; set; }

    // [XmlElement("agent")]
    public string? Agent { get; set; }

    // [XmlElement("eventdescription")]
    public string? EventDescription { get; set; }
}

public class EventType
{
    // [XmlAttribute("value")]
    public string? Value { get; set; }
}

public class EventDateTime
{
    // [XmlAttribute("standarddatetime")]
    public string? StandardDateTime { get; set; }

    // [XmlText]
    public string? Text { get; set; }
}

public class AgentType
{
    // [XmlAttribute("value")]
    public string? Value { get; set; }
}

public class ArchDesc
{
    // [XmlAttribute("level")]
    public required string Level { get; set; }

    // [XmlAttribute("localtype")]
    public string? LocalType { get; set; }

    // [XmlElement("did")]
    public required Did Did { get; set; }

    // [XmlElement("dsc")]
    public Dsc? Dsc { get; set; }
}

public class Did
{
    // [XmlElement("head")]
    public string? Head { get; set; }

    // [XmlElement("unittitle")]
    public required string UnitTitle { get; set; }

    // [XmlElement("unitid")]
    public required UnitId UnitId { get; set; }

    // [XmlElement("unitdate")]
    public UnitDate? UnitDate { get; set; }

    // [XmlElement("repository")]
    public Repository? Repository { get; set; }

    // [XmlElement("langmaterial")]
    public LangMaterial? LangMaterial { get; set; }

    // [XmlElement("origination")]
    public Origination? Origination { get; set; }

    // [XmlElement("abstract")]
    public Abstract? Abstract { get; set; }
}

public class UnitId
{
    // [XmlAttribute("identifier")]
    public string? Identifier { get; set; }

    // [XmlText]
    public string? Text { get; set; }
}

public class UnitDate
{
    // [XmlAttribute("calendar")]
    public string? Calendar { get; set; }

    // [XmlAttribute("era")]
    public string? Era { get; set; }

    // [XmlAttribute("normal")]
    public string? Normal { get; set; }

    // [XmlText]
    public string? Text { get; set; }
}

public class EadDate
{
    // [XmlAttribute("calendar")]
    public string? Calendar { get; set; }

    // [XmlAttribute("era")]
    public string? Era { get; set; }

    // [XmlAttribute("normal")]
    public string? Normal { get; set; }

    // [XmlText]
    public string? Text { get; set; }
}

public class Repository
{
    // [XmlElement("corpname")]
    public CorpName? CorpName { get; set; }
}

public class CorpName
{
    // [XmlAttribute("identifier")]
    public string? Identifier { get; set; }

    // [XmlAttribute("relator")]
    public string? Relator { get; set; }

    // [XmlAttribute("rules")]
    public string? Rules { get; set; }

    // [XmlElement("part")]
    public List<Part>? Parts { get; set; }

    // [XmlText]
    public string? Text { get; set; }
}

public class LangMaterial
{
    // [XmlElement("languageset")]
    public LanguageSet? LanguageSet { get; set; }
}

public class LanguageSet
{
    // [XmlElement("language")]
    public Language? Language { get; set; }

    // [XmlElement("script")]
    public Script? Script { get; set; }

    // [XmlElement("descriptivenote")]
    public DescriptiveNote? DescriptiveNote { get; set; }
}

public class Origination
{
    // [XmlElement("persname")]
    public PersName? PersName { get; set; }
}

public class PersName
{
    // [XmlAttribute("identifier")]
    public string? Identifier { get; set; }

    // [XmlAttribute("relator")]
    public string? Relator { get; set; }

    // [XmlAttribute("rules")]
    public string? Rules { get; set; }

    // [XmlElement("part")]
    public List<Part>? Parts { get; set; }
}

public class Part
{
    // [XmlAttribute("localtype")]
    public string? LocalType { get; set; }

    // [XmlAttribute("rules")]
    public string? Rules { get; set; }

    // [XmlAttribute("lang", Form = System.Xml.Schema.XmlSchemaForm.Qualified, Namespace = "http://www.w3.org/XML/1998/namespace")]
    public string? Lang { get; set; }

    // [XmlText]
    public string? Text { get; set; }
}

public class Abstract
{
    // [XmlAttribute("lang", Form = System.Xml.Schema.XmlSchemaForm.Qualified, Namespace = "http://www.w3.org/XML/1998/namespace")]
    public string? Lang { get; set; }

    // [XmlText]
    public string? Text { get; set; }
}

public class Dsc
{
    // [XmlAttribute("dsctype")]
    public string? DscType { get; set; }

    // [XmlElement("head")]
    public string? Head { get; set; }

    // [XmlElement("c")]
    public List<Component>? Components { get; set; }
}

public class Component
{
    // [XmlAttribute("level")]
    public string? Level { get; set; }

    // [XmlElement("did")]
    public required ComponentDid Did { get; set; }

    // [XmlElement("scopecontent")]
    public ScopeContent? ScopeContent { get; set; }
}

public class ComponentDid
{
    // [XmlElement("unitid")]
    public string? UnitId { get; set; }

    // [XmlElement("unittitle")]
    public UnitTitle? UnitTitle { get; set; }

    // [XmlElement("unitdate")]
    public UnitDate? UnitDate { get; set; }

    // [XmlElement("daoset")]
    public DaoSet? DaoSet { get; set; }
}

public class UnitTitle
{
    // [XmlAttribute("lang", Form = System.Xml.Schema.XmlSchemaForm.Qualified, Namespace = "http://www.w3.org/XML/1998/namespace")]
    public string? Lang { get; set; }

    // [XmlText]
    public string? Text { get; set; }

    // [XmlElement("genreform")]
    public GenreForm? GenreForm { get; set; }
}

public class GenreForm
{
    // [XmlElement("part")]
    public List<Part>? Parts { get; set; }
}

public class DaoSet
{
    // [XmlAttribute("coverage")]
    public string? Coverage { get; set; }

    // [XmlElement("dao")]
    public List<Dao>? Daos { get; set; }
}

public class Dao
{
    // [XmlAttribute("daotype")]
    public string? DaoType { get; set; }

    // [XmlAttribute("coverage")]
    public string? Coverage { get; set; }

    // [XmlAttribute("actuate")]
    public string? Actuate { get; set; }

    // [XmlAttribute("show")]
    public string? Show { get; set; }

    // [XmlAttribute("linktitle")]
    public string? LinkTitle { get; set; }

    // [XmlAttribute("localtype")]
    public string? LocalType { get; set; }

    // [XmlAttribute("href")]
    public string? Href { get; set; }
}

public class ScopeContent
{
    // [XmlElement("chronlist")]
    public ChronList? ChronList { get; set; }
}

public class ChronList
{
    // [XmlElement("chronitem")]
    public List<ChronItem>? ChronItems { get; set; }
}

public class ChronItem
{
    // [XmlElement("datesingle")]
    public DateSingle? DateSingle { get; set; }

    // [XmlElement("event")]
    public Event? Event { get; set; }
}

public class DateSingle
{
    // [XmlAttribute("standarddate")]
    public string? StandardDate { get; set; }

    // [XmlText]
    public string? Text { get; set; }
}

public class Event
{
    // [XmlAttribute("localtype")]
    public string? LocalType { get; set; }

    // [XmlElement("persname")]
    public List<PersName>? PersonNames { get; set; }

    // [XmlElement("corpname")]
    public List<CorpName>? CorporateNames { get; set; }

    // [XmlElement("geogname")]
    public List<GeogName>? GeographicNames { get; set; }

    // [XmlElement("subject")]
    public List<Subject>? Subjects { get; set; }
}

public class GeogName
{
    // [XmlAttribute("identifier")]
    public string? Identifier { get; set; }

    // [XmlElement("part")]
    public string? Part { get; set; }

    // [XmlElement("geographiccoordinates")]
    public GeographicCoordinates? GeographicCoordinates { get; set; }
}

public class GeographicCoordinates
{
    // [XmlAttribute("coordinatesystem")]
    public string? CoordinateSystem { get; set; }

    // [XmlText]
    public string? Text { get; set; }
}

public class Subject
{
    // [XmlElement("part")]
    public List<Part>? Parts { get; set; }
}
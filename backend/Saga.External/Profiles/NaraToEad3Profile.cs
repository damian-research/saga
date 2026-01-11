namespace Saga.External.Profiles;

public class NaraToEad3Profile : Profile
{
    public NaraToEad3Profile()
    {
        // Main mapping: NARA Response Hit → EAD3 Document
        CreateMap<Hit, Ead>()
            .ForMember(dest => dest.Control, opt => opt.MapFrom(src => src))
            .ForMember(dest => dest.ArchDesc, opt => opt.MapFrom(src => src.Source.Record));

        // Control section mapping
        CreateMap<Hit, Control>()
            .ForMember(dest => dest.RecordId, opt => opt.MapFrom(src => src.Source.Metadata.Uuid))
            .ForMember(dest => dest.FileDesc, opt => opt.MapFrom(src => src.Source))
            .ForMember(dest => dest.MaintenanceStatus, opt => opt.MapFrom(src => new MaintenanceStatus { Value = "derived" }))
            .ForMember(dest => dest.MaintenanceAgency, opt => opt.MapFrom(src => new MaintenanceAgency
            {
                AgencyCode = "US-DNA",
                AgencyName = "National Archives and Records Administration"
            }))
            .ForMember(dest => dest.MaintenanceHistory, opt => opt.MapFrom(src => src.Source.Metadata));

        CreateMap<Source, FileDesc>()
            .ForMember(dest => dest.TitleStmt, opt => opt.MapFrom(src => new TitleStmt
            {
                TitleProper = src.Metadata.FileName,
                Author = "NARA Digital Conversion"
            }))
            .ForMember(dest => dest.PublicationStmt, opt => opt.MapFrom(src => new PublicationStmt
            {
                Publisher = "National Archives and Records Administration",
                Date = new EadDate
                {
                    Text = DateTime.Parse(src.Metadata.IngestTime).ToString("yyyy-MM-dd"),
                    Normal = DateTime.Parse(src.Metadata.IngestTime).ToString("yyyy-MM-dd")
                }
            }));

        CreateMap<Metadata, MaintenanceHistory>()
            .ForMember(dest => dest.MaintenanceEvents, opt => opt.MapFrom(src => new List<MaintenanceEvent>
            {
                    new MaintenanceEvent
                    {
                        EventType = new EventType { Value = "created" },
                        EventDateTime = new EventDateTime
                        {
                            Text = DateTime.Parse(src.IngestTime).ToString("yyyy-MM-dd HH:mm:ss"),
                            StandardDateTime = DateTime.Parse(src.IngestTime).ToString("o")
                        },
                        AgentType = new AgentType { Value = "machine" },
                        Agent = "NARA Digital Archive System"
                    }
            }));

        // ArchDesc mapping
        CreateMap<Record, ArchDesc>()
            .ForMember(dest => dest.Level, opt => opt.MapFrom(src => src.LevelOfDescription))
            .ForMember(dest => dest.LocalType, opt => opt.MapFrom(src => src.RecordType))
            .ForMember(dest => dest.Did, opt => opt.MapFrom(src => src))
            .ForMember(dest => dest.Dsc, opt => opt.MapFrom(src => src));

        // Did (Descriptive Identification) mapping
        CreateMap<Record, Did>()
            .ForMember(dest => dest.UnitTitle, opt => opt.MapFrom(src => src.Title))
            .ForMember(dest => dest.UnitId, opt => opt.MapFrom(src => new UnitId
            {
                Text = src.NaId.ToString(),
                Identifier = $"nara:{src.NaId}"
            }))
            .ForMember(dest => dest.UnitDate, opt => opt.MapFrom(src => MapDateRange(src.CoverageStartDate, src.CoverageEndDate)))
            .ForMember(dest => dest.Repository, opt => opt.MapFrom(src => MapRepository(src.PhysicalOccurrences)))
            .ForMember(dest => dest.Origination, opt => opt.MapFrom(src => MapOrigination(src.Ancestors)))
            .ForMember(dest => dest.Abstract, opt => opt.MapFrom(src => new Abstract
            {
                Text = src.ScopeAndContentNote ?? string.Join("; ", src.GeneralNotes ?? new List<string>())
            }));

        // Dsc (Description of Subordinate Components) mapping
        CreateMap<Record, Dsc>()
            .ForMember(dest => dest.DscType, opt => opt.MapFrom(src => "combined"))
            .ForMember(dest => dest.Head, opt => opt.MapFrom(src => "Digital Objects and Components"))
            .ForMember(dest => dest.Components, opt => opt.MapFrom(src => MapComponents(src)));

        // Component mapping for digital objects
        CreateMap<DigitalObject, Component>()
            .ForMember(dest => dest.Level, opt => opt.MapFrom(src => "item"))
            .ForMember(dest => dest.Did, opt => opt.MapFrom(src => new ComponentDid
            {
                UnitId = src.ObjectId,
                UnitTitle = new UnitTitle { Text = src.ObjectDescription ?? src.ObjectFilename },
                DaoSet = new DaoSet
                {
                    Coverage = "whole",
                    Daos = new List<Dao>
                    {
                            new() {
                                Href = src.ObjectUrl,
                                LinkTitle = src.ObjectDesignator ?? src.ObjectDescription ?? "View Digital Object",
                                LocalType = src.ObjectType,
                                DaoType = "derived",
                                Show = "new",
                                Actuate = "onrequest"
                            }
                    }
                }
            }));
    }

    // ============================================================================
    // HELPER MAPPING METHODS
    // ============================================================================

    private static UnitDate MapDateRange(NaraDate start, NaraDate end)
    {
        if (start == null && end == null) return null;

        var startDate = start?.LogicalDate ?? "";
        var endDate = end?.LogicalDate ?? startDate;

        return new UnitDate
        {
            Normal = $"{startDate}/{endDate}",
            Text = FormatDateRange(start, end),
            Calendar = "gregorian",
            Era = "ce"
        };
    }

    private static string FormatDateRange(NaraDate start, NaraDate end)
    {
        if (start == null && end == null) return "";
        if (start == null) return end.LogicalDate;
        if (end == null) return start.LogicalDate;
        if (start.LogicalDate == end.LogicalDate) return start.LogicalDate;
        return $"{start.LogicalDate} - {end.LogicalDate}";
    }

    private static Repository MapRepository(List<PhysicalOccurrence> occurrences)
    {
        var firstUnit = occurrences?.FirstOrDefault()?.ReferenceUnits?.FirstOrDefault();
        if (firstUnit == null) return null;

        return new Repository
        {
            CorpName = new CorpName
            {
                Parts =
                    [
                        new Part { LocalType = "corpname", Text = firstUnit.Name }
                    ]
            }
        };
    }

    private static Origination MapOrigination(List<Ancestor> ancestors)
    {
        var creator = ancestors?
            .SelectMany(a => a.Creators ?? [])
            .FirstOrDefault(c => c.CreatorType == "Most Recent");

        if (creator == null) return null;

        return new Origination
        {
            PersName = new PersName
            {
                Identifier = creator.NaId.ToString(),
                Relator = "creator",
                Parts =
                    [
                        new Part { LocalType = "persname", Text = creator.Heading },
                        new Part { LocalType = "role", Text = creator.CreatorType },
                        new Part { LocalType = "dates", Text = $"{creator.EstablishDate?.LogicalDate} - {creator.AbolishDate?.LogicalDate ?? "present"}" }
                    ]
            }
        };
    }

    private static List<Component> MapComponents(Record record)
    {
        var components = new List<Component>();

        // Map digital objects as components
        if (record.DigitalObjects != null)
        {
            foreach (var digitalObj in record.DigitalObjects)
            {
                components.Add(new Component
                {
                    Level = "item",
                    Did = new ComponentDid
                    {
                        UnitId = digitalObj.ObjectId.ToString(),
                        UnitTitle = new UnitTitle
                        {
                            Text = digitalObj.ObjectDescription ?? digitalObj.FileName ?? "name not found",
                            GenreForm = new GenreForm
                            {
                                Parts =
                                    [
                                        new() { LocalType = "type_record", Text = digitalObj.ObjectType }
                                    ]
                            }
                        },
                        DaoSet = new DaoSet
                        {
                            Coverage = "whole",
                            Daos =
                                [
                                    new() {
                                        Href = digitalObj.ObjectUrl,
                                        LinkTitle = digitalObj.ObjectDescription ?? "View Digital Object",
                                        LocalType = digitalObj.ObjectType,
                                        DaoType = "derived",
                                        Show = "new",
                                        Actuate = "onrequest"
                                    }
                                ]
                        }
                    },
                    ScopeContent = new ScopeContent
                    {
                        ChronList = new ChronList
                        {
                            ChronItems =
                                [
                                    new() {
                                        DateSingle = new DateSingle
                                        {
                                            StandardDate = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                                            Text = "Digital object available"
                                        },
                                        Event = new Event
                                        {
                                            LocalType = "digital_object",
                                            Subjects =
                                            [
                                                new() {
                                                    Parts =
                                                    [
                                                        new Part { LocalType = "object", Text = digitalObj.FileName ?? "name not found", }
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                ]
                        }
                    }
                });
            }
        }

        return components;
    }
}
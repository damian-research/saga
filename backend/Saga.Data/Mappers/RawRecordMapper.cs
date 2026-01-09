namespace Saga.Data.Mappers;

public static class RawRecordMapper
{
    public static RawRecord FromProxyHit(JsonElement hit)
    {
        // _source.record
        var record = hit.GetProperty("_source").GetProperty("record");

        var level = ParseLevel(record.GetProperty("levelOfDescription").GetString());
        var ancestors = ParseAncestors(record);
        var materialType = ParseGeneralRecordsTypes(record);
        var sourceReference = ParseSourceReference(record);
        var description = record.TryGetProperty("scopeAndContentNote", out var descProp)
            ? descProp.GetString()
            : null;

        var model = new RawRecord
        {
            NaId = record.GetProperty("naId").GetInt64(),
            Title = record.GetProperty("title").GetString() ?? string.Empty,
            LevelDescription = GetLevelDescription(level),
            MaterialType = materialType,
            SourceReference = sourceReference,
            Description = description,
            Ancestors = ancestors,
            Path = BuildPath(ancestors, level, record),
            TotalDigitalObjects = ParseTotalDigitalObjects(hit),
            FirstDigitalObject = ParseFirstDigitalObject(hit)
        };

        return model;
    }

    private static List<Ancestor> ParseAncestors(JsonElement record)
    {
        var list = new List<Ancestor>();

        if (!record.TryGetProperty("ancestors", out var ancestors) || ancestors.ValueKind != JsonValueKind.Array)
            return list;

        foreach (var a in ancestors.EnumerateArray())
        {
            var level = ParseLevel(a.GetProperty("levelOfDescription").GetString());

            var ancestor = new Ancestor
            {
                NaId = a.GetProperty("naId").GetInt64(),
                Title = a.GetProperty("title").GetString() ?? string.Empty,
                Distance = (short)a.GetProperty("distance").GetInt32(),
                Level = level
            };

            if (level == LevelOfDescription.RecordGroup &&
                a.TryGetProperty("recordGroupNumber", out var rgProp))
            {
                ancestor.RecordGroupNumber = rgProp.GetInt32();
            }

            list.Add(ancestor);
        }

        return list;
    }

    private static List<PathSegment> BuildPath(
        List<Ancestor> ancestors,
        LevelOfDescription currentLevel,
        JsonElement record)
    {
        var path = new List<PathSegment>();

        // ancestors only (excluding current record)
        foreach (var a in ancestors)
        {
            if (a.Level == LevelOfDescription.RecordGroup)
            {
                path.Add(new PathSegment
                {
                    SegmentType = LevelOfDescription.RecordGroup,
                    NaId = a.NaId,
                    Label = a.RecordGroupNumber.HasValue
                        ? $"RG# {a.RecordGroupNumber.Value}({a.NaId})"
                        : $"RG({a.NaId})"
                });
            }
            else
            {
                path.Add(new PathSegment
                {
                    SegmentType = a.Level,
                    NaId = a.NaId,
                    Label = $"{LevelShort(a.Level)} {a.NaId}"
                });
            }
        }

        return path;
    }

    private static string LevelShort(LevelOfDescription lvl)
    {
        return lvl switch
        {
            LevelOfDescription.RecordGroup => "RG",
            LevelOfDescription.Series => "Series",
            LevelOfDescription.FileUnit => "FileUnit",
            LevelOfDescription.Item => "Item",
            _ => "?"
        };
    }

    private static int ParseTotalDigitalObjects(JsonElement hit)
    {
        // 1. Preferred: abbreviated search results (aggregated, fast)
        if (hit.TryGetProperty("fields", out var fields) &&
            fields.TryGetProperty("totalDigitalObjects", out var arr) &&
            arr.ValueKind == JsonValueKind.Array &&
            arr.GetArrayLength() > 0)
        {
            var value = arr[0].GetInt32();
            if (value > 0)
                return value;
        }

        // 2. Fallback: full record digitalObjects array (exact)
        if (hit.TryGetProperty("_source", out var source) &&
            source.TryGetProperty("record", out var record) &&
            record.TryGetProperty("digitalObjects", out var digitalObjects) &&
            digitalObjects.ValueKind == JsonValueKind.Array)
        {
            return digitalObjects.GetArrayLength();
        }

        return 0;
    }

    private static DigitalObject? ParseFirstDigitalObject(JsonElement hit)
    {
        if (!hit.TryGetProperty("fields", out var fields))
            return null;

        if (!fields.TryGetProperty("firstDigitalObject", out var arr))
            return null;

        if (arr.ValueKind != JsonValueKind.Array || arr.GetArrayLength() == 0)
            return null;

        var o = arr[0];

        if (o.ValueKind != JsonValueKind.Object)
            return null;

        if (!o.TryGetProperty("objectUrl", out var urlProp))
            return null;

        return new DigitalObject
        {
            ObjectUrl = urlProp.GetString() ?? string.Empty,
            ObjectType = o.TryGetProperty("objectType", out var typeProp)
                ? typeProp.GetString() ?? string.Empty
                : string.Empty
        };
    }

    private static LevelOfDescription ParseLevel(string? value)
    {
        return value?.ToLowerInvariant() switch
        {
            "recordgroup" => LevelOfDescription.RecordGroup,
            "series" => LevelOfDescription.Series,
            "fileunit" => LevelOfDescription.FileUnit,
            "item" => LevelOfDescription.Item,
            _ => LevelOfDescription.FileUnit
        };
    }

    private static string GetLevelDescription(LevelOfDescription level)
    {
        return level switch
        {
            LevelOfDescription.RecordGroup => "Record Group",
            LevelOfDescription.Series => "Series",
            LevelOfDescription.FileUnit => "File Unit",
            LevelOfDescription.Item => "Item",
            _ => level.ToString()
        };
    }

    private static string? ParseGeneralRecordsTypes(JsonElement record)
    {
        if (!record.TryGetProperty("generalRecordsTypes", out var typesArr))
            return null;

        if (typesArr.ValueKind != JsonValueKind.Array || typesArr.GetArrayLength() == 0)
            return null;

        // Get the first general record type
        var firstType = typesArr[0];
        return firstType.GetString();
    }

    private static string? ParseSourceReference(JsonElement record)
    {
        if (!record.TryGetProperty("physicalOccurrences", out var occurrences))
            return null;

        if (occurrences.ValueKind != JsonValueKind.Array || occurrences.GetArrayLength() == 0)
            return null;

        var firstOccurrence = occurrences[0];

        if (!firstOccurrence.TryGetProperty("mediaOccurrences", out var mediaOccurrences))
            return null;

        if (mediaOccurrences.ValueKind != JsonValueKind.Array || mediaOccurrences.GetArrayLength() == 0)
            return null;

        var firstMedia = mediaOccurrences[0];

        if (!firstMedia.TryGetProperty("specificMediaType", out var specificType))
            return null;

        return specificType.GetString();
    }
}
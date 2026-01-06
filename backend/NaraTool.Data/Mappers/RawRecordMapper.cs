namespace NaraTool.Data.Mappers;

public static class RawRecordMapper
{
    public static RawRecord FromProxyHit(JsonElement hit)
    {
        // _source.record
        var record = hit.GetProperty("_source").GetProperty("record");

        var level = ParseLevel(record.GetProperty("levelOfDescription").GetString());
        var ancestors = ParseAncestors(record);

        var model = new RawRecord
        {
            NaId = record.GetProperty("naId").GetInt64(),
            Title = record.GetProperty("title").GetString() ?? string.Empty,
            Level = level,
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

        // ancestors first (already parents only)
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

        // current record always last
        path.Add(new PathSegment
        {
            SegmentType = currentLevel,
            NaId = record.GetProperty("naId").GetInt64(),
            Label = $"{LevelShort(currentLevel)} {record.GetProperty("naId").GetInt64()}"
        });

        return path;
    }

    private static string LevelShort(LevelOfDescription lvl)
    {
        return lvl switch
        {
            LevelOfDescription.RecordGroup => "RG",
            LevelOfDescription.Series => "S",
            LevelOfDescription.FileUnit => "FU",
            LevelOfDescription.Item => "I",
            _ => "?"
        };
    }

    private static int ParseTotalDigitalObjects(JsonElement hit)
    {
        if (!hit.TryGetProperty("fields", out var fields))
            return 0;

        if (!fields.TryGetProperty("totalDigitalObjects", out var arr) || arr.ValueKind != JsonValueKind.Array)
            return 0;

        return arr.GetArrayLength() > 0 ? arr[0].GetInt32() : 0;
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
}
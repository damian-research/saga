namespace NaraTool.Data.Mappers;

public static class RawRecordMapper
{
    public static RawRecord FromProxyHit(JsonElement hit)
    {
        // _source.record
        var record = hit.GetProperty("_source").GetProperty("record");

        var model = new RawRecord
        {
            NaId = record.GetProperty("naId").GetInt64(),
            Title = record.GetProperty("title").GetString() ?? string.Empty,
            Level = ParseLevel(record.GetProperty("levelOfDescription").GetString()),
            Ancestors = ParseAncestors(record),
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
            list.Add(new Ancestor
            {
                NaId = a.GetProperty("naId").GetInt64(),
                Title = a.GetProperty("title").GetString() ?? string.Empty,
                Distance = (short)a.GetProperty("distance").GetInt32(),
                Level = ParseLevel(a.GetProperty("levelOfDescription").GetString())
            });
        }

        return list;
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

        if (!fields.TryGetProperty("firstDigitalObject", out var arr) || arr.ValueKind != JsonValueKind.Array)
            return null;

        if (arr.GetArrayLength() == 0)
            return null;

        var o = arr[0];

        return new DigitalObject
        {
            ObjectUrl = o.GetProperty("objectUrl").GetString() ?? string.Empty,
            ObjectType = o.GetProperty("objectType").GetString() ?? string.Empty
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
namespace Saga.Data.Mappers;

public static class RawFullRecordMapper
{
    public static RawFullRecord FromJson(string json)
    {
        using var doc = JsonDocument.Parse(json);

        var root = doc.RootElement;

        if (!root.TryGetProperty("body", out var body))
            throw new InvalidOperationException("Missing body in NARA search response");

        if (!body.TryGetProperty("hits", out var hits))
            throw new InvalidOperationException("Missing hits in NARA search response");

        if (!hits.TryGetProperty("hits", out var hitArray) || hitArray.GetArrayLength() == 0)
            throw new InvalidOperationException("No records found in NARA search response");

        var hit = hitArray[0];

        if (!hit.TryGetProperty("_source", out var source))
            throw new InvalidOperationException("Missing _source in NARA search hit");

        if (!source.TryGetProperty("record", out var record))
            throw new InvalidOperationException("Missing record in NARA search hit");

        var model = new RawFullRecord
        {
            NaId = record.GetProperty("naId").GetInt64(),
            Title = record.GetProperty("title").GetString() ?? string.Empty,
            Ancestors = ParseAncestors(record),
            DigitalObjects = ParseDigitalObjects(record)
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

    private static List<DigitalObject> ParseDigitalObjects(JsonElement record)
    {
        var list = new List<DigitalObject>();

        if (!record.TryGetProperty("digitalObjects", out var objects) || objects.ValueKind != JsonValueKind.Array)
            return list;

        foreach (var o in objects.EnumerateArray())
        {
            var url = o.GetProperty("objectUrl").GetString();
            if (string.IsNullOrWhiteSpace(url))
                continue;

            list.Add(new DigitalObject
            {
                ObjectUrl = url,
                ObjectType = o.TryGetProperty("objectType", out var t)
                    ? t.GetString() ?? string.Empty
                    : string.Empty
            });
        }

        return list;
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
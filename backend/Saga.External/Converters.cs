namespace Saga.External;

public class StringToIntConverter : JsonConverter<int>
{
    public override int Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.Null)
            return default;

        if (reader.TokenType == JsonTokenType.String)
        {
            var s = reader.GetString();
            if (string.IsNullOrWhiteSpace(s))
                return default;

            if (int.TryParse(s, NumberStyles.Integer, CultureInfo.InvariantCulture, out var value))
                return value;

            return default;
        }

        if (reader.TokenType == JsonTokenType.Number)
            return reader.GetInt32();

        return default;
    }

    public override void Write(Utf8JsonWriter writer, int value, JsonSerializerOptions options)
    {
        writer.WriteNumberValue(value);
    }
}

public class StringToLongConverter : JsonConverter<long>
{
    public override long Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.Null)
            return default;

        if (reader.TokenType == JsonTokenType.String)
        {
            var s = reader.GetString();
            if (string.IsNullOrWhiteSpace(s))
                return default;

            if (long.TryParse(s, NumberStyles.Integer, CultureInfo.InvariantCulture, out var value))
                return value;

            return default;
        }

        if (reader.TokenType == JsonTokenType.Number)
            return reader.GetInt64();

        return default;
    }

    public override void Write(Utf8JsonWriter writer, long value, JsonSerializerOptions options)
    {
        writer.WriteNumberValue(value);
    }
}

public static class JsonConverter
{
    public static NaraResponse ConvertToNara(string json)
    {
        if (string.IsNullOrWhiteSpace(json))
            throw new ArgumentException("JSON input is null or empty.", nameof(json));

        return JsonSerializer.Deserialize<NaraResponse>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            Converters =
            {
                new StringToIntConverter(),
                new StringToLongConverter()
            }
        }) ?? throw new JsonException("Failed to deserialize NARA response.");
    }
}
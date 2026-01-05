namespace NaraTool.Services.Services;

public class QueryService(INaraClient client)
{
    private readonly INaraClient _client = client;

    public async Task<string> ExecuteAsync(string query)
    {
        var raw = await _client.SearchAsync(query);

        // tu kiedyś: transformacje
        return raw;
    }
}
namespace Saga.Services.Services;

public class NaraQueryService(INaraClient source)
{
    private readonly INaraClient _client = source;

    // BRIEF
    public Task<IEnumerable<RawRecord>> SearchBriefAsync(string query)
        => _client.SearchBriefAsync(query);

    // FULL
    public Task<RawFullRecord> GetFullAsync(long naId)
        => _client.GetFullAsync(naId);
}
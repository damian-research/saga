namespace Saga.Services.Services;

public class UknaQueryService(IUknaClient source)
{
    private readonly IUknaClient _client = source;

    public Task<IReadOnlyList<UknaSearchRecord>> SearchAsync(UknaSearchParams queryParams)
        => _client.SearchAsync(queryParams);

    public Task<UknaItemPreview?> GetItemAsync(string cid)
        => _client.GetItemAsync(cid);
}
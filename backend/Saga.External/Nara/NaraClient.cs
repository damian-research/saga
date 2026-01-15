namespace Saga.External.Nara;

public sealed class NaraClientWithMapper : INaraClient
{
    private readonly HttpClient _http;
    private readonly bool _useMock;
    private readonly INaraToEad3Mapper _mapper;

    public NaraClientWithMapper(IOptions<SagaSettings> options, INaraToEad3Mapper mapper)
    {
        var cfg = options.Value;
        _useMock = cfg.UseMock;
        _mapper = mapper;

        _http = new HttpClient
        {
            BaseAddress = new Uri(cfg.BaseUrl),
            Timeout = TimeSpan.FromSeconds(cfg.TimeoutSeconds)
        };

        _http.DefaultRequestHeaders.Add("x-api-key", cfg.ApiKey);
        _http.DefaultRequestHeaders.Add("Accept", "application/json");
    }

    public async Task<IEnumerable<Ead>> SearchAndMapToEad3Async(string rawQuery)
    {
        string? json = _useMock ? await GetMockJsonAsync(rawQuery) : await GetJsonResponseAsync(rawQuery);

        var naraResponse = JsonConverter.ConvertToNara(json);

        var eads = _mapper.MapMultipleToEad3(naraResponse);

        // Debug logs
        // var naraResponseJson = JsonSerializer.Serialize(naraResponse, JsonConverter.JsonOptionWriteIntended);
        // var eadJson = JsonSerializer.Serialize(eads, JsonConverter.JsonOptionWriteIntended);

        return eads;
    }

    public async Task<Ead> GetFullAndMapToEad3Async(long naId)
    {
        var url = $"records/search?q=record.naId:{naId}&limit=1";

        var json = await GetJsonResponseAsync(url);

        var naraResponse = JsonConverter.ConvertToNara(json);

        var ead = _mapper.MapToEad3(naraResponse);

        // Debug logs
        // var naraResponseJson = JsonSerializer.Serialize(naraResponse, JsonConverter.JsonOptionWriteIntended));
        // var eadJson = JsonSerializer.Serialize(ead, JsonConverter.JsonOptionWriteIntended);

        return ead;
    }

    public async Task<List<Ead>> GetChildrenAndMapToEad3Async(long parentId, int limit)
    {
        var url = $"records/parentNaId/{parentId}?limit={limit}";
        // var url = $"records/search?q=*&controlGroup={parentId}&limit={limit}";

        var json = await GetJsonResponseAsync(url);

        var naraResponse = JsonConverter.ConvertToNara(json);

        var eads = _mapper.MapMultipleToEad3(naraResponse);

        // Debug logs
        // var naraResponseJson = JsonSerializer.Serialize(naraResponse, JsonConverter.JsonOptionWriteIntended);
        // var eadJson = JsonSerializer.Serialize(eads, JsonConverter.JsonOptionWriteIntended);

        return [.. eads];
    }

    private async Task<string> GetJsonResponseAsync(string queryOrUrl)
    {
        var url = queryOrUrl.StartsWith("records/")
            ? queryOrUrl
            : $"records/search{queryOrUrl}";

        var sw = Stopwatch.StartNew();
        var res = await _http.GetAsync(url);
        sw.Stop();

        Console.WriteLine($"[NARA] Request took {sw.ElapsedMilliseconds} ms | URL: {url}");
        res.EnsureSuccessStatusCode();

        return await res.Content.ReadAsStringAsync();
    }

    private static async Task<string> GetMockJsonAsync(string rawQuery)
    {
        string mockFilePath = rawQuery.Contains("=1") ? "nara_response_1_rg.json"
            : rawQuery.Contains("=2") ? "nara_response_2_s.json"
            : rawQuery.Contains("=3") ? "nara_response_3_fu.json"
            : "nara_response_4_item.json";

        mockFilePath = Path.Combine("Mocks", mockFilePath);
        Console.WriteLine($"[NARA] Using MOCK data from {mockFilePath}");

        return await File.ReadAllTextAsync(mockFilePath);
    }
}

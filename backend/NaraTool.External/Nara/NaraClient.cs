namespace NaraTool.External.Nara;

public sealed class NaraClient : INaraClient
{
    private readonly HttpClient _http;

    public NaraClient(HttpClient http, IOptions<NaraSettings> options)
    {
        var cfg = options.Value;

        _http = http;
        _http.BaseAddress = new Uri(cfg.BaseUrl);
        _http.Timeout = TimeSpan.FromSeconds(cfg.TimeoutSeconds);

        _http.DefaultRequestHeaders.Accept.Add(
            new MediaTypeWithQualityHeaderValue("application/json")
        );

        _http.DefaultRequestHeaders.Add("x-api-key", cfg.ApiKey);
    }

    public async Task<IEnumerable<RawRecord>> SearchBriefAsync(string query)
    {
        var url = $"proxy/records/search?q={Uri.EscapeDataString(query)}&abbreviated=true";
        var res = await _http.GetAsync(url);

        res.EnsureSuccessStatusCode();

        var json = await res.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);

        var hits = doc.RootElement
            .GetProperty("body")
            .GetProperty("hits")
            .GetProperty("hits");

        var results = new List<RawRecord>();
        foreach (var hit in hits.EnumerateArray())
        {
            results.Add(RawRecordMapper.FromProxyHit(hit));
        }

        return results;
    }

    public async Task<RawFullRecord> GetFullAsync(long naId)
    {
        var url = $"records/{naId}";
        var res = await _http.GetAsync(url);

        res.EnsureSuccessStatusCode();

        var json = await res.Content.ReadAsStringAsync();
        return RawFullRecordMapper.FromJson(json);
    }
}
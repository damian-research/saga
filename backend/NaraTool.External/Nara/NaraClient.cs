namespace NaraTool.External.Nara;

public sealed class NaraClient : INaraClient
{
    private readonly HttpClient _http;

    public NaraClient(IOptions<NaraSettings> options)
    {
        var cfg = options.Value;

        _http = new HttpClient
        {
            BaseAddress = new Uri(cfg.BaseUrl),
            Timeout = TimeSpan.FromSeconds(cfg.TimeoutSeconds)
        };

        _http.DefaultRequestHeaders.Add("x-api-key", cfg.ApiKey);
        _http.DefaultRequestHeaders.Add("Accept", "application/json");
    }

    public async Task<IEnumerable<RawRecord>> SearchBriefAsync(string rawQuery)
    {
        var url = $"https://catalog.archives.gov/proxy/records/search{rawQuery}" +
            (rawQuery.Contains("abbreviated=") ? string.Empty : "&abbreviated=true");

        var sw = Stopwatch.StartNew();
        var res = await _http.GetAsync(url);
        sw.Stop();
        Console.WriteLine($"[NARA] SearchBriefAsync took {sw.ElapsedMilliseconds} ms | URL: {url}");


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
        var url =
            $"records/search" +
            $"?q=record.naId:{naId}" +
            $"&limit=1";

        var res = await _http.GetAsync(url);
        res.EnsureSuccessStatusCode();

        var json = await res.Content.ReadAsStringAsync();
        return RawFullRecordMapper.FromJson(json);
    }
}
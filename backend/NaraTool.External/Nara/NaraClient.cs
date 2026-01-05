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

    public async Task<string> SearchAsync(string query)
    {
        var url = $"records/search?q={Uri.EscapeDataString(query)}";
        var res = await _http.GetAsync(url);

        res.EnsureSuccessStatusCode();

        var ct = res.Content.Headers.ContentType?.MediaType;
        if (ct is null || !ct.Contains("json"))
        {
            throw new InvalidOperationException("NARA returned non-JSON response");
        }

        return await res.Content.ReadAsStringAsync();
    }
}
namespace Saga.External.UKNA;

public sealed class UknaClient : IUknaClient
{
    private readonly HttpClient _http;

    public UknaClient(HttpClient http)
    {
        _http = http;
    }

    public async Task<IReadOnlyList<UknaSearchRecord>> SearchAsync(UknaSearchParams queryParams)
    {
        var url = BuildSearchUrl(queryParams);

        var html = await _http.GetStringAsync(url);

        return ParseSearchResults(html);
    }

    public async Task<UknaItemPreview?> GetItemAsync(string cid)
    {
        var url = $"https://discovery.nationalarchives.gov.uk/details/r/{cid}";
        var html = await _http.GetStringAsync(url);

        return ParseItemPreview(html, cid);
    }

    // ------------------------
    // URL construction
    // ------------------------

    private static string BuildSearchUrl(UknaSearchParams p)
    {
        var qs = new List<string>
        {
            "_ep=" + Uri.EscapeDataString(string.IsNullOrWhiteSpace(p.Q) ? "crossbow" : p.Q),
            "_col=200",
            "_dss=range",
            "_hb=tna",
            "_st=adv"
        };

        if (p.Levels is { Count: > 0 })
            qs.Add("_l=" + string.Join("|", p.Levels));

        if (p.OnlyOnline)
            qs.Add("_ro=any");

        if (p.DateFrom.HasValue)
            qs.Add("_p=" + p.DateFrom.Value);

        if (!string.IsNullOrWhiteSpace(p.Department))
            qs.Add("_d=" + p.Department);

        return "https://discovery.nationalarchives.gov.uk/results/r?" + string.Join("&", qs);
    }

    // ------------------------
    // HTML parsing – search
    // ------------------------

    private static IReadOnlyList<UknaSearchRecord> ParseSearchResults(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);

        var results = new List<UknaSearchRecord>();

        var nodes = doc.DocumentNode.SelectNodes("//li[contains(@class,'result')]")
                    ?? Enumerable.Empty<HtmlNode>();

        foreach (var node in nodes)
        {
            var link = node.SelectSingleNode(".//a");
            var href = link?.GetAttributeValue("href", null);

            if (href == null)
                continue;

            var idMatch = Regex.Match(href, @"\/(C\d+)");
            if (!idMatch.Success)
                continue;

            var title = link.InnerText.Trim();

            var level = DetectLevel(node);
            if (level is null or > 3)
                continue; // enforce L1–L3 search rule

            results.Add(new UknaSearchRecord
            {
                Id = idMatch.Groups[1].Value,
                Title = title,
                Level = level.Value
            });
        }

        return results;
    }

    private static int? DetectLevel(HtmlNode node)
    {
        var text = node.InnerText;

        if (text.Contains("Department", StringComparison.OrdinalIgnoreCase))
            return 1;
        if (text.Contains("Division", StringComparison.OrdinalIgnoreCase))
            return 2;
        if (text.Contains("Series", StringComparison.OrdinalIgnoreCase))
            return 3;
        if (text.Contains("Piece", StringComparison.OrdinalIgnoreCase))
            return 4;
        if (text.Contains("Item", StringComparison.OrdinalIgnoreCase))
            return 5;

        return null;
    }

    // ------------------------
    // HTML parsing – item
    // ------------------------

    private static UknaItemPreview? ParseItemPreview(string html, string cid)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);

        var previewSection =
            doc.DocumentNode.SelectSingleNode("//section[contains(@class,'record-preview')]");

        if (previewSection == null)
            return null;

        var title =
            doc.DocumentNode.SelectSingleNode("//h1")?.InnerText.Trim()
            ?? cid;

        var imageUrl = previewSection
            .SelectSingleNode(".//img")
            ?.GetAttributeValue("src", null);

        if (string.IsNullOrWhiteSpace(imageUrl))
            return null;

        return new UknaItemPreview
        {
            Id = cid,
            Source = "UKNA",
            Title = title,
            ObjectType = "Image",
            ObjectUrl = imageUrl
        };
    }
}
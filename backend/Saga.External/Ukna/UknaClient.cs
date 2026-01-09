namespace Saga.External.UKNA;

public sealed partial class UknaClient(HttpClient http) : IUknaClient
{
    private readonly HttpClient _http = http;

    public async Task<List<UknaSearchRecord>> SearchAsync(UknaSearchParams queryParams)
    {
        var url = BuildSearchUrl(queryParams);

        var html = await _http.GetStringAsync(url);

        return ParseSearchResults(html);
    }

    public async Task<UknaItemDetails?> GetItemAsync(string cid)
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
            "_col=15",
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

    private static List<UknaSearchRecord> ParseSearchResults(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);

        var results = new List<UknaSearchRecord>();

        var resultsRoot = doc.DocumentNode
            .SelectSingleNode("//ul[@id='search-results']");

        if (resultsRoot == null)
            return [];

        var nodes = resultsRoot.SelectNodes("./li[contains(@class,'tna-result')]");

        foreach (var node in nodes)
        {
            var link = node.SelectSingleNode(".//a");
            var href = link?.GetAttributeValue("href", null);
            if (href == null)
                continue;

            var idMatch = MyRegex().Match(href);
            if (!idMatch.Success)
                continue;

            var title = node.SelectSingleNode(".//h3")?.InnerText.Trim();
            var summary = node.SelectSingleNode(".//p")?.InnerText.Trim();

            var reference = GetRow(node, "Reference");
            var date = GetRow(node, "Date");
            var heldBy = GetRow(node, "Held by");

            var subjectsRaw = GetRow(node, "Subjects");
            var subjects = subjectsRaw?
                .Split('|')
                .Select(s => s.Trim())
                .Where(s => s.Length > 0)
                .ToList()
                ?? [];

            results.Add(new UknaSearchRecord
            {
                Id = idMatch.Groups[1].Value,
                Title = title,
                Summary = summary,
                Reference = reference,
                Date = date,
                HeldBy = heldBy,
                Subjects = subjects,
                Level = 0 // or null
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

    private static string? GetRow(HtmlNode node, string label)
    {
        return node
          .SelectSingleNode($".//tr[th[contains(normalize-space(), '{label}')]]/td")
          ?.InnerText
          .Trim();
    }

    // ------------------------
    // HTML parsing – item
    // ------------------------

    private static UknaItemDetails? ParseItemPreview(string html, string cid)
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

        return new UknaItemDetails
        {
            Id = cid,
            Source = "UKNA",
            Title = title,
            ObjectType = "Image",
            ObjectUrl = imageUrl
        };
    }

    [GeneratedRegex(@"\/details\/r\/(C\d+)")]
    private static partial Regex MyRegex();
}
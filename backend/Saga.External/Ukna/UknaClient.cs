namespace Saga.External.UKNA;

public sealed partial class UknaClient(HttpClient http) : IUknaClient
{
    private readonly HttpClient _http = http;

    public async Task<List<UknaSearchRecord>> SearchAsync(UknaSearchParams queryParams)
    {
        var url = BuildSearchUrl(queryParams);

        using var response = await _http.GetAsync(url);

        var status = response.StatusCode;
        var headers = response.Headers;
        var contentHeaders = response.Content.Headers;

        var html = await response.Content.ReadAsStringAsync();

        if (html == "")
        {
            Console.WriteLine($"[UKNA] URL: {url}");
            Console.WriteLine($"[UKNA] Status: {(int)status} {status}");
            Console.WriteLine($"[UKNA] Content-Type: {contentHeaders.ContentType}");
            Console.WriteLine($"[UKNA] Content-Length: {html.Length}");
            Console.WriteLine($"[UKNA] Headers: {string.Join(", ", headers.Select(h => h.Key))}");
            Console.WriteLine($"[UKNA] Body preview:\n{html[..Math.Min(800, html.Length)]}");
        }

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

        var title =
            doc.DocumentNode.SelectSingleNode("//h1")?.InnerText.Trim()
            ?? cid;

        // ------------------------
        // Parse hierarchy (breadcrumb)
        // ------------------------

        var path = new List<UknaPathNode>();

        var hierarchyRoot = doc.DocumentNode
       .SelectSingleNode("//div[@id='hierarchy']//ul");

        if (hierarchyRoot != null)
        {
            foreach (var li in hierarchyRoot.SelectNodes("./li") ?? Enumerable.Empty<HtmlNode>())
            {
                var a = li.SelectSingleNode(".//a");
                if (a == null) continue;

                path.Add(new UknaPathNode
                {
                    Title = HtmlEntity.DeEntitize(a.InnerText.Trim()),
                    Reference = ExtractReference(a.InnerText),
                    Level = MapUknaLevel(a.InnerText)
                });
            }
        }

        // ------------------------
        // Parse preview image
        // ------------------------
        var previewAnchor =
            doc.DocumentNode.SelectSingleNode("//a[@id='imageViewerLink']");

        var hasPreview = previewAnchor != null;

        var detailsUrl = $"https://discovery.nationalarchives.gov.uk/details/r/{cid}";

        string? previewUrl = hasPreview
            ? $"{detailsUrl}#imageViewerLink"
            : null;

        return new UknaItemDetails
        {
            Id = cid,
            Title = title,
            DetailsUrl = detailsUrl,

            HasPreview = hasPreview,
            PreviewUrl = previewUrl,

            Path = path
        };
    }

    private static int GuessLevelFromText(string text)
    {
        if (text.StartsWith("CAB ", StringComparison.OrdinalIgnoreCase))
            return 3; // Series
        if (text.Contains('/'))
            return 6; // Piece
        return 7;     // Item (fallback)
    }

    private static string? ExtractReference(string text)
    {
        // Matches things like "CAB 79", "CAB 79/76"
        var match = MyRegex1().Match(text);
        return match.Success ? match.Value.Trim() : null;
    }

    [GeneratedRegex(@"\/details\/r\/(C\d+)")]
    private static partial Regex MyRegex();

    [GeneratedRegex(@"^[A-Z]{2,5}\s+\d+(\s*/\s*\d+)?")]
    private static partial Regex MyRegex1();

    private static int MapUknaLevel(string text)
    {
        // Department
        if (text.Contains("Records of", StringComparison.OrdinalIgnoreCase))
            return 1;

        // Series (e.g. "CAB 79 - ...")
        if (MyRegex3().IsMatch(text))
            return 3;

        // Piece (e.g. "CAB 79/76 - ...")
        if (MyRegex2().IsMatch(text))
            return 6;

        // Item (fallback)
        return 7;
    }

    [GeneratedRegex(@"^[A-Z]{2,5}\s+\d+/\d+")]
    private static partial Regex MyRegex2();

    [GeneratedRegex(@"^[A-Z]{2,5}\s+\d+\s+-")]
    private static partial Regex MyRegex3();
}
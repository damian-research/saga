namespace Saga.Services.Services;

public class DownloadService(HttpClient http)
{
    private readonly HttpClient _http = http;

    // PLAN: build list of URLs from EAD3 record (pure)
    public static IReadOnlyList<string> BuildPlan(Ead ead3Record)
    {
        var urls = new List<string>();

        // Extract URLs from DaoSet in components
        if (ead3Record?.ArchDesc?.Dsc?.Components != null)
        {
            foreach (var component in ead3Record.ArchDesc.Dsc.Components)
            {
                if (component?.Did?.DaoSet?.Daos != null)
                {
                    foreach (var dao in component.Did.DaoSet.Daos)
                    {
                        if (!string.IsNullOrWhiteSpace(dao.Href))
                        {
                            urls.Add(dao.Href);
                        }
                    }
                }
            }
        }

        return [.. urls.Distinct()];
    }

    // EXECUTE: download files idempotently
    public async Task DownloadAsync(IEnumerable<string> urls, string targetDirectory, CancellationToken ct = default)
    {
        Directory.CreateDirectory(targetDirectory);

        foreach (var url in urls)
        {
            ct.ThrowIfCancellationRequested();

            if (!Uri.TryCreate(url, UriKind.Absolute, out var uri))
                continue;

            var fileName = Path.GetFileName(uri.AbsolutePath);
            if (string.IsNullOrWhiteSpace(fileName))
                continue;

            var filePath = Path.Combine(targetDirectory, fileName);
            if (File.Exists(filePath))
                continue;

            using var response = await _http.GetAsync(uri, HttpCompletionOption.ResponseHeadersRead, ct);
            response.EnsureSuccessStatusCode();

            await using var input = await response.Content.ReadAsStreamAsync(ct);
            await using var output = File.Create(filePath);
            await input.CopyToAsync(output, ct);
        }
    }
}
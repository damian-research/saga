namespace NaraTool.Api.Controllers;

[ApiController]
[Route("api/query")]
public class QueryController(QueryService service, DownloadService downloadService) : ControllerBase
{
    private readonly QueryService _service = service;
    private readonly DownloadService _downloadService = downloadService;

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string q)
    {
        var results = await _service.SearchBriefAsync(q);
        return Ok(results);
    }

    [HttpGet("full/{naId:long}")]
    public async Task<IActionResult> GetFull(long naId)
    {
        var result = await _service.GetFullAsync(naId);
        return Ok(result);
    }

    [HttpPost("download/{naId:long}")]
    public async Task<IActionResult> Download(long naId, [FromQuery] string? dir = null, CancellationToken ct = default)
    {
        var full = await _service.GetFullAsync(naId);

        var urls = DownloadService.BuildPlan(full);

        // var urls = new List<string>()
        // {
        //     "https://s3.amazonaws.com/NARAprodstorage/lz/microfilm-publications/M1935-ConCampFlossenburg_1938-1945/M1935_0001/M1935_0001/images/0020b.jpg",
        //     "https://s3.amazonaws.com/NARAprodstorage/lz/microfilm-publications/M1935-ConCampFlossenburg_1938-1945/M1935_0001/M1935_0001/images/0021a.jpg"
        // };

        var targetDir = string.IsNullOrWhiteSpace(dir)
            ? Path.Combine("downloads", naId.ToString())
            : dir;

        await _downloadService.DownloadAsync(urls, targetDir, ct);

        return Ok(new
        {
            naId,
            count = urls.Count,
            directory = targetDir
        });
    }
}
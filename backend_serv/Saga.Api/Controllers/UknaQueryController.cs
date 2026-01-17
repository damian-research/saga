namespace Saga.Api.Controllers;

[ApiController]
[Route("api/ukna")]
public sealed class UknaQueryController(
    UknaQueryService service,
    DownloadService downloadService) : ControllerBase
{
    private readonly UknaQueryService _service = service;
    private readonly DownloadService _downloadService = downloadService;

    [HttpPost("search")]
    public async Task<ActionResult<List<UknaSearchRecord>>> Search(
        [FromBody] UknaSearchParams parameters)
    {
        var results = await _service.SearchAsync(parameters);
        return Ok(results);
    }

    [HttpGet("details/{cid}")]
    public async Task<ActionResult<UknaItemDetails>> GetItem(string cid)
    {
        var item = await _service.GetItemAsync(cid);

        if (item == null)
            return NoContent();

        return Ok(item);
    }
}
namespace NaraTool.Api.Controllers;

// Api/Controllers/QueryController.cs
using Microsoft.AspNetCore.Mvc;
using NaraTool.Services.Services;

[ApiController]
[Route("api/query")]
public class QueryController : ControllerBase
{
    private readonly QueryService _service;

    public QueryController(QueryService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> Execute([FromBody] string request)
    {
        var result = await _service.ExecuteAsync(request);
        return Ok(result);
    }
}
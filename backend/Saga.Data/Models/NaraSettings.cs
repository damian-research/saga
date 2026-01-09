namespace Saga.Data.Models;

public sealed class NaraSettings
{
    public string BaseUrl { get; init; } = "";
    public string ApiKey { get; init; } = "";
    public int TimeoutSeconds { get; init; } = 30;
}
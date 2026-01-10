namespace Saga.Data.Models.Nara;

public sealed class NaraSettings
{
    public string BaseUrl { get; init; } = "";
    public string ApiKey { get; init; } = "";
    public int TimeoutSeconds { get; init; } = 30;
    public bool UseMock { get; init; }
}
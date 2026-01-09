namespace Saga.Data.Models.Ukna;

public sealed class UknaSearchRecord
{
    public string Id { get; init; }           // C9192905
    public string Title { get; init; }        // h3
    public string? Summary { get; init; }     // p
    public string? Reference { get; init; }
    public string? Date { get; init; }
    public string? HeldBy { get; init; }
    public IReadOnlyList<string> Subjects { get; init; } = [];
    public int Level { get; init; } = 0;
}
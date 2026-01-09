namespace Saga.Data.Models.Ukna;
public sealed class UknaSearchParams
{
    public string? Q { get; init; }

    public IReadOnlyList<int>? Levels { get; init; }

    public string? Department { get; init; }

    public int? DateFrom { get; init; }

    public int? DateTo { get; init; }

    public bool OnlyOnline { get; init; }
}
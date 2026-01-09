namespace Saga.Data.Models.Ukna;

public sealed class UknaSearchRecord
{
    public required string Id { get; init; }      // Cxxxx
    public required string Title { get; init; }
    public required int Level { get; init; }       // 1–3
}
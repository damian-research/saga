namespace Saga.Data.Models.Ukna;

public sealed class UknaItemDetails
{
    public string Id { get; init; }
    public string Title { get; init; }
    public string DetailsUrl { get; init; }

    public bool HasPreview { get; init; }
    public string? PreviewUrl { get; init; }

    public List<UknaPathNode> Path { get; init; } = [];
}
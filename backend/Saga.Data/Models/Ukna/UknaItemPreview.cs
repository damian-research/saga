namespace Saga.Data.Models.Ukna;

public sealed class UknaItemPreview
{
    public string Id { get; init; }           // archive-specific ID
    public string Source { get; init; }       // "NARA", "UKNA"
    public string Title { get; init; }

    public string ObjectType { get; init; }   // Image, PDF
    public string ObjectUrl { get; init; }

    public string? FileName { get; init; }
    public long? FileSize { get; init; }
    
}
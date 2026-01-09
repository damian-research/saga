namespace Saga.Data.Models;

public class PathSegment
{
    public LevelOfDescription SegmentType { get; set; }
    public long NaId { get; set; }
    public string Label { get; set; } = string.Empty;
}
namespace NaraTool.Data.Models;

public class RawRecord
{
    public long NaId { get; set; }
    public string Title { get; set; }
    public string LevelDescription { get; set; }
    public string? MaterialType { get; set; }
    public string? SourceReference { get; set; }
    public string? Description { get; set; }
    public List<Ancestor> Ancestors { get; set; } = [];
    public List<PathSegment> Path { get; set; } = [];
    public int TotalDigitalObjects { get; set; }
    public DigitalObject? FirstDigitalObject { get; set; }
}
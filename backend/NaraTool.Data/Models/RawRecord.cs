namespace NaraTool.Data.Models;

public class RawRecord
{
    public long NaId { get; set; }
    public string Title { get; set; }
    public LevelOfDescription Level { get; set; }
    public List<Ancestor> Ancestors { get; set; } = [];
    public int TotalDigitalObjects { get; set; }
    public DigitalObject? FirstDigitalObject { get; set; }
}
namespace Saga.Data.Models;

public class Ancestor
{
    public long NaId { get; set; }
    public int? RecordGroupNumber { get; set; }
    public string Title { get; set; }
    public short Distance { get; set; }
    public LevelOfDescription Level { get; set; }
}
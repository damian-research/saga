namespace Saga.Data.Models;

public class RawFullRecord
{
    public long NaId { get; set; }
    public string Title { get; set; }
    public List<Ancestor> Ancestors { get; set; } = [];
    public List<DigitalObject> DigitalObjects { get; set; } = [];
}
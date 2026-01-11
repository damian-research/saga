namespace Saga.Data.Models.Nara;

public class RawFullRecord
{
    public long NaId { get; set; }
    public string Title { get; set; }
    public List<AncestorOld> Ancestors { get; set; } = [];
    public List<DigitalObjectOld> DigitalObjects { get; set; } = [];
}
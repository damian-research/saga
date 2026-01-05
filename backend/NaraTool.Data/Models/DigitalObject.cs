namespace NaraTool.Data.Models;

public class DigitalObject
{
    public long ObjectId { get; set; }
    public string ObjectDescription { get; set; }
    public string ObjectType { get; set; }
    public string ObjectUrl { get; set; }
    public string? FileName { get; set; }
    public long? FileSize { get; set; }
}
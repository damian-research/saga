namespace NaraTool.External.Nara;

public interface INaraClient
{
    Task<IEnumerable<RawRecord>> SearchBriefAsync(string query);
    Task<RawFullRecord> GetFullAsync(long naId);
}
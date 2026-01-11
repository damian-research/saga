namespace Saga.External.Nara;

public interface INaraClientOld
{
    Task<IEnumerable<RawRecord>> SearchBriefAsync(string query);
    Task<RawFullRecord> GetFullAsync(long naId);
}
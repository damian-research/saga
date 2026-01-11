namespace Saga.External.Nara;

public interface INaraClient
{
    // BRIEF
    Task<IEnumerable<Ead>> SearchAndMapToEad3Async(string rawQuery);

    // FULL
    Task<Ead> GetFullAndMapToEad3Async(long naId);

    // Task<IEnumerable<RawRecord>> SearchBriefAsync(string query);
    // Task<RawFullRecord> GetFullAsync(long naId);
}
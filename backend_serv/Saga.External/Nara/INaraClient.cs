namespace Saga.External.Nara;

public interface INaraClient
{
    // BRIEF
    Task<IEnumerable<Ead>> SearchAndMapToEad3Async(string rawQuery);

    // FULL
    Task<Ead> GetFullAndMapToEad3Async(long naId);

    // CHILDREN
    Task<List<Ead>> GetChildrenAndMapToEad3Async(long parentId, int limit);
}
namespace Saga.External.UKNA;

public interface IUknaClient
{
    Task<IReadOnlyList<UknaSearchRecord>> SearchAsync(UknaSearchParams parameters);

    Task<UknaItemPreview?> GetItemAsync(string cid);
}
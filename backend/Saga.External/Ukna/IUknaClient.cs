namespace Saga.External.UKNA;

public interface IUknaClient
{
    Task<List<UknaSearchRecord>> SearchAsync(UknaSearchParams parameters);

    Task<UknaItemPreview?> GetItemAsync(string cid);
}
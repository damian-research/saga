namespace Saga.External.UKNA;

public interface IUknaClient
{
    Task<List<UknaSearchRecord>> SearchAsync(UknaSearchParams parameters);

    Task<UknaItemDetails?> GetItemAsync(string cid);
}
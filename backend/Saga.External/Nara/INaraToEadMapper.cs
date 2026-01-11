namespace Saga.External.Nara;

public interface INaraToEad3Mapper
{
    Ead MapToEad3(NaraResponse naraResponse);
    List<Ead> MapMultipleToEad3(NaraResponse naraResponse);
}

public class NaraToEad3Mapper(IMapper mapper) : INaraToEad3Mapper
{
    private readonly IMapper _mapper = mapper;

    public Ead MapToEad3(NaraResponse naraResponse)
    {
        var firstHit = (naraResponse?.Body?.Hits?.HitsList?.FirstOrDefault()) ?? throw new InvalidOperationException("No records found in NARA response");
        return _mapper.Map<Ead>(firstHit);
    }

    public List<Ead> MapMultipleToEad3(NaraResponse naraResponse)
    {
        var hits = naraResponse?.Body?.Hits?.HitsList;
        if (hits == null || hits.Count == 0)
            return [];

        return hits.Select(hit => _mapper.Map<Ead>(hit)).ToList();
    }
}
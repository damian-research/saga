w Services zdefiniować FileDescriptor:

FileDescriptor
{
Url
FileName
Size
ContextPath
}

Zaprojektuj kontrakt zapytania w Services, zgodny z tym repo.
NaraSearchRequest
{
RecordGroupNumber
AncestorNaId
LevelOfDescription
AvailableOnline
Query
SearchAfter
Limit
}

foreach (var url in urls)
{
var fileName = Path.GetFileName(new Uri(url).AbsolutePath);
var path = Path.Combine("downloads", fileName);

    if (File.Exists(path))
        continue;

    using var stream = await _http.GetStreamAsync(url);
    using var file = File.Create(path);
    await stream.CopyToAsync(file);

}

namespace NaraTool.External.Nara;

public interface INaraClient
{
    Task<string> SearchAsync(string query);
}

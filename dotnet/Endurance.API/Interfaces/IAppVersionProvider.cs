public interface IAppVersionProvider
{
    string GetCurrent();
    bool TryUpdateFromServer(string validAppVersions);
}
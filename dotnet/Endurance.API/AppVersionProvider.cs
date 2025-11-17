using System.Text.RegularExpressions;
using NuGet.Versioning;

public class AppVersionProvider : IAppVersionProvider
{
    private readonly object _lock = new();
    private SemanticVersion _current;

    public AppVersionProvider(string initialVersion)
    {
        _current = SemanticVersion.Parse(initialVersion);
    }

    public string GetCurrent()
    {
        lock (_lock)
        {
            return _current.ToNormalizedString();
        }
    }

    private static readonly Regex VersionRegex = new(@"\d+\.\d+\.\d+", RegexOptions.Compiled);

    public bool TryUpdateFromServer(string validAppVersions)
    {
        if (string.IsNullOrWhiteSpace(validAppVersions))
            return false;

        // Example incoming value: ">= 6.18.0"
        var match = VersionRegex.Match(validAppVersions);
        if (!match.Success)
            return false;

        var required = SemanticVersion.Parse(match.Value);

        lock (_lock)
        {
            if (required > _current)
            {
                _current = required;
                return true;
            }
        }
        return false;
    }
}


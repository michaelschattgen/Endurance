using Endurance.API.Models.MyFitApp;

namespace Endurance.API.Clients;

using Refit;

public interface IMyFitAppClient
{
    [Get("/AWS/api/session")]
    Task<SessionListResponse> GetSessions(
        [Header("AuthenticationKey")] string authenticationKey,
        [AliasAs("scopeIds")] string scopeIds,
        [AliasAs("globalInfo")] int globalInfo,
        [AliasAs("locale")] string locale
    );
}

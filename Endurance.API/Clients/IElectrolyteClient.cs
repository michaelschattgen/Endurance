using Endurance.API.Models;
using Refit;

namespace Endurance.API.Clients;

public interface IElectrolyteClient
{
    [Post("/session")]
    Task<TokenResponseModel> GetToken();

    [Get("/scheduled_classes")]
    Task<ElectrolyteResponse<ScheduledClass>> GetScheduledClasses(
        [AliasAs("venues")] string venueId,
        [AliasAs("exclude_fully_booked")] bool excludeFullyBooked,
        [AliasAs("date")] string date,
        [AliasAs("category")] string category);
}
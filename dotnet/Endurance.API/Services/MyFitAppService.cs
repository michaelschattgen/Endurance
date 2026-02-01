using Endurance.API.Clients;
using Endurance.API.Interfaces;
using Endurance.API.Models;
using Endurance.API.Models.Electrolyte;

namespace Endurance.API.Services;

public class MyFitAppService : IMyFitAppService
{
    private readonly IMyFitAppClient _client;

    public MyFitAppService(IMyFitAppClient client)
    {
        _client = client;
    }

    public async Task<IEnumerable<ScheduledClassModel>> GetScheduledClasses(string scopeIds, DateTime startDate)
    {
        var response = await _client.GetSessions(
            "",
            scopeIds,
            globalInfo: 1,
            locale: "en_US"
        );

        var classes = response.Sessions
            .Select(s =>
            {
                var start = DateTimeOffset.FromUnixTimeSeconds(s.StartTimeUtc);
                var end = DateTimeOffset.FromUnixTimeSeconds(s.EndTimeUtc);
                var durationSeconds = (int)Math.Max(0, (end - start).TotalSeconds);

                return new ScheduledClassModel
                {
                    Id = s.Id.ToString(),
                    VenueId = s.SiteId ?? string.Empty,
                    Description = s.Title ?? string.Empty,
                    DurationSeconds = durationSeconds,
                    SpotsAvailable = s.SlotsAvailable,
                    Capacity = s.SlotsTotal,
                    StartTime = start.UtcDateTime,
                    ClassTypeIcon = null,
                    Activity = new Activity
                    {
                        Id = s.ReservationId ?? s.Id.ToString(),
                        Name = s.Title ?? string.Empty,
                        Category = s.ActivityGroupDesc ?? s.Type ?? string.Empty,
                        Subcategory = s.ActivityGroupId ?? string.Empty,
                        Description = s.Description ?? string.Empty,
                        ImageUrl = s.ImageUrl ?? string.Empty
                    }
                };
            });

        var startDateUtc = DateTime.SpecifyKind(startDate, DateTimeKind.Utc);
        return classes.Where(c => c.StartTime >= startDateUtc);
    }
}
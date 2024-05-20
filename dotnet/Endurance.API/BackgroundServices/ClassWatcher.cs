using Endurance.API.Clients;
using Endurance.API.Interfaces;
using Endurance.API.Models.Database;
using Endurance.API.Models.Settings;

namespace Endurance.API.BackgroundServices;

public class ClassWatcher : BackgroundService
{
    private readonly ILogger<ClassWatcher> _logger;
    private readonly IElectrolyteClient _electrolyteClient;
    private readonly ElectrolyteSettings _electrolyteSettings;
    private readonly IServiceScopeFactory _serviceScopeFactory;


    public ClassWatcher(ILogger<ClassWatcher> logger, IElectrolyteClient electrolyteClient, ElectrolyteSettings electrolyteSettings, IServiceScopeFactory serviceScopeFactory)
    {
        _logger = logger;
        _electrolyteClient = electrolyteClient;
        _electrolyteSettings = electrolyteSettings;
        _serviceScopeFactory = serviceScopeFactory;
    }
    
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using (var scope = _serviceScopeFactory.CreateScope())
                {
                    // I shouldn't resolve multiple services in here (https://stackoverflow.com/a/70144027)
                    var watchedClassService = scope.ServiceProvider.GetService<IWatchedClassService>();
                    var watchedClasses = await watchedClassService.GetAllWatchedClassesAsync();
                    if (watchedClasses.Count == 0)
                    {
                        await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
                    }

                    var venueDayMap = GetUniqueVenuesAndDays(watchedClasses);
                    foreach (var entry in venueDayMap)
                    {
                        var venueId = entry.Key;
                        var dates = entry.Value;

                        foreach (var date in dates)
                        {
                            var formattedStartDate = date.ToString("yyyy-MM-ddTHH:mm:ss.fffzzz");

                            var classes = await _electrolyteClient.GetScheduledClasses(
                                venueId,
                                false,
                                formattedStartDate,
                                "all");

                            var importantWatchedClasses =
                                watchedClasses.Where(x => x.StartDateTime.Date == date && x.VenueId == venueId);

                            foreach (var watchedClass in importantWatchedClasses)
                            {
                                var matchingClass =
                                    classes.ScheduledClasses.FirstOrDefault(x => x.Id == watchedClass.ClassId);
                                if (matchingClass is not null)
                                {
                                    if (matchingClass.SpotsAvailable > 0)
                                    {
                                        // Send noti
                                    }
                                }
                            }
                        }
                    }
                    
                    await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
                }
            }
            catch (Exception e)
            {
                _logger.LogError("Error refreshing cache: ", e.Message, e.InnerException);
                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
            }
        }
    }
    
    public Dictionary<string, HashSet<DateTime>> GetUniqueVenuesAndDays(List<WatchedClassEntity> watchedClasses)
    {
            var venueDayMap = new Dictionary<string, HashSet<DateTime>>();

            foreach (var scheduledClass in watchedClasses)
            {
                var venueId = scheduledClass.VenueId;
                var day = scheduledClass.StartDateTime.Date;

                if (!venueDayMap.ContainsKey(venueId))
                {
                    venueDayMap[venueId] = new HashSet<DateTime>();
                }

                venueDayMap[venueId].Add(day);
            }

            return venueDayMap;
    }
}
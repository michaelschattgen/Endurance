using System.Text.Json;
using Endurance.API.Enums;
using Endurance.API.Interfaces;
using Endurance.API.Interfaces.Repositories;
using Endurance.API.Models;
using Endurance.API.Models.Database;

namespace Endurance.API.Services;

public class WatchedClassService : IWatchedClassService
{
    private readonly IWatchedClassRepository _watchedClassRepository;

    public WatchedClassService(IWatchedClassRepository watchedClassRepository)
    {
        _watchedClassRepository = watchedClassRepository;
    }

    public async Task AddEmailWatcher(string venueId, string classId, string emailAddress, DateTime startDateTime)
    {
        var watchedClassEntity = new WatchedClassEntity
        {
            VenueId = venueId,
            ClassId = classId,
            IsActive = true,
            StartDateTime = startDateTime,
            NotifierSettings = new NotifierSettingsEntity
            {
                Type = NotifierType.Email,
                Settings = JsonSerializer.Serialize(new EmailNotifierSettings
                {
                    Email = emailAddress
                })
            }
        };

        await _watchedClassRepository.AddWatchedClass(watchedClassEntity);
    }

    public async Task<List<WatchedClassEntity>> GetAllWatchedClassesAsync()
    {
        return await _watchedClassRepository.GetAllAsync(true);
    }
}
using Endurance.API.Interfaces;
using Endurance.API.Interfaces.Repositories;
using Endurance.API.Models.Database;

namespace Endurance.API.Services;

public class WatchedClassService : IWatchedClassService
{
    private readonly IWatchedClassRepository _watchedClassRepository;

    public WatchedClassService(IWatchedClassRepository watchedClassRepository)
    {
        _watchedClassRepository = watchedClassRepository;
    }

    public async Task<List<WatchedClassModel>> GetAllWatchedClassesAsync()
    {
        return await _watchedClassRepository.GetAllAsync();
    }
}
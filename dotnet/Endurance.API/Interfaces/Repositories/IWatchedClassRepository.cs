using Endurance.API.Models.Database;

namespace Endurance.API.Interfaces.Repositories;

public interface IWatchedClassRepository
{
    Task<WatchedClassEntity> AddWatchedClass(WatchedClassEntity watchedClassEntity);
    Task DisableWatchedClass(int id);
    Task<List<WatchedClassEntity>> GetAllAsync(bool onlyActive);
}
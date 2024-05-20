using Endurance.API.Models.Database;

namespace Endurance.API.Interfaces.Repositories;

public interface IWatchedClassRepository
{
    Task<WatchedClassEntity> AddWatchedClass(WatchedClassEntity watchedClassEntity);
    Task<List<WatchedClassEntity>> GetAllAsync(bool onlyActive);
}
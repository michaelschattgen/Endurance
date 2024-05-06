using Endurance.API.Models.Database;

namespace Endurance.API.Interfaces.Repositories;

public interface IWatchedClassRepository
{
    Task<List<WatchedClassModel>> GetAllAsync();
}
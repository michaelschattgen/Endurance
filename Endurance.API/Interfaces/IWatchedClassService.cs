using Endurance.API.Models.Database;

namespace Endurance.API.Interfaces;

public interface IWatchedClassService
{
    Task<List<WatchedClassModel>> GetAllWatchedClassesAsync();
}
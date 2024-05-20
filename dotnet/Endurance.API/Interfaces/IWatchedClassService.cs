using Endurance.API.Models.Database;

namespace Endurance.API.Interfaces;

public interface IWatchedClassService
{
    Task AddEmailWatcher(string venueId, string classId, string emailAddress);
    Task<List<WatchedClassEntity>> GetAllWatchedClassesAsync();
}
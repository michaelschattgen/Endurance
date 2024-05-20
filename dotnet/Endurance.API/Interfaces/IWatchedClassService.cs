using Endurance.API.Models.Database;

namespace Endurance.API.Interfaces;

public interface IWatchedClassService
{
    Task AddEmailWatcher(string venueId, string classId, string emailAddress, DateTime startDateTime);
    Task<List<WatchedClassEntity>> GetAllWatchedClassesAsync();
}
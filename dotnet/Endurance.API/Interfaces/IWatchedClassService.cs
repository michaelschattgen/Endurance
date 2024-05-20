using Endurance.API.Models;

namespace Endurance.API.Interfaces;

public interface IWatchedClassService
{
    Task AddEmailWatcher(string venueId, string classId, string emailAddress, DateTime startDateTime);
    Task DisableWatcher(int id);
    Task<List<WatchedClassModel>> GetAllWatchedClassesAsync();
}
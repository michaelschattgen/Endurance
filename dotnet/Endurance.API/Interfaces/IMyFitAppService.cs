using Endurance.API.Models;

namespace Endurance.API.Interfaces;

public interface IMyFitAppService
{
    Task<IEnumerable<ScheduledClassModel>> GetScheduledClasses(string scopeIds, DateTime startDate);
}
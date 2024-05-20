using Endurance.API.Models;

namespace Endurance.API.Interfaces;

public interface INotifyService
{
    Task Notify(WatchedClassModel watchedClassModel, ClassInfoModel classInfoModel);
}
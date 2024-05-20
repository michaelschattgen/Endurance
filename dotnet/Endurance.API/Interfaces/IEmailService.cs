using Endurance.API.Models;

namespace Endurance.API.Interfaces;

public interface IEmailService
{
    Task SendEmail(WatchedClassModel watchedClassModel, ClassInfoModel classInfoModel);
}
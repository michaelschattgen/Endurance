using Endurance.API.Enums;
using Endurance.API.Interfaces;
using Endurance.API.Models;

namespace Endurance.API.Services;

public class NotifyService : INotifyService
{
    private readonly IEmailService _emailService;
    private readonly IWatchedClassService _watchedClassService;
    
    public NotifyService(IEmailService emailService, IWatchedClassService watchedClassService)
    {
        _emailService = emailService;
        _watchedClassService = watchedClassService;
    }
    
    public Task Notify(WatchedClassModel watchedClassModel, ClassInfoModel classInfoModel)
    {
        if (watchedClassModel.NotifierSettings.Type == NotifierType.Email)
        {
            _emailService.SendEmail(watchedClassModel, classInfoModel);
        }

        _watchedClassService.DisableWatcher(watchedClassModel.Id);
        return Task.CompletedTask;
    }
}
using Endurance.API.Interfaces;
using Endurance.API.Models;
using Endurance.API.Models.Settings;
using ntfy;
using ntfy.Requests;

namespace Endurance.API.Services;

public class NtfyService : INtfyService
{
    private readonly NtfySettings _ntfySettings;
    
    public NtfyService(NtfySettings ntfySettings)
    {
        _ntfySettings = ntfySettings;
    }

    public async Task PublishMessage()
    {
        var client = new Client(_ntfySettings.BaseUrl);
        var user = new User(_ntfySettings.Username, _ntfySettings.Password);

        var message = new SendingMessage
        {
            Title = "Spot available",
            Message = "One of your watched classes has a spot available!"
        };

        await client.Publish(_ntfySettings.TopicPrefix + "sportcity", message, user);
    }
}
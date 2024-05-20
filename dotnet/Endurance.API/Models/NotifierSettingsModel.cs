using Endurance.API.Enums;

namespace Endurance.API.Models;

public class NotifierSettingsModel
{
    public int Id { get; set; }
    public NotifierType Type { get; set; }
    public string Settings { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
}
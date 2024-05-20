using Endurance.API.Models.Database;

namespace Endurance.API.Models;

public class WatchedClassModel
{
    public int Id { get; set; }
    public int VenueId { get; set; }
    public int ClassId { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public NotifierSettingsEntity NotifierSettings { get; set; }
}
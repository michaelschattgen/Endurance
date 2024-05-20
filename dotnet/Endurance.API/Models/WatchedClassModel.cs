using Endurance.API.Models.Database;

namespace Endurance.API.Models;

public class WatchedClassModel
{
    public int Id { get; set; }
    public string VenueId { get; set; }
    public string ClassId { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    
    public DateTime StartDateTime { get; set; }
    public NotifierSettingsEntity NotifierSettings { get; set; }
}
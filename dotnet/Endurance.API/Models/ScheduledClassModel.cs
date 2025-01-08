using Endurance.API.Models.Electrolyte;

namespace Endurance.API.Models;

public class ScheduledClassModel
{
    public string Id { get; set; }
    public string Description { get; set; }
    public DateTime StartTime { get; set; }
    public int DurationSeconds { get; set; }
    public string ClassTypeIcon { get; set; }
    public int SpotsAvailable { get; set; }
    public int Capacity { get; set; }
    public string VenueId { get; set; }
    public Activity Activity { get; set; }
}
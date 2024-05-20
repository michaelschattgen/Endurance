namespace Endurance.API.Models;

public class AddWatchedClassRequest
{
    public string VenueId { get; set; }
    public string ClassId { get; set; }
    public string EmailAddress { get; set; }
    public DateTime StartDateTime { get; set; }
}
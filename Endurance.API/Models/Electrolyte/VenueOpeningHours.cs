using System.Text.Json.Serialization;

namespace Endurance.API.Models.Electrolyte;

public class VenueOpeningHours
{
    [JsonPropertyName("open_from")]
    public string OpenFrom { get; set; }

    [JsonPropertyName("open_to")]
    public string OpenTo { get; set; }
}
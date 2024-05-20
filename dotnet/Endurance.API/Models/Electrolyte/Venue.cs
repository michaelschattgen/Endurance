using System.Text.Json.Serialization;

namespace Endurance.API.Models.Electrolyte;

public class Venue
{
    [JsonPropertyName("id")] 
    public string Id { get; set; }
    
    [JsonPropertyName("name")] 
    public string Name { get; set; }
}

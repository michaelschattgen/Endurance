using System.Text.Json.Serialization;

namespace Endurance.API.Models;

public class Venue
{
    [JsonPropertyName("id")] 
    public string Id { get; set; }
    
    [JsonPropertyName("name")] 
    public string Name { get; set; }
}

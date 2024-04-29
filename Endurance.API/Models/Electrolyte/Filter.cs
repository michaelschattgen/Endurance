using System.Text.Json.Serialization;

namespace Endurance.API.Models;

public class Filter
{
    [JsonPropertyName("category")]
    public List<Category> Category { get; set; }
}
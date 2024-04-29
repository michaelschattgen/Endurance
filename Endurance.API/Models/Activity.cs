using System.Text.Json.Serialization;

namespace Endurance.API.Models;

public class Activity
{
    [JsonPropertyName("id")]
    public string Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; }

    [JsonPropertyName("category")]
    public string Category { get; set; }

    [JsonPropertyName("subcategory")]
    public string Subcategory { get; set; }

    [JsonPropertyName("description")]
    public string Description { get; set; }

    [JsonPropertyName("imageUrl")]
    public string ImageUrl { get; set; }
}
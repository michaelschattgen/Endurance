using System.Text.Json.Serialization;

namespace Endurance.API.Models;

public class Category
{
    [JsonPropertyName("value")]
    public string Value { get; set; }

    [JsonPropertyName("label")]
    public string Label { get; set; }

    [JsonPropertyName("short_label")]
    public string ShortLabel { get; set; }

    [JsonPropertyName("selected")]
    public bool Selected { get; set; }

    [JsonPropertyName("icon")]
    public string Icon { get; set; }

    [JsonPropertyName("bigger_icon")]
    public string BiggerIcon { get; set; }
}
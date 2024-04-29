using System.Text.Json.Serialization;

namespace Endurance.API.Models;

public class ElectrolyteResponse<T>
{
    [JsonPropertyName("filter")]
    public Filter Filter { get; set; }

    [JsonPropertyName("scheduled_classes")]
    public List<T> ScheduledClasses { get; set; }

    [JsonPropertyName("no_results_message")]
    public object NoResultsMessage { get; set; }
}
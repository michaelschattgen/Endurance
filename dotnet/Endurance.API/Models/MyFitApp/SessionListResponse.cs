using System.Text.Json.Serialization;

namespace Endurance.API.Models.MyFitApp;

public class SessionListResponse
{
    [JsonPropertyName("sessions")]
    public List<SessionResponse> Sessions { get; init; } = [];
}
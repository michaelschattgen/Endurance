using System.Text.Json.Serialization;

namespace Endurance.API.Models.MyFitApp;

public class SessionResponse
{
    [JsonPropertyName("id")]
    public long Id { get; init; }

    [JsonPropertyName("title")]
    public string? Title { get; init; }

    [JsonPropertyName("description")]
    public string? Description { get; init; }

    [JsonPropertyName("imageURL")]
    public string? ImageUrl { get; init; }

    [JsonPropertyName("siteId")]
    public string? SiteId { get; init; }

    [JsonPropertyName("siteName")]
    public string? SiteName { get; init; }

    [JsonPropertyName("startTimeUTC")]
    public long StartTimeUtc { get; init; }

    [JsonPropertyName("endTimeUTC")]
    public long EndTimeUtc { get; init; }

    [JsonPropertyName("slotsTotal")]
    public int SlotsTotal { get; init; }

    [JsonPropertyName("slotsAvailable")]
    public int SlotsAvailable { get; init; }

    [JsonPropertyName("reservationId")]
    public string? ReservationId { get; init; }

    [JsonPropertyName("activityGroupDesc")]
    public string? ActivityGroupDesc { get; init; }

    [JsonPropertyName("activityGroupID")]
    public string? ActivityGroupId { get; init; }

    [JsonPropertyName("type")]
    public string? Type { get; init; }
}
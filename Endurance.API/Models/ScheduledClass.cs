using System.Text.Json.Serialization;

namespace Endurance.API.Models;

public class ScheduledClass
{
            [JsonPropertyName("id")]
        public string Id { get; set; }

        [JsonPropertyName("venueName")]
        public string VenueName { get; set; }

        [JsonPropertyName("venueId")]
        public string VenueId { get; set; }

        [JsonPropertyName("startTimestamp")]
        public int StartTimestamp { get; set; }

        [JsonPropertyName("preCheckinTimestamp")]
        public int PreCheckinTimestamp { get; set; }

        [JsonPropertyName("postCheckinTimestamp")]
        public int PostCheckinTimestamp { get; set; }

        [JsonPropertyName("startTime")]
        public DateTime StartTime { get; set; }

        [JsonPropertyName("preCheckinTime")]
        public DateTime PreCheckinTime { get; set; }

        [JsonPropertyName("postCheckinTime")]
        public DateTime PostCheckinTime { get; set; }

        [JsonPropertyName("durationSeconds")]
        public int DurationSeconds { get; set; }

        [JsonPropertyName("instructor")]
        public string Instructor { get; set; }

        [JsonPropertyName("activity")]
        public Activity Activity { get; set; }

        [JsonPropertyName("status")]
        public string Status { get; set; }

        [JsonPropertyName("booked")]
        public bool Booked { get; set; }

        [JsonPropertyName("classType")]
        public string ClassType { get; set; }

        [JsonPropertyName("classTypeIcon")]
        public string ClassTypeIcon { get; set; }

        [JsonPropertyName("classTypeBiggerIcon")]
        public string ClassTypeBiggerIcon { get; set; }

        [JsonPropertyName("classTypeLabel")]
        public string ClassTypeLabel { get; set; }

        [JsonPropertyName("spotsAvailable")]
        public int SpotsAvailable { get; set; }

        [JsonPropertyName("capacity")]
        public int Capacity { get; set; }

        [JsonPropertyName("availability_percentage")]
        public int AvailabilityPercentage { get; set; }

        [JsonPropertyName("availability_text")]
        public string AvailabilityText { get; set; }

        [JsonPropertyName("roomname")]
        public string Roomname { get; set; }

        [JsonPropertyName("venueProjectedUtilisation")]
        public object VenueProjectedUtilisation { get; set; }

        [JsonPropertyName("houseRulesUrl")]
        public object HouseRulesUrl { get; set; }

        [JsonPropertyName("infoUrl")]
        public string InfoUrl { get; set; }

        [JsonPropertyName("venueOpeningHours")]
        public VenueOpeningHours VenueOpeningHours { get; set; }

        [JsonPropertyName("category")]
        public string Category { get; set; }

        [JsonPropertyName("subcategory")]
        public string Subcategory { get; set; }

        [JsonPropertyName("subtitle")]
        public object Subtitle { get; set; }
}
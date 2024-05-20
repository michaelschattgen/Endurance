using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Endurance.API.Models.Database;

[Table("watched_classes")]
public class WatchedClassEntity
{
    [Key]
    public int Id { get; set; }

    [Column("venue_id")]
    public string VenueId { get; set; }
    
    [Column("class_id")]
    public string ClassId { get; set; }
    
    [Column("is_active")]
    public bool IsActive { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    
    [Column("start_datetime")]
    public DateTime StartDateTime { get; set; }

    [Column("notifier_settings_id")]
    public int NotifierSettingsId { get; set; }

    [ForeignKey("NotifierSettingsId")]
    public NotifierSettingsEntity NotifierSettings { get; set; }
}
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Endurance.API.Models.Database;

[Table("watched_classes")]
public class WatchedClassModel
{
    [Key]
    public int Id { get; set; }

    [Column("venue_id")]
    public int VenueId { get; set; }
    
    [Column("class_id")]
    public int ClassId { get; set; }
    
    [Column("is_active")]
    public bool IsActive { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    [Column("notifier_settings_id")]
    public int? NotifierSettingsId { get; set; }

    [ForeignKey("NotifierSettingsId")]
    public NotifierSettingsModel NotifierSettings { get; set; }
}
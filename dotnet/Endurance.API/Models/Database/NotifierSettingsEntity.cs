using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Endurance.API.Enums;

namespace Endurance.API.Models.Database;

[Table("notifier_settings")]
public class NotifierSettingsEntity
{
    [Key]
    public int Id { get; set; }

    [Column(TypeName = "enum('email','ntfy','discord')")]
    public NotifierType Type { get; set; }

    [Column("settings")]
    public string Settings { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.Now;
}
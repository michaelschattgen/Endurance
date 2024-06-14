namespace Endurance.API.Models.Settings;

public class Settings
{
    public ConnectionStrings ConnectionStrings { get; set; }
    public SmtpSettings Smtp { get; set; }
}
namespace Endurance.API.Models.Settings;

public class Settings
{
    public ConnectionStrings ConnectionStrings { get; set; }
    public NtfySettings Ntfy { get; set; }
    public ElectrolyteSettings Electrolyte { get; set; } 
}
namespace Endurance.API.Models;

/// <summary>
/// This model is used to pass additional information about the class itself (activity, instructor, date etc)
/// </summary>
public class ClassInfoModel
{
    public string VenueName { get; set; }
    public string Name { get; set; }
    public DateTime StartDateTime { get; set; }
}
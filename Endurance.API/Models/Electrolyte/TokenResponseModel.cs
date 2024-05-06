namespace Endurance.API.Models.Electrolyte;

public class TokenResponseModel
{
    public string SessionId { get; set; }

    public DateTime ExpiryDate { get; set; }
}
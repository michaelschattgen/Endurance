namespace Endurance.API.Models;

public class TokenResponseModel
{
    public string SessionId { get; set; }

    public DateTime ExpiryDate { get; set; }
}
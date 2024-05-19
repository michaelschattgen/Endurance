using Endurance.API.Clients;
using Endurance.API.Models;
using Endurance.API.Models.Electrolyte;
using Microsoft.Extensions.Caching.Memory;

namespace Endurance.API.Services;

public class TokenService
{
    private IMemoryCache _cache;
    private IElectrolyteClient _electrolyteClient;

    public TokenService(IMemoryCache memoryCache, IElectrolyteClient electrolyte)
    {
        _cache = memoryCache;
        _electrolyteClient = electrolyte;
    }

    public async Task<string> GetTokenAsync()
    {
        if (!_cache.TryGetValue("bearer_token", out TokenResponseModel token) || token.ExpiryDate < DateTime.UtcNow)
        {
            token = await _electrolyteClient.GetToken();
            token.ExpiryDate = DateTime.Now.AddDays(1);
            var options = new MemoryCacheEntryOptions().SetAbsoluteExpiration(DateTime.Now.AddDays(1));
            _cache.Set("bearer_token", token, options);
        }

        return token.SessionId;
    }

    public void ResetToken()
    {
        _cache.Remove("bearer_token");
    }
}
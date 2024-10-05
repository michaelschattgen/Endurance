using Endurance.API.Services;

namespace Endurance.API;

public class CustomHeadersHandler(IServiceProvider serviceProvider) : DelegatingHandler
{
    private readonly string _tokenEndpoint = "/session";

    protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        // Check if the request is not for the token endpoint
        if (!request.RequestUri.AbsolutePath.EndsWith(_tokenEndpoint))
        {
            if (serviceProvider.GetService(typeof(TokenService)) is TokenService tokenService)
            {
                var token = await tokenService.GetTokenAsync();
                request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
            }

            request.Headers.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
        }

        request.Headers.TryAddWithoutValidation("User-Agent", "okhttp/4.12.0");
        request.Headers.TryAddWithoutValidation("Api-Version", "100.a");
        request.Headers.TryAddWithoutValidation("App-Version", "6.6.0");
        request.Headers.TryAddWithoutValidation("Device-Id", "cmrmH-2PR463YAiI7xEV-i");

        return await base.SendAsync(request, cancellationToken);
    }
}
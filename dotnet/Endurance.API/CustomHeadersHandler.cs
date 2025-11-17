using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using Endurance.API.Services;

namespace Endurance.API;

public class CustomHeadersHandler(
    IServiceProvider serviceProvider,
    IAppVersionProvider appVersionProvider,
    ILogger<CustomHeadersHandler> logger) : DelegatingHandler
{
    private readonly string _tokenEndpoint = "/session";

    protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        var isTokenRequest = request.RequestUri?.AbsolutePath.EndsWith(_tokenEndpoint) == true;

        var attempt = await request.CloneAsync(cancellationToken).ConfigureAwait(false);
        await PrepareRequestAsync(attempt, isTokenRequest).ConfigureAwait(false);

        var response = await base.SendAsync(attempt, cancellationToken).ConfigureAwait(false);

        if (response.StatusCode == (HttpStatusCode)426 &&
            await TryUpdateVersionFromResponseAsync(response, request).ConfigureAwait(false))
        {
            response.Dispose();

            var retry = await request.CloneAsync(cancellationToken).ConfigureAwait(false);
            await PrepareRequestAsync(retry, isTokenRequest).ConfigureAwait(false);

            return await base.SendAsync(retry, cancellationToken).ConfigureAwait(false);
        }

        return response;
    }

    private async Task PrepareRequestAsync(HttpRequestMessage request, bool isTokenRequest)
    {
        if (!isTokenRequest)
        {
            if (serviceProvider.GetService(typeof(TokenService)) is TokenService tokenService)
            {
                var token = await tokenService.GetTokenAsync().ConfigureAwait(false);
                request.Headers.Authorization =
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
            }

            request.Headers.Accept.Add(
                new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
        }

        var appVersion = appVersionProvider.GetCurrent();

        request.Headers.Remove("App-Version");
        request.Headers.TryAddWithoutValidation("App-Version", appVersion);
        request.Headers.TryAddWithoutValidation("User-Agent", "okhttp/4.12.0");
        request.Headers.TryAddWithoutValidation("Api-Version", "100.a");
        request.Headers.TryAddWithoutValidation("Device-Id", "cmrmH-2PR463YAiI7xEV-i");
    }

    private async Task<bool> TryUpdateVersionFromResponseAsync(HttpResponseMessage response, HttpRequestMessage originalRequest)
    {
        try
        {
            var previousVersion = appVersionProvider.GetCurrent();
            var content = await response.Content.ReadAsStringAsync().ConfigureAwait(false);

            var versionInfo = JsonSerializer.Deserialize<VersionResponse>(
                content,
                new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

            if (versionInfo?.ValidAppVersions is null)
            {
                logger.LogWarning(
                    "Received 426 (Upgrade Required) for {Method} {Uri}, but 'valid_app_versions' was missing. Current App-Version: {AppVersion}",
                    originalRequest.Method,
                    originalRequest.RequestUri,
                    previousVersion);

                return false;
            }

            var updated = appVersionProvider.TryUpdateFromServer(versionInfo.ValidAppVersions);

            if (updated)
            {
                var newVersion = appVersionProvider.GetCurrent();

                logger.LogWarning(
                    "Received 426 (Upgrade Required) for {Method} {Uri}. App-Version {PreviousVersion} is outdated. " +
                    "Server valid_app_versions: \"{ValidAppVersions}\". Updating to App-Version {NewVersion} and retrying once.",
                    originalRequest.Method,
                    originalRequest.RequestUri,
                    previousVersion,
                    versionInfo.ValidAppVersions,
                    newVersion);

                return true;
            }

            logger.LogWarning(
                "Received 426 (Upgrade Required) for {Method} {Uri}, but App-Version {AppVersion} could not be updated from server response 'valid_app_versions': \"{ValidAppVersions}\".",
                originalRequest.Method,
                originalRequest.RequestUri,
                previousVersion,
                versionInfo.ValidAppVersions);

            return false;
        }
        catch (Exception ex)
        {
            logger.LogError(
                ex,
                "Failed to process 426 (Upgrade Required) response for {Method} {Uri}. Current App-Version: {AppVersion}",
                originalRequest.Method,
                originalRequest.RequestUri,
                appVersionProvider.GetCurrent());

            return false;
        }
    }

    private sealed class VersionResponse
    {
        [JsonPropertyName("app_version")]
        public string? AppVersion { get; set; }

        [JsonPropertyName("valid_app_versions")]
        public string? ValidAppVersions { get; set; }
    }
}

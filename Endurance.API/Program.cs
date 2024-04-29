using Endurance.API;
using Endurance.API.Clients;
using Endurance.API.Services;
using Microsoft.Extensions.Caching.Memory;
using Refit;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddRefitClient<IElectrolyteClient>()
    .ConfigureHttpClient(c => c.BaseAddress = new Uri("https://electrolyte.sportcity.nl/v1"))
    .AddHttpMessageHandler((serviceProvider) =>
        new CustomHeadersHandler(serviceProvider));

builder.Services.AddSingleton<IMemoryCache, MemoryCache>();
builder.Services.AddScoped<TokenService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapGet("/get-classes", async (TokenService tokenService, IElectrolyteClient electrolyteClient) =>
    {
        try
        {
            var response = await electrolyteClient.GetScheduledClasses(
                "",
                false,
                "2024-04-29T00:00:00.000+02:00",
                "all"
            );
            return Results.Ok(response);
        }
        catch (Exception ex)
        {
            return Results.Problem(ex.Message);
        }
    })
    .WithName("GetClasses")
    .WithOpenApi();

app.Run();
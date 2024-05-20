using Endurance.API;
using Endurance.API.BackgroundServices;
using Endurance.API.Clients;
using Endurance.API.Interfaces;
using Endurance.API.Interfaces.Repositories;
using Endurance.API.Models;
using Endurance.API.Models.Settings;
using Endurance.API.Repositories;
using Endurance.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Refit;

var builder = WebApplication.CreateBuilder(args);
string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var settings = new Settings();
builder.Configuration.GetSection("Settings").Bind(settings);

// Register settings as a singleton so it can be injected wherever needed
builder.Services.AddSingleton(settings.ConnectionStrings);
builder.Services.AddSingleton(settings.Ntfy);
builder.Services.AddSingleton(settings.Smtp);
builder.Services.AddSingleton(settings.Electrolyte);

builder.Services.AddCors(opt =>  opt.AddPolicy("CorsPolicy", c =>
{ 
    c.AllowAnyOrigin()
        .AllowAnyHeader()
        .AllowAnyMethod();
}));


builder.Services.AddRefitClient<IElectrolyteClient>()
    .ConfigureHttpClient(c => c.BaseAddress = new Uri("https://electrolyte.sportcity.nl/v1"))
    .AddHttpMessageHandler((serviceProvider) =>
        new CustomHeadersHandler(serviceProvider));

builder.Services.AddDbContext<EnduranceDbContext>(options =>
    options.UseMySql(settings.ConnectionStrings.MySql, new MySqlServerVersion(new Version(8, 0, 21))));

builder.Services.AddScoped<IWatchedClassRepository, WatchedClassRepository>();
builder.Services.AddScoped<IWatchedClassService, WatchedClassService>();

builder.Services.AddSingleton<IMemoryCache, MemoryCache>();
builder.Services.AddTransient<INtfyService, NtfyService>();
builder.Services.AddTransient<IEmailService, EmailService>();
builder.Services.AddTransient<INotifyService, NotifyService>();
builder.Services.AddScoped<TokenService>();

builder.Services.AddHostedService<ClassWatcher>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();
app.UseCors("CorsPolicy");
app.MapGet("/get-classes", async ([FromQuery] DateTime startDate, IElectrolyteClient electrolyteClient, ElectrolyteSettings electrolyteSettings, INtfyService ntfyService, IWatchedClassService watchedClassService) =>
    {
        try
        {
            var formattedStartDate = startDate.ToString("yyyy-MM-ddTHH:mm:ss.fffzzz");
            //var ok = await watchedClassService.GetAllWatchedClassesAsync();
            // await ntfyService.PublishMessage();
            var response = await electrolyteClient.GetScheduledClasses(
                electrolyteSettings.VenueId,
                false,
                formattedStartDate,
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

app.MapPost("/add-classes", async (AddWatchedClassRequest addWatchedClassRequest, IWatchedClassService watchedClassService) =>
    {
        try
        {
            await watchedClassService.AddEmailWatcher(addWatchedClassRequest.VenueId, addWatchedClassRequest.ClassId,
                addWatchedClassRequest.EmailAddress, addWatchedClassRequest.StartDateTime);
            return Results.Ok();
        }
        catch (Exception ex)
        {
            return Results.Problem(ex.Message);
        }
    })
    .WithName("AddClass")
    .WithOpenApi();

app.Run();
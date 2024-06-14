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
using Refit;

var builder = WebApplication.CreateBuilder(args);
string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var settings = new Settings();
builder.Configuration.AddEnvironmentVariables();
builder.Configuration.GetSection("Settings").Bind(settings);

// Register settings as a singleton so it can be injected wherever needed
builder.Services.AddSingleton(settings.ConnectionStrings);
builder.Services.AddSingleton(settings.Smtp);

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
    options.UseMySql(settings.ConnectionStrings.MySql, ServerVersion.AutoDetect(settings.ConnectionStrings.MySql),
        mySqlOptions =>
            mySqlOptions.EnableRetryOnFailure(
                maxRetryCount: 10,
                maxRetryDelay: TimeSpan.FromSeconds(30),
                errorNumbersToAdd: null)
    )
);

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

app.MapGet("/get-venues", async (IElectrolyteClient electrolyteClient) =>
    {
        try
        {
            var response = await electrolyteClient.GetVenues();
            return Results.Ok(response);
        }
        catch (Exception ex)
        {
            return Results.Problem(ex.Message);
        }
    })
    .WithName("GetVenues")
    .WithOpenApi();

app.MapGet("/get-classes", async([FromQuery] string venueId, [FromQuery] DateTime startDate, IElectrolyteClient electrolyteClient) =>
    {
        try
        {
            var formattedStartDate = startDate.ToString("yyyy-MM-ddTHH:mm:ss.fffzzz");
            var response = await electrolyteClient.GetScheduledClasses(
                venueId,
                false,
                formattedStartDate,
                "all"
            );

            var classes = response.ScheduledClasses.Select(x => new ScheduledClassModel()
            {
                Id = x.Id,
                VenueId = x.VenueId,
                Description = x.Activity.Description,
                DurationSeconds = x.DurationSeconds,
                SpotsAvailable = x.SpotsAvailable,
                StartTime = x.StartTime,
                ClassTypeIcon = x.ClassTypeIcon,
                Activity = x.Activity
            });
            
            return Results.Ok(classes);
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
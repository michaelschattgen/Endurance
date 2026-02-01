using Endurance.API;
using Endurance.API.BackgroundServices;
using Endurance.API.Clients;
using Endurance.API.Interfaces;
using Endurance.API.Interfaces.Repositories;
using Endurance.API.Models.Settings;
using Endurance.API.Repositories;
using Endurance.API.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Refit;

var builder = WebApplication.CreateBuilder(args);
string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddControllers();

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
builder.Services.AddSingleton<IAppVersionProvider>(_ => new AppVersionProvider(initialVersion: "6.19.0"));

builder.Services.AddCors(opt => opt.AddPolicy("CorsPolicy", c =>
{
    c.AllowAnyOrigin()
        .AllowAnyHeader()
        .AllowAnyMethod();
}));

builder.Services.AddTransient<CustomHeadersHandler>();

builder.Services.AddRefitClient<IElectrolyteClient>()
    .ConfigureHttpClient(c => c.BaseAddress = new Uri("https://electrolyte.sportcity.nl/v1"))
    .AddHttpMessageHandler<CustomHeadersHandler>();

builder.Services.AddRefitClient<IMyFitAppClient>()
    .ConfigureHttpClient(c => c.BaseAddress = new Uri("https://reserveer.clubpellikaan.nl"));

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
builder.Services.AddTransient<IEmailService, EmailService>();
builder.Services.AddTransient<INotifyService, NotifyService>();
builder.Services.AddTransient<IMyFitAppService, MyFitAppService>();

builder.Services.AddScoped<TokenService>();

builder.Services.AddHostedService<ClassWatcher>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (!app.Environment.IsProduction())
{
    using var scope = app.Services.CreateScope();
    var ctx = scope.ServiceProvider.GetService<EnduranceDbContext>();
    ctx?.Database.Migrate();
}

app.MapControllers();
app.UseHttpsRedirection();
app.UseCors("CorsPolicy");

app.Run();
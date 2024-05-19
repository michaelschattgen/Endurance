using Endurance.API.Models.Database;
using Microsoft.EntityFrameworkCore;

namespace Endurance.API;

public class EnduranceDbContext : DbContext
{
    public DbSet<NotifierSettingsModel> NotifierSettings { get; set; }
    public DbSet<WatchedClassModel> WatchedClasses { get; set; }

    public EnduranceDbContext(DbContextOptions<EnduranceDbContext> options) 
        : base(options) { }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<NotifierSettingsModel>(entity =>
        {
            entity.Property(e => e.Settings).HasColumnType("json");
        });

        // Ensure that the model configurations match the existing database schema
        base.OnModelCreating(modelBuilder);
    }
}
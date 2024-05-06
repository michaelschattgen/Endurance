using Endurance.API.Interfaces.Repositories;
using Endurance.API.Models.Database;
using Microsoft.EntityFrameworkCore;

namespace Endurance.API.Repositories;

public class WatchedClassRepository : IWatchedClassRepository
{
    private readonly EnduranceDbContext _context;

    public WatchedClassRepository(EnduranceDbContext context)
    {
        _context = context;
    }

    public async Task<List<WatchedClassModel>> GetAllAsync()
    {
        return await _context.WatchedClasses
            .Include(w => w.NotifierSettings)
            .ToListAsync();
    }
}
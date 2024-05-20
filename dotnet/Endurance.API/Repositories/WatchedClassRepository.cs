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

    public async Task<WatchedClassEntity> AddWatchedClass(WatchedClassEntity watchedClassEntity)
    {
        _context.WatchedClasses.Add(watchedClassEntity);
        await _context.SaveChangesAsync();

        return watchedClassEntity;
    }

    public async Task DisableWatchedClass(int id)
    {
        var watchedClass = await _context.WatchedClasses.FirstOrDefaultAsync(wc => wc.Id == id);
        
        if (watchedClass != null)
        {
            watchedClass.IsActive = false;
            _context.Update(watchedClass);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<List<WatchedClassEntity>> GetAllAsync(bool onlyActive)
    {
        return await _context.WatchedClasses
            .Include(w => w.NotifierSettings)
            .Where(x => x.StartDateTime > DateTime.Now && (!onlyActive || x.IsActive))
            .ToListAsync();
    }
}
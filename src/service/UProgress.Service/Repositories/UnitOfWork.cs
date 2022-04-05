using UProgress.Service.Config.Contexts;

namespace UProgress.Service.Repositories;

public class UnitOfWork
{
    private readonly AppDbContext _context;

    public UnitOfWork(AppDbContext context)
    {
        _context = context;
    }

    public async Task SaveAsync()
    {
        await _context.SaveChangesAsync();
    }

    public void Save()
    {
        _context.SaveChanges();
    }
}
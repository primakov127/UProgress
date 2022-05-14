using UProgress.Contracts.Models;
using UProgress.Service.Config.Contexts;
using UProgress.Service.Interfaces;

namespace UProgress.Service.Repositories;

public class DisciplineRepository : IRepository<Discipline>
{
    private readonly AppDbContext _context;

    public DisciplineRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Discipline?> GetById(object id)
    {
        return await _context.Disciplines.FindAsync(id);
    }

    public IQueryable<Discipline> Get()
    {
        return _context.Disciplines;
    }

    public void Insert(Discipline entity)
    {
        _context.Disciplines.Add(entity);
    }

    public void Update(Discipline entity)
    {
        _context.Disciplines.Update(entity);
    }

    public void Delete(Discipline entity)
    {
        _context.Disciplines.Remove(entity);
    }

    public void Delete(object id)
    {
        var discipline = _context.Disciplines.Find(id);
        if (discipline != null)
        {
            _context.Disciplines.Remove(discipline);
        }
    }
}
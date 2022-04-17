using UProgress.Contracts.Models;
using UProgress.Service.Config.Contexts;
using UProgress.Service.Interfaces;

namespace UProgress.Service.Repositories;

public class SpecialityRepository : IRepository<Speciality>
{
    private readonly AppDbContext _context;

    public SpecialityRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Speciality?> GetById(object id)
    {
        return await _context.Specialities.FindAsync(id);
    }

    public IQueryable<Speciality> Get()
    {
        return _context.Specialities;
    }

    public void Insert(Speciality entity)
    {
        _context.Specialities.Add(entity);
    }

    public void Update(Speciality entity)
    {
        _context.Specialities.Update(entity);
    }

    public void Delete(Speciality entity)
    {
        _context.Specialities.Remove(entity);
    }

    public void Delete(object id)
    {
        var speciality = _context.Specialities.Find(id);
        if (speciality != null)
        {
            _context.Specialities.Remove(speciality);
        }
    }
}
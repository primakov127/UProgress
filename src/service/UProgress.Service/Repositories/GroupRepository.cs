using UProgress.Contracts.Models;
using UProgress.Service.Config.Contexts;
using UProgress.Service.Interfaces;

namespace UProgress.Service.Repositories;

public class GroupRepository : IRepository<Group>
{
    private readonly AppDbContext _context;

    public GroupRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Group?> GetById(object id)
    {
        return await _context.Groups.FindAsync(id);
    }

    public IQueryable<Group> Get()
    {
        return _context.Groups;
    }

    public void Insert(Group entity)
    {
        _context.Groups.Add(entity);
    }

    public void Update(Group entity)
    {
        _context.Groups.Update(entity);
    }

    public void Delete(Group entity)
    {
        _context.Groups.Remove(entity);
    }

    public void Delete(object id)
    {
        var group = _context.Groups.Find(id);
        if (group != null)
        {
            _context.Groups.Remove(group);
        }
    }
}
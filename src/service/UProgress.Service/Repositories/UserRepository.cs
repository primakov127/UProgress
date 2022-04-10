using UProgress.Contracts.Models;
using UProgress.Service.Config.Contexts;
using UProgress.Service.Interfaces;

namespace UProgress.Service.Repositories;

public class UserRepository : IRepository<User>
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    public User? GetById(object id)
    {
        return _context.Users.Find(id);
    }

    public IQueryable<User> Get()
    {
        return _context.Users;
    }

    public void Insert(User entity)
    {
        _context.Users.Add(entity);
    }

    public void Update(User entity)
    {
        _context.Users.Update(entity);
    }

    public void Delete(User entity)
    {
        _context.Users.Remove(entity);
    }

    public void Delete(object id)
    {
        var user = _context.Users.Find(id);
        if (user != null)
        {
            _context.Users.Remove(user);
        }
    }
}
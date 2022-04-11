using UProgress.Service.Config.Contexts;
using UProgress.Service.Interfaces;
using Task = UProgress.Contracts.Models.Task;

namespace UProgress.Service.Repositories;

public class TaskRepository : IRepository<Task>
{
    private readonly AppDbContext _context;

    public TaskRepository(AppDbContext context)
    {
        _context = context;
    }

    public Task? GetById(object id)
    {
        return _context.Tasks.Find(id);
    }

    public IQueryable<Task> Get()
    {
        return _context.Tasks;
    }

    public void Insert(Task entity)
    {
        _context.Tasks.Add(entity);
    }

    public void Update(Task entity)
    {
        _context.Tasks.Update(entity);
    }

    public void Delete(Task entity)
    {
        _context.Tasks.Remove(entity);
    }

    public void Delete(object id)
    {
        var task = _context.Tasks.Find(id);
        if (task != null)
        {
            _context.Tasks.Remove(task);
        }
    }
}
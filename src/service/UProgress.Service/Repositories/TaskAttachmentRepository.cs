using UProgress.Contracts.Models;
using UProgress.Service.Config.Contexts;
using UProgress.Service.Interfaces;

namespace UProgress.Service.Repositories;

public class TaskAttachmentRepository : IRepository<TaskAttachment>
{
    private readonly AppDbContext _context;

    public TaskAttachmentRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<TaskAttachment?> GetById(object id)
    {
        return await _context.TaskAttachments.FindAsync(id);
    }

    public IQueryable<TaskAttachment> Get()
    {
        return _context.TaskAttachments;
    }

    public void Insert(TaskAttachment entity)
    {
        _context.TaskAttachments.Add(entity);
    }

    public void Update(TaskAttachment entity)
    {
        _context.TaskAttachments.Update(entity);
    }

    public void Delete(TaskAttachment entity)
    {
        _context.TaskAttachments.Remove(entity);
    }

    public void Delete(object id)
    {
        var attachment = _context.TaskAttachments.Find(id);
        if (attachment != null)
        {
            _context.TaskAttachments.Remove(attachment);
        }
    }
}
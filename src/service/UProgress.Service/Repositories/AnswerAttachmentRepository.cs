using UProgress.Contracts.Models;
using UProgress.Service.Config.Contexts;
using UProgress.Service.Interfaces;

namespace UProgress.Service.Repositories;

public class AnswerAttachmentRepository : IRepository<AnswerAttachment>
{
    private readonly AppDbContext _context;

    public AnswerAttachmentRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<AnswerAttachment?> GetById(object id)
    {
        return await _context.AnswerAttachments.FindAsync(id);
    }

    public IQueryable<AnswerAttachment> Get()
    {
        return _context.AnswerAttachments;
    }

    public void Insert(AnswerAttachment entity)
    {
        _context.AnswerAttachments.Add(entity);
    }

    public void Update(AnswerAttachment entity)
    {
        _context.AnswerAttachments.Update(entity);
    }

    public void Delete(AnswerAttachment entity)
    {
        _context.AnswerAttachments.Remove(entity);
    }

    public void Delete(object id)
    {
        var attachment = _context.AnswerAttachments.Find(id);
        if (attachment != null)
        {
            _context.AnswerAttachments.Remove(attachment);
        }
    }
}
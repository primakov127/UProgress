using UProgress.Contracts.Models;
using UProgress.Service.Config.Contexts;
using UProgress.Service.Interfaces;

namespace UProgress.Service.Repositories;

public class AnswerHistoryRepository : IRepository<AnswerHistory>
{
    private readonly AppDbContext _context;

    public AnswerHistoryRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<AnswerHistory?> GetById(object id)
    {
        return await _context.AnswerHistory.FindAsync(id);
    }

    public IQueryable<AnswerHistory> Get()
    {
        return _context.AnswerHistory;
    }

    public void Insert(AnswerHistory entity)
    {
        _context.AnswerHistory.Add(entity);
    }

    public void Update(AnswerHistory entity)
    {
        _context.AnswerHistory.Update(entity);
    }

    public void Delete(AnswerHistory entity)
    {
        _context.AnswerHistory.Remove(entity);
    }

    public void Delete(object id)
    {
        var answerHistory = _context.AnswerHistory.Find(id);
        if (answerHistory != null)
        {
            _context.AnswerHistory.Remove(answerHistory);
        }
    }
}
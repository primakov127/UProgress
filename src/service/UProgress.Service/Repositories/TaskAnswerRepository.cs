using UProgress.Contracts.Models;
using UProgress.Service.Config.Contexts;
using UProgress.Service.Interfaces;

namespace UProgress.Service.Repositories;

public class TaskAnswerRepository : IRepository<TaskAnswer>
{
    private readonly AppDbContext _context;

    public TaskAnswerRepository(AppDbContext context)
    {
        _context = context;
    }

    public TaskAnswer? GetById(object id)
    {
        return _context.TaskAnswers.Find(id);
    }

    public IQueryable<TaskAnswer> Get()
    {
        return _context.TaskAnswers;
    }

    public void Insert(TaskAnswer entity)
    {
        _context.TaskAnswers.Add(entity);
    }

    public void Update(TaskAnswer entity)
    {
        _context.TaskAnswers.Update(entity);
    }

    public void Delete(TaskAnswer entity)
    {
        _context.TaskAnswers.Remove(entity);
    }

    public void Delete(object id)
    {
        var taskAnswer = _context.TaskAnswers.Find(id);
        if (taskAnswer != null)
        {
            _context.TaskAnswers.Remove(taskAnswer);
        }
    }
}
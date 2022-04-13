using UProgress.Contracts.Models;
using UProgress.Service.Config.Contexts;
using UProgress.Service.Interfaces;

namespace UProgress.Service.Repositories;

public class StudentDisciplineRepository : IRepository<StudentDiscipline>
{
    private readonly AppDbContext _context;

    public StudentDisciplineRepository(AppDbContext context)
    {
        _context = context;
    }

    public StudentDiscipline? GetById(object id)
    {
        return _context.UserDisciplines.Find(id);
    }

    public IQueryable<StudentDiscipline> Get()
    {
        return _context.UserDisciplines;
    }

    public void Insert(StudentDiscipline entity)
    {
        _context.UserDisciplines.Add(entity);
    }

    public void Update(StudentDiscipline entity)
    {
        _context.UserDisciplines.Update(entity);
    }

    public void Delete(StudentDiscipline entity)
    {
        _context.UserDisciplines.Remove(entity);
    }

    public void Delete(object id)
    {
        var studentDiscipline = _context.UserDisciplines.Find(id);
        if (studentDiscipline != null)
        {
            _context.UserDisciplines.Remove(studentDiscipline);
        }
    }
}
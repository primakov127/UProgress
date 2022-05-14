using UProgress.Contracts.Models;
using UProgress.Service.Config.Contexts;
using UProgress.Service.Interfaces;

namespace UProgress.Service.Repositories;

public class TeacherGroupDisciplineRepository : IRepository<TeacherGroupDiscipline>
{
    private readonly AppDbContext _context;


    public TeacherGroupDisciplineRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<TeacherGroupDiscipline?> GetById(object id)
    {
        return await _context.TeacherGroupDisciplines.FindAsync(id);
    }

    public IQueryable<TeacherGroupDiscipline> Get()
    {
        return _context.TeacherGroupDisciplines;
    }

    public void Insert(TeacherGroupDiscipline entity)
    {
        _context.TeacherGroupDisciplines.Add(entity);
    }

    public void Update(TeacherGroupDiscipline entity)
    {
        _context.TeacherGroupDisciplines.Update(entity);
    }

    public void Delete(TeacherGroupDiscipline entity)
    {
        _context.TeacherGroupDisciplines.Remove(entity);
    }

    public void Delete(object id)
    {
        var teacherGroupDiscipline = _context.TeacherGroupDisciplines.Find(id);
        if (teacherGroupDiscipline != null)
        {
            _context.TeacherGroupDisciplines.Remove(teacherGroupDiscipline);
        }
    }
}
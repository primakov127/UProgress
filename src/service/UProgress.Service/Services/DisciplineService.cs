using UProgress.Contracts.Models;
using UProgress.Service.Repositories;
using Task = UProgress.Contracts.Models.Task;

namespace UProgress.Service.Services;

public class DisciplineService
{
    private readonly DisciplineRepository _disciplineRepository;
    private readonly TaskRepository _taskRepository;
    private readonly UnitOfWork _unitOfWork;

    public DisciplineService(DisciplineRepository disciplineRepository, UnitOfWork unitOfWork,
        TaskRepository taskRepository)
    {
        _disciplineRepository = disciplineRepository;
        _unitOfWork = unitOfWork;
        _taskRepository = taskRepository;
    }

    public async Task<Guid> CreateDiscipline(string name, string description, int semester, DisciplineType type,
        Guid specialityId)
    {
        var discipline = new Discipline
        {
            Name = name,
            Description = description,
            Semester = semester,
            Type = type,
            SpecialityId = specialityId
        };

        _disciplineRepository.Insert(discipline);
        await _unitOfWork.SaveAsync();

        return discipline.Id;
    }

    public async Task<bool> DeleteDiscipline(Guid id)
    {
        var discipline = _disciplineRepository.GetById(id);
        if (discipline == null)
        {
            return false;
        }

        _disciplineRepository.Delete(discipline);
        await _unitOfWork.SaveAsync();

        return true;
    }

    public async Task<Guid> CreateTask(Guid disciplineId, string name, string description, bool isRequired)
    {
        var task = new Task
        {
            Name = name,
            Description = description,
            IsRequired = isRequired,
            DisciplineId = disciplineId
        };

        _taskRepository.Insert(task);
        await _unitOfWork.SaveAsync();

        return task.Id;
    }
    
    public async Task<bool> DeleteTask(Guid id)
    {
        var task = _taskRepository.GetById(id);
        if (task == null)
        {
            return false;
        }

        _taskRepository.Delete(task);
        await _unitOfWork.SaveAsync();

        return true;
    }
}
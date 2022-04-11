using UProgress.Contracts.Models;
using UProgress.Service.Repositories;

namespace UProgress.Service.Services;

public class DisciplineService
{
    private readonly DisciplineRepository _disciplineRepository;
    private readonly UnitOfWork _unitOfWork;

    public DisciplineService(DisciplineRepository disciplineRepository, UnitOfWork unitOfWork)
    {
        _disciplineRepository = disciplineRepository;
        _unitOfWork = unitOfWork;
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
}
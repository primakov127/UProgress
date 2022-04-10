using UProgress.Contracts.Models;
using UProgress.Service.Repositories;

namespace UProgress.Service.Services;

public class GroupService
{
    private readonly GroupRepository _groupRepository;
    private readonly SpecialityRepository _specialityRepository;
    private readonly UnitOfWork _unitOfWork;

    public GroupService(GroupRepository groupRepository, SpecialityRepository specialityRepository,
        UnitOfWork unitOfWork)
    {
        _groupRepository = groupRepository;
        _specialityRepository = specialityRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> CreateGroup(int startYear, int graduatedYear, int number, Guid headId, Guid specialityId)
    {
        var speciality = _specialityRepository.GetById(specialityId);
        var groupName = $"{speciality.ShortName} {startYear}-{number}";
        var group = new Group
        {
            StartYear = startYear,
            GraduatedYear = graduatedYear,
            Number = number,
            Name = groupName,
            HeadId = headId,
            SpecialityId = specialityId
        };

        _groupRepository.Insert(group);
        await _unitOfWork.SaveAsync();

        return group.Id;
    }

    public async Task<bool> DeleteGroup(Guid id)
    {
        var group = _groupRepository.GetById(id);
        if (group == null)
        {
            return false;
        }

        _groupRepository.Delete(group);
        await _unitOfWork.SaveAsync();

        return true;
    }
}
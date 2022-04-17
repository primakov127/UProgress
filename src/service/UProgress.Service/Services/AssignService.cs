using Microsoft.EntityFrameworkCore;
using UProgress.Contracts.Models;
using UProgress.Service.Repositories;

namespace UProgress.Service.Services;

public class AssignService
{
    private readonly StudentDisciplineRepository _studentDisciplineRepository;
    private readonly TeacherGroupDisciplineRepository _teacherGroupDisciplineRepository;
    private readonly UserRepository _userRepository;
    private readonly DisciplineRepository _disciplineRepository;
    private readonly GroupRepository _groupRepository;
    private readonly UnitOfWork _unitOfWork;

    public AssignService(StudentDisciplineRepository studentDisciplineRepository,
        TeacherGroupDisciplineRepository teacherGroupDisciplineRepository, UnitOfWork unitOfWork,
        UserRepository userRepository, DisciplineRepository disciplineRepository, GroupRepository groupRepository)
    {
        _studentDisciplineRepository = studentDisciplineRepository;
        _teacherGroupDisciplineRepository = teacherGroupDisciplineRepository;
        _unitOfWork = unitOfWork;
        _userRepository = userRepository;
        _disciplineRepository = disciplineRepository;
        _groupRepository = groupRepository;
    }

    public async Task<bool> AssignDisciplineToStudent(Guid disciplineId, Guid studentId)
    {
        var discipline = await _disciplineRepository.GetById(disciplineId);
        if (discipline == null)
        {
            return false;
        }

        var student = await _userRepository.GetById(studentId);
        if (student == null)
        {
            return false;
        }

        var studentDiscipline = new StudentDiscipline
        {
            IsAvailable = true,
            StudentId = student.Id,
            DisciplineId = discipline.Id
        };

        _studentDisciplineRepository.Insert(studentDiscipline);
        await _unitOfWork.SaveAsync();

        return true;
    }

    public async Task<bool> AssignDisciplineToGroup(Guid disciplineId, Guid groupId, Guid firstTeacherId,
        Guid? secondTeacherId)
    {
        var discipline = await _disciplineRepository.GetById(disciplineId);
        if (discipline == null)
        {
            return false;
        }

        var group = await _groupRepository.GetById(groupId);
        if (group == null)
        {
            return false;
        }

        var firstTeacher = await _userRepository.GetById(firstTeacherId);
        if (firstTeacher == null)
        {
            return false;
        }

        var secondTeacher = secondTeacherId == null ? null : await _userRepository.GetById(secondTeacherId);
        if (secondTeacher == null || secondTeacher.Id == firstTeacher.Id)
        {
            var teacherGroupDiscipline = new TeacherGroupDiscipline
            {
                SubGroup = SubGroupType.Full,
                TeacherId = firstTeacher.Id,
                GroupId = group.Id,
                DisciplineId = discipline.Id
            };

            _teacherGroupDisciplineRepository.Insert(teacherGroupDiscipline);
        }
        else
        {
            var teacherFirstSubGroupDiscipline = new TeacherGroupDiscipline
            {
                SubGroup = SubGroupType.First,
                TeacherId = firstTeacher.Id,
                GroupId = group.Id,
                DisciplineId = discipline.Id
            };

            var teacherSecondSubGroupDiscipline = new TeacherGroupDiscipline
            {
                SubGroup = SubGroupType.Second,
                TeacherId = secondTeacher.Id,
                GroupId = group.Id,
                DisciplineId = discipline.Id
            };

            _teacherGroupDisciplineRepository.Insert(teacherFirstSubGroupDiscipline);
            _teacherGroupDisciplineRepository.Insert(teacherSecondSubGroupDiscipline);
        }

        var studentIdsAlreadyHaveDisciplines = _disciplineRepository.Get().Include(d => d.DisciplineStudents)
            .First(d => d.Id == disciplineId)
            .DisciplineStudents.Select(s => s.StudentId);

        _userRepository.Get().Where(u => u.GroupId == groupId && !studentIdsAlreadyHaveDisciplines.Contains(u.Id))
            .ToList().ForEach(s =>
                _studentDisciplineRepository.Insert(new StudentDiscipline
                {
                    IsAvailable = true,
                    StudentId = s.Id,
                    DisciplineId = discipline.Id
                }));

        await _unitOfWork.SaveAsync();

        return true;
    }
}
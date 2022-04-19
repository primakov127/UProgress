using System.Linq.Expressions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UProgress.Contracts.Messages;
using UProgress.Contracts.Models;
using UProgress.Service.Repositories;
using UProgress.Service.Services;

namespace UProgress.Service.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AssignController : ControllerBase
{
    private readonly AssignService _assignService;
    private readonly UserService _userService;
    private readonly StudentDisciplineRepository _studentDisciplineRepository;
    private readonly TeacherGroupDisciplineRepository _teacherGroupDisciplineRepository;
    private readonly DisciplineRepository _disciplineRepository;
    private readonly GroupRepository _groupRepository;
    private readonly UnitOfWork _unitOfWork;

    public AssignController(AssignService assignService, StudentDisciplineRepository studentDisciplineRepository,
        TeacherGroupDisciplineRepository teacherGroupDisciplineRepository, UserService userService,
        DisciplineRepository disciplineRepository, GroupRepository groupRepository, UnitOfWork unitOfWork)
    {
        _assignService = assignService;
        _studentDisciplineRepository = studentDisciplineRepository;
        _teacherGroupDisciplineRepository = teacherGroupDisciplineRepository;
        _userService = userService;
        _disciplineRepository = disciplineRepository;
        _groupRepository = groupRepository;
        _unitOfWork = unitOfWork;
    }

    [HttpPost("assigndisciplinetostudent")]
    public async Task<IActionResult> AssignDisciplineToStudent(AssignDisciplineToStudent message)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        var isAlreadyAssigned = _studentDisciplineRepository.Get()
            .Any(sd => sd.DisciplineId == message.DisciplineId && sd.StudentId == message.StudentId);
        if (isAlreadyAssigned)
        {
            return BadRequest(new ApiBadRequest("Дисциплина уже назначена"));
        }

        var isDisciplineAssigned =
            await _assignService.AssignDisciplineToStudent(message.DisciplineId, message.StudentId);
        if (!isDisciplineAssigned)
        {
            return BadRequest();
        }

        return Ok();
    }

    [HttpPost("assigndisciplinetogroup")]
    public async Task<IActionResult> AssignDisciplineToGroup(AssignDisciplineToGroup message)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        var isDisciplineAssigned = await _assignService.AssignDisciplineToGroup(message.DisciplineId, message.GroupId,
            message.FirstSubGroupTeacherId, message.SecondSubGroupTeacherId);
        if (!isDisciplineAssigned)
        {
            return BadRequest();
        }

        return Ok();
    }

    [HttpGet("mygroupdisciplines")]
    public async Task<IActionResult> GetMyGroupDisciplines()
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        var teacher = await _userService.GetUserByHttpContext(HttpContext);
        if (teacher == null)
        {
            return BadRequest();
        }

        var result = _teacherGroupDisciplineRepository.Get().Where(tgd => tgd.TeacherId == teacher.Id)
            .Include(tgd => tgd.Group).Include(tgd => tgd.Discipline).Select(tgd => new GetMyGroupDisciplinesResult
            {
                Id = tgd.Id,
                TeacherId = tgd.TeacherId,
                SubGroupType = tgd.SubGroup,
                GroupId = tgd.GroupId,
                GroupName = tgd.Group.Name,
                DisciplineId = tgd.DisciplineId,
                DisciplineName = tgd.Discipline.Name,
                DisciplineSemester = tgd.Discipline.Semester,
                DisciplineType = tgd.Discipline.Type
            });

        return Ok(result);
    }

    [HttpPost("getgroupdiscipline")]
    public async Task<IActionResult> GetGroupDiscipline(GetGroupDiscipline message)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        var discipline = _disciplineRepository.Get().Include(d => d.Tasks)
            .FirstOrDefault(d => d.Id == message.DisciplineId);
        if (discipline == null)
        {
            return BadRequest();
        }

        var group = _groupRepository.Get().Include(g => g.Students).ThenInclude(s => s.StudentTaskAnswers)
            .Include(g => g.Students).ThenInclude(s => s.StudentDisciplines)
            .FirstOrDefault(g => g.Id == message.GroupId);
        if (group == null)
        {
            return BadRequest();
        }

        var tasks = discipline.Tasks.Select(t =>
            new GetGroupDisciplineTask
            {
                TaskId = t.Id,
                Name = t.Name,
                IsRequired = t.IsRequired
            });

        var students = group.Students.Where(s =>
            message.SubGroupType == SubGroupType.Full || s.SubGroup == message.SubGroupType).Select(s =>
            new GetGroupDisciplineStudent
            {
                StudentId = s.Id,
                FullName = s.FullName,
                FinalMark = s.StudentDisciplines.FirstOrDefault(sd => sd.DisciplineId == discipline.Id)?.Mark,
                TaskAnswers = s.StudentTaskAnswers.Where(ta => tasks.Any(t => t.TaskId == ta.TaskId)).Select(ta =>
                    new GetGroupDisciplineTaskAnswer
                    {
                        TaskId = ta.TaskId,
                        TaskAnswerId = ta.Id,
                        Mark = ta.Mark,
                        Status = ta.Status
                    })
            });

        var result = new GetGroupDisciplineResult
        {
            GroupId = group.Id,
            GroupName = group.Name,
            DisciplineId = discipline.Id,
            DisciplineName = discipline.Name,
            DisciplineType = discipline.Type,
            Students = students,
            Tasks = tasks
        };

        return Ok(result);
    }

    [HttpPost("getgroupsessionaccess")]
    public async Task<IActionResult> GetGroupSessionAccess(GetGroupSessionAccess message)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        var group = _groupRepository.Get().Include(g => g.Students).ThenInclude(s => s.StudentDisciplines)
            .FirstOrDefault(g => g.Id == message.GroupId);
        if (group == null)
        {
            return BadRequest();
        }

        var accessTypes = new List<DisciplineType> {DisciplineType.Mark, DisciplineType.NoMark, DisciplineType.Project};
        var studentHasAccessIds = new List<Guid>();
        var disciplines = _disciplineRepository.Get().Where(d =>
                d.SpecialityId == group.SpecialityId && d.Semester == message.Semester && accessTypes.Contains(d.Type))
            .ToList();

        group.Students.ToList().ForEach(s =>
        {
            var sDisciplines = s.StudentDisciplines;
            var hasAccess = disciplines.All(d => sDisciplines.FirstOrDefault(sd => sd.DisciplineId == d.Id)?.Mark >= 4);
            if (hasAccess)
            {
                studentHasAccessIds.Add(s.Id);
            }
        });

        var result = new GetGroupSessionAccessResult
        {
            Students = group.Students.Select(s => new GetGroupSessionAccessStudent
            {
                StudentId = s.Id,
                FullName = s.FullName,
                Access = studentHasAccessIds.Contains(s.Id)
            })
        };

        return Ok(result);
    }

    [HttpPost("changefinalmarks")]
    public async Task<IActionResult> ChangeFinalMarks(ChangeFinalMarks message)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        var studentDisciplines = _studentDisciplineRepository.Get().Where(sd =>
                sd.DisciplineId == message.DisciplineId).ToList()
            .Where(sd => message.Students.Any(s => s.StudentId == sd.StudentId)).ToList();

        foreach (var studentDiscipline in studentDisciplines)
        {
            var studentMark = message.Students.FirstOrDefault(s => s.StudentId == studentDiscipline.StudentId)?.Mark;
            studentDiscipline.Mark = studentMark ?? studentDiscipline.Mark;
        }

        studentDisciplines.ForEach(_studentDisciplineRepository.Update);
        await _unitOfWork.SaveAsync();

        return Ok();
    }

    [HttpPost("selectstudents")]
    public async Task<IActionResult> SelectStudents(SelectStudents message)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        Expression<Func<StudentDiscipline, bool>> greater = sd =>
            sd.DisciplineId == message.DisciplineId && sd.Mark > message.Mark;
        Expression<Func<StudentDiscipline, bool>> less = sd =>
            sd.DisciplineId == message.DisciplineId && sd.Mark < message.Mark;
        Expression<Func<StudentDiscipline, bool>> equal = sd =>
            sd.DisciplineId == message.DisciplineId && sd.Mark == message.Mark;

        var predicate = message.Operator switch
        {
            "БОЛЬШЕ" => greater,
            "МЕНЬШЕ" => less,
            "РАВНО" => equal,
            _ => greater
        };

        var studentsDisciplines = _studentDisciplineRepository.Get().Include(sd => sd.Student).ThenInclude(s => s.Group)
            .Where(predicate);

        var result = new SelectStudentsResult
        {
            Students = studentsDisciplines.Select(sd => new SelectStudentsResultStudent
            {
                StudentId = sd.Student.Id,
                StudentName = sd.Student.FullName,
                GroupId = sd.Student.Group.Id,
                GroupName = sd.Student.Group.Name
            })
        };

        return Ok(result);
    }
}
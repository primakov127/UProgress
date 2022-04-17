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

    public AssignController(AssignService assignService, StudentDisciplineRepository studentDisciplineRepository,
        TeacherGroupDisciplineRepository teacherGroupDisciplineRepository, UserService userService,
        DisciplineRepository disciplineRepository, GroupRepository groupRepository)
    {
        _assignService = assignService;
        _studentDisciplineRepository = studentDisciplineRepository;
        _teacherGroupDisciplineRepository = teacherGroupDisciplineRepository;
        _userService = userService;
        _disciplineRepository = disciplineRepository;
        _groupRepository = groupRepository;
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
            Students = students,
            Tasks = tasks
        };

        return Ok(result);
    }
}
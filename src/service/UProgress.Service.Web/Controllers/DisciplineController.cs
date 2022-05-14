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
public class DisciplineController : ControllerBase
{
    private readonly DisciplineRepository _disciplineRepository;
    private readonly TaskRepository _taskRepository;
    private readonly StudentDisciplineRepository _studentDisciplineRepository;
    private readonly TaskAnswerRepository _taskAnswerRepository;
    private readonly DisciplineService _disciplineService;
    private readonly UserService _userService;
    private readonly UserRepository _userRepository;
    private readonly UnitOfWork _unitOfWork;

    public DisciplineController(DisciplineService disciplineService, DisciplineRepository disciplineRepository,
        TaskRepository taskRepository, UserService userService, StudentDisciplineRepository studentDisciplineRepository,
        TaskAnswerRepository taskAnswerRepository, UserRepository userRepository, UnitOfWork unitOfWork)
    {
        _disciplineService = disciplineService;
        _disciplineRepository = disciplineRepository;
        _taskRepository = taskRepository;
        _userService = userService;
        _studentDisciplineRepository = studentDisciplineRepository;
        _taskAnswerRepository = taskAnswerRepository;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateDiscipline(CreateDiscipline message)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        var disciplineId = await _disciplineService.CreateDiscipline(message.Name, message.Description,
            message.Semester,
            message.Type, message.SpecialityId);

        return Ok(new CreateDisciplineResult
        {
            DisciplineId = disciplineId
        });
    }

    [HttpGet("getdisciplinelist")]
    public async Task<IActionResult> GetDisciplineList()
    {
        var result = _disciplineRepository.Get().Include(d => d.Speciality).Select(d => new GetDisciplineListResult
        {
            Id = d.Id,
            Name = d.Name,
            Semester = d.Semester,
            Type = d.Type,
            SpecialityShortName = d.Speciality.ShortName
        });

        return Ok(result);
    }

    [HttpPost("delete")]
    public async Task<IActionResult> DeleteDiscipline(DeleteDiscipline message)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        var isDisciplineDeleted = await _disciplineService.DeleteDiscipline(message.DisciplineId);
        if (!isDisciplineDeleted)
        {
            return BadRequest();
        }

        return Ok();
    }
    
    [HttpPost("updatediscipline")]
    public async Task<IActionResult> UpdateDiscipline(UpdateDiscipline message)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        var discipline = _disciplineRepository.Get().FirstOrDefault(d => d.Id == message.Id);
        if (discipline == null)
        {
            return BadRequest();
        }

        discipline.Name = message.Name;
        discipline.Description = message.Description;
        discipline.Semester = message.Semester;
        discipline.Type = message.Type;
        discipline.SpecialityId = message.SpecialityId;

        _disciplineRepository.Update(discipline);
        await _unitOfWork.SaveAsync();

        return Ok();
    }
    
    [HttpPost("updatetask")]
    public async Task<IActionResult> UpdateTask(UpdateTask message)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        var task = _taskRepository.Get().FirstOrDefault(t => t.Id == message.Id);
        if (task == null)
        {
            return BadRequest();
        }

        task.Name = message.Name;
        task.Description = message.Description;
        task.IsRequired = message.IsRequired;

        _taskRepository.Update(task);
        await _unitOfWork.SaveAsync();

        return Ok();
    }

    [HttpPost("createtask")]
    public async Task<IActionResult> CreateTask(CreateTask message)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        var taskId = await _disciplineService.CreateTask(message.DisciplineId, message.Name, message.Description,
            message.IsRequired);

        return Ok(new CreateTaskResult
        {
            TaskId = taskId
        });
    }

    [HttpPost("deletetask")]
    public async Task<IActionResult> DeleteTask(DeleteTask message)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        var isTaskDeleted = await _disciplineService.DeleteTask(message.TaskId);
        if (!isTaskDeleted)
        {
            return BadRequest();
        }

        return Ok();
    }

    [HttpPost("getdiscipline")]
    public async Task<IActionResult> GetDisciplineAsync(GetDiscipline message)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        var discipline = _disciplineRepository.Get().Include(d => d.Speciality)
            .FirstOrDefault(d => d.Id == message.DisciplineId);
        if (discipline == null)
        {
            return BadRequest();
        }

        var disciplineTasks = _taskRepository.Get().Where(t => t.DisciplineId == discipline.Id).Select(t =>
            new GetDisciplineResultTask
            {
                Id = t.Id,
                Name = t.Name,
                IsRequired = t.IsRequired
            });

        var result = new GetDisciplineResult
        {
            Id = discipline.Id,
            Name = discipline.Name,
            Description = discipline.Description,
            Semester = discipline.Semester,
            Type = discipline.Type,
            SpecialityId = discipline.SpecialityId,
            SpecialityShortName = discipline.Speciality.ShortName,
            Tasks = disciplineTasks
        };

        return Ok(result);
    }

    [HttpPost("gettask")]
    public async Task<IActionResult> GetTaskAsync(GetTask message)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        var task = _taskRepository.Get().Include(t => t.Discipline).Include(t => t.Attachments)
            .FirstOrDefault(t => t.Id == message.TaskId);
        if (task == null)
        {
            return BadRequest();
        }

        var user = await _userService.GetUserByHttpContext(HttpContext);
        var taskAnswer = _taskAnswerRepository.Get()
            .FirstOrDefault(ta => user != null && ta.StudentId == user.Id && ta.TaskId == task.Id);

        var result = new GetTaskResult
        {
            Id = task.Id,
            Name = task.Name,
            Description = task.Description,
            IsRequired = task.IsRequired,
            DisciplineId = task.DisciplineId,
            DisciplineName = task.Discipline.Name,
            TaskAnswerId = taskAnswer?.Id,
            Attachments = task.Attachments.Select(a => new GetTaskResultAttachment
            {
                Id = a.Id,
                Name = a.Name,
                Extension = a.Extension,
                TaskId = a.TaskId
            })
        };

        return Ok(result);
    }

    [HttpGet("mydisciplines")]
    public async Task<IActionResult> GetMyDisciplines()
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        var student = await _userService.GetUserByHttpContext(HttpContext);
        if (student == null)
        {
            return BadRequest();
        }

        var result = _studentDisciplineRepository.Get().Where(sd => sd.StudentId == student.Id)
            .Include(sd => sd.Discipline).ThenInclude(d => d.Speciality).Include(sd => sd.Discipline)
            .ThenInclude(d => d.Tasks).ThenInclude(t => t.Answers).Select(sd =>
                new GetMyDisciplinesResult
                {
                    Id = sd.Discipline.Id,
                    Name = sd.Discipline.Name,
                    Semester = sd.Discipline.Semester,
                    Type = sd.Discipline.Type,
                    SpecialityShortName = sd.Discipline.Speciality.ShortName,
                    FinalMark = sd.Mark,
                    Progress = (int) ((double) sd.Discipline.Tasks.Select(t =>
                            t.Answers.FirstOrDefault(a =>
                                a.StudentId == sd.StudentId && a.Status == AnswerStatus.Approved))
                        .Count(ta => ta != null) / (double) sd.Discipline.Tasks.Count * 100)
                });

        return Ok(result);
    }

    [HttpPost("studentdisciplines")]
    public async Task<IActionResult> GetStudentDisciplines(GetStudentDisciplines message)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        var student = await _userRepository.GetById(message.StudentId);
        if (student == null)
        {
            return BadRequest();
        }

        var result = _studentDisciplineRepository.Get().Where(sd => sd.StudentId == student.Id)
            .Include(sd => sd.Discipline).ThenInclude(d => d.Speciality).Include(sd => sd.Discipline)
            .ThenInclude(d => d.Tasks).ThenInclude(t => t.Answers).Select(sd =>
                new GetStudentDisciplinesResult
                {
                    Id = sd.Discipline.Id,
                    Name = sd.Discipline.Name,
                    Semester = sd.Discipline.Semester,
                    Type = sd.Discipline.Type,
                    SpecialityShortName = sd.Discipline.Speciality.ShortName,
                    FinalMark = sd.Mark,
                    Progress = (int) ((double) sd.Discipline.Tasks.Select(t =>
                            t.Answers.FirstOrDefault(a =>
                                a.StudentId == sd.StudentId && a.Status == AnswerStatus.Approved))
                        .Count(ta => ta != null) / (double) sd.Discipline.Tasks.Count * 100)
                });

        return Ok(result);
    }
}
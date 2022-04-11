using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UProgress.Contracts.Messages;
using UProgress.Service.Repositories;
using UProgress.Service.Services;

namespace UProgress.Service.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DisciplineController : ControllerBase
{
    private readonly DisciplineRepository _disciplineRepository;
    private readonly TaskRepository _taskRepository;
    private readonly DisciplineService _disciplineService;

    public DisciplineController(DisciplineService disciplineService, DisciplineRepository disciplineRepository,
        TaskRepository taskRepository)
    {
        _disciplineService = disciplineService;
        _disciplineRepository = disciplineRepository;
        _taskRepository = taskRepository;
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

        var discipline = _disciplineRepository.GetById(message.DisciplineId);
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

        var task = _taskRepository.GetById(message.TaskId);
        if (task == null)
        {
            return BadRequest();
        }

        var result = new GetTaskResult
        {
            Id = task.Id,
            Name = task.Name,
            Description = task.Description,
            IsRequired = task.IsRequired,
            DisciplineId = task.DisciplineId
        };

        return Ok(result);
    }
}
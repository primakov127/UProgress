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
    private readonly DisciplineService _disciplineService;

    public DisciplineController(DisciplineService disciplineService, DisciplineRepository disciplineRepository)
    {
        _disciplineService = disciplineService;
        _disciplineRepository = disciplineRepository;
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
}
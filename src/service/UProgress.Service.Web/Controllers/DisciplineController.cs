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
}
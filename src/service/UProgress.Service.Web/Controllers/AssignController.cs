using Microsoft.AspNetCore.Mvc;
using UProgress.Contracts.Messages;
using UProgress.Service.Repositories;
using UProgress.Service.Services;

namespace UProgress.Service.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AssignController : ControllerBase
{
    private readonly AssignService _assignService;
    private readonly StudentDisciplineRepository _studentDisciplineRepository;

    public AssignController(AssignService assignService, StudentDisciplineRepository studentDisciplineRepository)
    {
        _assignService = assignService;
        _studentDisciplineRepository = studentDisciplineRepository;
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
}
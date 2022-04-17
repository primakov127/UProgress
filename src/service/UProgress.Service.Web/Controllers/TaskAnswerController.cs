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
public class TaskAnswerController : ControllerBase
{
    private readonly TaskAnswerService _taskAnswerService;
    private readonly TaskAnswerRepository _taskAnswerRepository;
    private readonly UserService _userService;

    public TaskAnswerController(TaskAnswerService taskAnswerService, TaskAnswerRepository taskAnswerRepository,
        UserService userService)
    {
        _taskAnswerService = taskAnswerService;
        _taskAnswerRepository = taskAnswerRepository;
        _userService = userService;
    }

    [HttpPost("createtaskanswer")]
    public async Task<IActionResult> CreateTaskAnswer(CreateTaskAnswer message)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        var taskAnswerId = await _taskAnswerService.CreateTaskAnswer(message.Answer, message.TaskId, message.StudentId);
        await _taskAnswerService.CreateAnswerHistory(AnswerStatus.Draft, message.StudentId, taskAnswerId,
            "Ответ создан");

        return Ok(new CreateTaskAnswerResult
        {
            TaskAnswerId = taskAnswerId
        });
    }

    [HttpPost("gettaskanswer")]
    public async Task<IActionResult> GetTaskAnswer(GetTaskAnswer message)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        var taskAnswer = _taskAnswerRepository.Get().Include(ta => ta.History).ThenInclude(h => h.User)
            .Include(ta => ta.Task).ThenInclude(t => t.Discipline)
            .FirstOrDefault(ta => ta.Id == message.TaskAnswerId);
        if (taskAnswer == null)
        {
            return BadRequest();
        }

        var result = new GetTaskAnswerResult
        {
            Id = taskAnswer.Id,
            Mark = taskAnswer.Mark,
            Answer = taskAnswer.Answer,
            Status = taskAnswer.Status,
            TaskId = taskAnswer.TaskId,
            TaskName = taskAnswer.Task.Name,
            StudentId = taskAnswer.StudentId,
            ApprovedById = taskAnswer.ApprovedById,
            DisciplineId = taskAnswer.Task.Discipline.Id,
            DisciplineName = taskAnswer.Task.Discipline.Name,
            History = taskAnswer.History.Select(h => new GetTaskAnswerResultHistory
            {
                Date = h.Date,
                StatusMovedTo = h.StatusMovedTo,
                Message = h.Message,
                UserId = h.UserId,
                AnswerId = h.AnswerId,
                User = new GetTaskAnswerResultHistoryUser
                {
                    UserId = h.User.Id,
                    FullName = h.User.FullName
                }
            }).ToList()
        };

        return Ok(result);
    }

    [HttpPost("requestapprove")]
    public async Task<IActionResult> RequestApprove(RequestApprove message)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        var isApproveRequested =
            await _taskAnswerService.RequestApprove(message.TaskAnswerId, message.Message, message.Answer);
        if (!isApproveRequested)
        {
            return BadRequest();
        }

        return Ok();
    }

    [HttpPost("approve")]
    public async Task<IActionResult> Approve(Approve message)
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

        var isApproved =
            await _taskAnswerService.Approve(message.TaskAnswerId, teacher.Id, message.Message, message.Mark);
        if (!isApproved)
        {
            return BadRequest();
        }


        return Ok();
    }

    [HttpPost("reject")]
    public async Task<IActionResult> Reject(Reject message)
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

        var isRejected =
            await _taskAnswerService.Reject(message.TaskAnswerId, teacher.Id, message.Message);
        if (!isRejected)
        {
            return BadRequest();
        }

        return Ok();
    }
}
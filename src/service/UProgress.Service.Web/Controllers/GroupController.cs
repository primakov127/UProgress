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
public class GroupController : ControllerBase
{
    private readonly GroupRepository _groupRepository;
    private readonly SpecialityRepository _specialityRepository;
    private readonly GroupService _groupService;
    private readonly UserService _userService;

    public GroupController(GroupRepository groupRepository, SpecialityRepository specialityRepository,
        GroupService groupService, UserService userService)
    {
        _groupRepository = groupRepository;
        _specialityRepository = specialityRepository;
        _groupService = groupService;
        _userService = userService;
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateGroup(CreateGroup message)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        var groupId = await _groupService.CreateGroup(message.StartYear, message.GraduatedYear, message.Number,
            message.HeadId, message.SpecialityId);

        var students = message.Students;

        if (!students.Exists(s => s.StudentId == message.HeadId))
        {
            students.Add(new CreateGroupStudent
            {
                StudentId = message.HeadId,
                SubGroupType = SubGroupType.First
            });
        }

        if (students.Count != 0)
        {
            await _userService.SetStudentsGroup(groupId, students.ToDictionary(x => x.StudentId, x => x.SubGroupType));
        }

        return Ok(new CreateGroupResult
        {
            GroupId = groupId
        });
    }

    [HttpGet("getgrouplist")]
    public async Task<IActionResult> GetGroupList()
    {
        var result = _groupRepository.Get().Include(g => g.Head).Select(g => new GetGroupListResult
        {
            Id = g.Id,
            Name = g.Name,
            HeadId = g.HeadId,
            HeadName = g.Head.FullName
        });

        return Ok(result);
    }

    [HttpGet("getspecialitylist")]
    public async Task<IActionResult> GetSpecialityList()
    {
        var result = _specialityRepository.Get().Select(s => new GetSpecialityListResult
        {
            Id = s.Id,
            ShortName = s.ShortName,
            Name = s.Name,
            SemesterCount = s.SemesterCount
        });

        return Ok(result);
    }

    [HttpPost("delete")]
    public async Task<IActionResult> DeleteGroup(DeleteGroup message)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        var isGroupDeleted = await _groupService.DeleteGroup(message.GroupId);
        if (!isGroupDeleted)
        {
            return BadRequest();
        }

        return Ok();
    }
}
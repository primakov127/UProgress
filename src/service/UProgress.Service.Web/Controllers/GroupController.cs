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
    private readonly UserRepository _userRepository;
    private readonly GroupService _groupService;
    private readonly UserService _userService;
    private readonly UnitOfWork _unitOfWork;

    public GroupController(GroupRepository groupRepository, SpecialityRepository specialityRepository,
        GroupService groupService, UserService userService, UnitOfWork unitOfWork, UserRepository userRepository)
    {
        _groupRepository = groupRepository;
        _specialityRepository = specialityRepository;
        _groupService = groupService;
        _userService = userService;
        _unitOfWork = unitOfWork;
        _userRepository = userRepository;
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

    [HttpPost("getgroup")]
    public async Task<IActionResult> GetGroup(GetGroup message)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        var group = _groupRepository.Get().Include(g => g.Head).Include(g => g.Students).Include(g => g.Speciality)
            .FirstOrDefault(g => g.Id == message.GroupId);
        if (group == null)
        {
            return BadRequest();
        }

        var result = new GetGroupResult
        {
            Id = group.Id,
            StartYear = group.StartYear,
            GraduatedYear = group.GraduatedYear,
            Number = group.Number,
            HeadId = group.Head.Id,
            HeadName = group.Head.FullName,
            SpecialityId = group.Speciality.Id,
            SpecialityShortName = group.Speciality.ShortName,
            Students = group.Students.Select(s => new GetGroupStudent
            {
                StudentId = s.Id,
                StudentName = s.FullName,
                SubGroupType = s.SubGroup
            })
        };

        return Ok(result);
    }

    [HttpPost("updategroup")]
    public async Task<IActionResult> UpdateGroup(UpdateGroup message)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        var group = _groupRepository.Get().Include(g => g.Speciality).FirstOrDefault(g => g.Id == message.GroupId);
        if (group == null)
        {
            return BadRequest();
        }

        group.StartYear = message.StartYear;
        group.GraduatedYear = message.GraduatedYear;
        group.Number = message.Number;
        group.HeadId = message.HeadId;
        group.Name = $"{group.Speciality.ShortName} {group.StartYear}-{group.Number}";

        _groupRepository.Update(group);
        await _unitOfWork.SaveAsync();

        return Ok();
    }

    [HttpPost("addgroupstudent")]
    public async Task<IActionResult> AddGroupStudent(AddGroupStudent message)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        var group = _groupRepository.Get().FirstOrDefault(g => g.Id == message.GroupId);
        if (group == null)
        {
            return BadRequest();
        }

        var student = _userRepository.Get().FirstOrDefault(s => s.Id == message.StudentId);
        if (student == null)
        {
            return BadRequest();
        }

        student.GroupId = message.GroupId;
        student.SubGroup = message.SubGroupType;

        _userRepository.Update(student);
        await _unitOfWork.SaveAsync();

        return Ok();
    }

    [HttpPost("removegroupstudent")]
    public async Task<IActionResult> RemoveGroupStudent(RemoveGroupStudent message)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        var group = _groupRepository.Get().Include(g => g.Students).FirstOrDefault(g => g.Id == message.GroupId);
        if (group == null)
        {
            return BadRequest();
        }

        var student = group.Students.FirstOrDefault(s => s.Id == message.StudentId);
        if (student == null)
        {
            return BadRequest();
        }

        group.Students.Remove(student);
        await _unitOfWork.SaveAsync();

        return Ok();
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
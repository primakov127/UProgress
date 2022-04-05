using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using UProgress.Contracts.Messages;
using UProgress.Contracts.Models;
using UProgress.Service.Repositories;
using UProgress.Service.Services;

namespace UProgress.Service.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly UserService _userService;
    private readonly UserRepository _userRepository;
    private readonly UserManager<IdentityUser<Guid>> _userManager;

    public UserController(UserService userService, UserRepository userRepository,
        UserManager<IdentityUser<Guid>> userManager)
    {
        _userService = userService;
        _userRepository = userRepository;
        _userManager = userManager;
    }

    [HttpGet("getcurrentuser")]
    [Authorize(Policy = AuthClaims.GetCurrentUser)]
    public async Task<IActionResult> GetCurrentUserAsync()
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        var user = await _userService.GetUserByHttpContext(HttpContext);
        if (user == null)
        {
            return BadRequest();
        }

        var appUser = _userRepository.GetById(user.Id);
        if (appUser == null)
        {
            return BadRequest();
        }

        var userRoles = await _userManager.GetRolesAsync(user);
        var result = new GetCurrentUserResult
        {
            Id = user.Id,
            Username = user.UserName,
            FullName = appUser.FullName,
            Email = user.Email,
            Phone = user.PhoneNumber,
            UserType = appUser.Role,
            UserRoles = userRoles,
            GroupId = appUser.GroupId,
            SubGroupType = appUser.SubGroup
        };

        return Ok(result);
    }
}
using System.Web;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using UProgress.Contracts.Messages;
using UProgress.Contracts.Models;
using UProgress.Service.Interfaces;
using UProgress.Service.Repositories;
using UProgress.Service.Services;
using Task = System.Threading.Tasks.Task;

namespace UProgress.Service.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserController : ControllerBase
{
    private readonly UserService _userService;
    private readonly UserRepository _userRepository;
    private readonly UserManager<IdentityUser<Guid>> _userManager;
    private readonly IEmailService _emailService;
    private readonly UnitOfWork _unitOfWork;

    public UserController(UserService userService, UserRepository userRepository,
        UserManager<IdentityUser<Guid>> userManager, IEmailService emailService, UnitOfWork unitOfWork)
    {
        _userService = userService;
        _userRepository = userRepository;
        _userManager = userManager;
        _emailService = emailService;
        _unitOfWork = unitOfWork;
    }

    [HttpGet("getcurrentuser")]
    // [Authorize(Policy = AuthClaims.GetCurrentUser)]
    public async Task<IActionResult> GetCurrentUserAsync()
    {
        var user = await _userService.GetUserByHttpContext(HttpContext);
        if (user == null)
        {
            return BadRequest();
        }

        var appUser = await _userRepository.GetById(user.Id);
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

    [HttpGet("getuserlist")]
    public async Task<IActionResult> GetUserList()
    {
        var result = _userRepository.Get().Select(u => new GetUserListResult
        {
            Id = u.Id,
            FullName = u.FullName,
            UserType = u.Role,
            IsActive = u.IsActive
        });

        return Ok(result);
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateUser(CreateUser message)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        var duplicatedEmailUser = await _userManager.FindByEmailAsync(message.Email);
        if (duplicatedEmailUser != null)
        {
            return BadRequest(new ApiBadRequest("???????????????????????? ?? ?????????? Email ?????? ????????????????????"));
        }

        var duplicatedNameUser = await _userManager.FindByNameAsync(message.Username);
        if (duplicatedNameUser != null)
        {
            return BadRequest(new ApiBadRequest("???????????????????????? ?? ?????????? Username ?????? ????????????????????"));
        }

        var appUserId = await _userService.CreateAppUser(message.FullName, message.UserType);

        var passwordHasher = new PasswordHasher<IdentityUser>();
        var user = new IdentityUser<Guid>()
        {
            Id = appUserId,
            UserName = message.Username,
            NormalizedUserName = message.Username.ToUpper(),
            Email = message.Email,
            PhoneNumber = message.Phone,
            NormalizedEmail = message.Email.ToUpper(),
            SecurityStamp = appUserId.ToString(),
            PasswordHash = passwordHasher.HashPassword(null, message.Password)
        };

        var createUserAsyncResult = await _userManager.CreateAsync(user);
        if (!createUserAsyncResult.Succeeded)
        {
            await _userService.RemoveUser(appUserId);

            return BadRequest(new ApiBadRequest("???? ?????????????? ?????????????? ????????????????????????, ???????????????????? ??????????"));
        }

        await _userManager.AddToRolesAsync(user, message.UserRoles);

        var emailConfirmationToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        var encodedEmailConfirmationToken = HttpUtility.UrlEncode(emailConfirmationToken);
        var emailConfirmationLink =
            $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}/api/auth/confirm?email={user.Email}&emailConfirmToken={encodedEmailConfirmationToken}";

        try
        {
            _emailService.SendEmail(message.Email, "UProgress: ?????????????????????????? ??????????",
                $"<a href='{emailConfirmationLink}'>?????????????????????? ??????????</a>");
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
        }

        return Ok(new CreateUserResult
        {
            UserId = appUserId
        });
    }

    [HttpPost("update")]
    public async Task<IActionResult> UpdateUser(UpdateUser message)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        var user = await _userManager.FindByIdAsync(message.Id.ToString());
        if (user == null)
        {
            return BadRequest(new ApiBadRequest("???????????? ???????????????????????? ???? ????????????????????"));
        }

        var duplicatedEmailUser = await _userManager.FindByEmailAsync(message.Email);
        if (duplicatedEmailUser != null && duplicatedEmailUser.Email != user.Email)
        {
            return BadRequest(new ApiBadRequest("???????????????????????? ?? ?????????? Email ?????? ????????????????????"));
        }

        var duplicatedNameUser = await _userManager.FindByNameAsync(message.Username);
        if (duplicatedNameUser != null && duplicatedNameUser.UserName != user.UserName)
        {
            return BadRequest(new ApiBadRequest("???????????????????????? ?? ?????????? Username ?????? ????????????????????"));
        }

        var appUser = await _userRepository.GetById(message.Id);

        appUser.FullName = message.FullName;
        user.UserName = message.Username;
        user.NormalizedUserName = message.Username.ToUpper();
        user.Email = message.Email;
        user.NormalizedEmail = message.Email.ToUpper();
        user.PhoneNumber = message.Phone;

        if (message.Password != null)
        {
            var passwordHasher = new PasswordHasher<IdentityUser>();
            user.PasswordHash = passwordHasher.HashPassword(null, message.Password);
        }

        await _userManager.RemoveFromRolesAsync(user, await _userManager.GetRolesAsync(user));
        await _userManager.AddToRolesAsync(user, message.UserRoles);
        await _userManager.UpdateAsync(user);
        _userRepository.Update(appUser);
        await _unitOfWork.SaveAsync();

        return Ok();
    }

    [HttpPost("deactivate")]
    public async Task<IActionResult> DeactivateUser(DeactivateUser message)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        var userId = Guid.Parse(message.UserId);
        var isUserDeactivated = await _userService.DeactivateUser(userId);
        if (!isUserDeactivated)
        {
            return BadRequest();
        }

        return Ok();
    }

    [HttpPost("activate")]
    public async Task<IActionResult> DeactivateUser(ActivateUser message)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        var userId = Guid.Parse(message.UserId);
        var isUserDeactivated = await _userService.ActivateUser(userId);
        if (!isUserDeactivated)
        {
            return BadRequest();
        }

        return Ok();
    }

    [HttpPost("getuser")]
    public async Task<IActionResult> GetUserAsync(GetUser message)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        var user = await _userManager.FindByIdAsync(message.UserId);
        if (user == null)
        {
            return BadRequest();
        }

        var appUser = await _userRepository.GetById(user.Id);
        if (appUser == null)
        {
            return BadRequest();
        }

        var userRoles = await _userManager.GetRolesAsync(user);
        var result = new GetUserResult
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

    [HttpGet("getstudentwithoutgrouplist")]
    public async Task<IActionResult> GetStudentWithoutGroupList()
    {
        var result = _userService.GetAllWithoutGroupStudents().Select(s => new GetStudentListResult
        {
            Id = s.Id,
            FullName = s.FullName
        });

        return Ok(result);
    }

    [HttpGet("getstudentlist")]
    public async Task<IActionResult> GetStudentList()
    {
        var result = _userService.GetAllStudents().Select(s => new GetStudentListResult
        {
            Id = s.Id,
            FullName = s.FullName
        });

        return Ok(result);
    }

    [HttpGet("getteacherlist")]
    public async Task<IActionResult> GetTeacherList()
    {
        var result = _userService.GetAllTeachers().Select(s => new GetStudentListResult
        {
            Id = s.Id,
            FullName = s.FullName
        });

        return Ok(result);
    }
}
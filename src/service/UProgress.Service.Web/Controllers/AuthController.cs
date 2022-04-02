using Microsoft.AspNetCore.Mvc;
using UProgress.Contracts.Messages;
using UProgress.Service.Services;


namespace UProgress.Service.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> LoginAsync(Login message)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        var authToken = await _authService.GetAuthToken(message.UsernameOrEmail, message.Password);
        if (authToken == null)
        {
            return BadRequest();
        }

        Response.Cookies.Append("uprogress-st", authToken);
        return Ok();
    }
}
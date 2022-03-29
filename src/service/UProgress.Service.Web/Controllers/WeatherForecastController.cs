using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using UProgress.Contracts.Messages;
using UProgress.Contracts.Models;

namespace UProgress.Service.Web.Controllers;

[ApiController]
[Route("[controller]")]
public class WeatherForecastController : ControllerBase
{
    private static readonly string[] Summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    private readonly ILogger<WeatherForecastController> _logger;
    private readonly UserManager<IdentityUser<Guid>> _userManager;
    private readonly RoleManager<IdentityRole<Guid>> _roleManager;

    public WeatherForecastController(ILogger<WeatherForecastController> logger,
        UserManager<IdentityUser<Guid>> userManager, RoleManager<IdentityRole<Guid>> roleManager)
    {
        _logger = logger;
        _userManager = userManager;
        _roleManager = roleManager;
    }

    [HttpGet(Name = "GetWeatherForecast")]
    [Authorize(Policy = AuthClaims.EditUsers)]
    public IEnumerable<WeatherForecast> Get()
    {
        return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateTime.Now.AddDays(index),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();
    }

    [HttpPost("login")]
    public async Task<IActionResult> LoginAsync(Login message)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        var user = await _userManager.FindByEmailAsync(message.UserNameOrEmail) ??
                   await _userManager.FindByNameAsync(message.UserNameOrEmail);

        if (user == null)
        {
            return BadRequest();
        }

        var isPasswordCorrect = await _userManager.CheckPasswordAsync(user, message.Password);
        if (!isPasswordCorrect)
        {
            return BadRequest();
        }

        var userRoles = await _userManager.GetRolesAsync(user);
        var roles = _roleManager.Roles.Where(role => userRoles.Contains(role.Name));
        var userClaims = await _roleManager.GetClaimsAsync(roles.First());

        var claims = new[]
        {
            new Claim("userId", user.Id.ToString()),
        };
        var signatureKey =
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes("This is the key that we will use in the encryption"));
        var token = new JwtSecurityToken(
            issuer: "CP",
            audience: "CP",
            claims: userClaims,
            expires: DateTime.Now.AddDays(30),
            signingCredentials: new SigningCredentials(signatureKey, SecurityAlgorithms.HmacSha256)
        );
        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

        return Ok(new LoginResult
        {
            UserId = user.Id,
            Token = tokenString
        });
    }
}
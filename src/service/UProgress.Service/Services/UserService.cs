using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace UProgress.Service.Services;

public class UserService
{
    private readonly UserManager<IdentityUser<Guid>> _userManager;

    public UserService(UserManager<IdentityUser<Guid>> userManager)
    {
        _userManager = userManager;
    }

    public async Task<IdentityUser<Guid>?> GetUserByHttpContext(HttpContext httpContext)
    {
        var claimsPrincipal = httpContext.User;
        var user = await _userManager.GetUserAsync(claimsPrincipal);

        return user;
    }
}
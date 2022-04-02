using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace UProgress.Service.Services;

public class AuthService
{
    private readonly UserManager<IdentityUser<Guid>> _userManager;
    private readonly RoleManager<IdentityRole<Guid>> _roleManager;

    public AuthService(UserManager<IdentityUser<Guid>> userManager, RoleManager<IdentityRole<Guid>> roleManager)
    {
        _userManager = userManager;
        _roleManager = roleManager;
    }

    public async Task<string?> GetAuthToken(string usernameOrEmail, string password)
    {
        var user = await _userManager.FindByEmailAsync(usernameOrEmail) ??
                   await _userManager.FindByNameAsync(usernameOrEmail);
        if (user == null)
        {
            return null;
        }

        var isCorrectPassword = await _userManager.CheckPasswordAsync(user, password);
        if (!isCorrectPassword)
        {
            return null;
        }
        
        var userClaims = await GetUserRolesClaims(user);

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

        return tokenString;
    }

    private async Task<IList<Claim>?> GetUserRolesClaims(IdentityUser<Guid> user)
    {
        var userRoles = await _userManager.GetRolesAsync(user);
        if (userRoles == null)
        {
            return null;
        }

        var roles = _roleManager.Roles.Where(role => userRoles.Contains(role.Name)).ToList();

        var getClaimsAsyncTasks = roles.Select(role => _roleManager.GetClaimsAsync(role)).ToList();
        await Task.WhenAny(getClaimsAsyncTasks);

        var userClaims = new List<Claim>();
        getClaimsAsyncTasks.ForEach(task => userClaims.AddRange(task.Result));

        return userClaims;
    }
}
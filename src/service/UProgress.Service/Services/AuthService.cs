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

    public async Task<bool> ResetPasswordAsync(string email, string passwordResetToken, string newPassword)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
        {
            return false;
        }

        var resetPasswordResult = await _userManager.ResetPasswordAsync(user, passwordResetToken, newPassword);
        
        return resetPasswordResult.Succeeded;
    }

    public async Task<bool> ConfirmEmailAsync(string email, string emailConfirmToken)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
        {
            return false;
        }

        var confirmEmailResult = await _userManager.ConfirmEmailAsync(user, emailConfirmToken);

        return confirmEmailResult.Succeeded;
    }

    public async Task<bool> HasUserEmailConfirmation(string usernameOrEmail)
    {
        var user = await _userManager.FindByEmailAsync(usernameOrEmail) ??
                   await _userManager.FindByNameAsync(usernameOrEmail);
        if (user == null)
        {
            return false;
        }

        var hasUserEmailConfirmation = await _userManager.IsEmailConfirmedAsync(user);

        return hasUserEmailConfirmation;
    }

    public async Task<string?> GetPasswordResetTokenAsync(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
        {
            return null;
        }

        var passwordResetToken = await _userManager.GeneratePasswordResetTokenAsync(user);

        return passwordResetToken;
    }

    public async Task<string?> GetEmailConfirmationToken(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
        {
            return null;
        }

        var emailConfirmationToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);

        return emailConfirmationToken;
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
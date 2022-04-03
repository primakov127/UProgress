using System.ComponentModel.DataAnnotations;

namespace UProgress.Contracts.Messages;

public class Login
{
    [Required]
    public string UsernameOrEmail { get; set; }
        
    [Required]
    [MinLength(3)]
    public string Password { get; set; }
}

public class RequestPasswordReset
{
    [Required]
    [EmailAddress]
    public string Email { get; set; }
}

public class ResetPassword
{
    [Required]
    [EmailAddress]
    public string Email { get; set; }
        
    [Required]
    public string ResetToken { get; set; }
        
    [Required]
    [MinLength(3)]
    public string NewPassword { get; set; }
}

public class LoginResult
{
    public Guid UserId { get; set; }
    public string Token { get; set; }
}
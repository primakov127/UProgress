using System.ComponentModel.DataAnnotations;

namespace UProgress.Contracts.Messages;

public class Login
{
    [Required]
    public string UserNameOrEmail { get; set; }
        
    [Required]
    [MinLength(3)]
    public string Password { get; set; }
}

public class LoginResult
{
    public Guid UserId { get; set; }
    public string Token { get; set; }
}
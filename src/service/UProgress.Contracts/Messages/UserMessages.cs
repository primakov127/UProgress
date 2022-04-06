using UProgress.Contracts.Models;

namespace UProgress.Contracts.Messages;

public class GetCurrentUserResult
{
    public Guid Id { get; set; }
    public string Username { get; set; }
    public string FullName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public UserType UserType { get; set; }
    public IEnumerable<string> UserRoles { get; set; }
    public Guid? GroupId { get; set; }
    public SubGroupType? SubGroupType { get; set; }
}

public class GetUserListResult
{
    public Guid Id { get; set; }
    public string FullName { get; set; }
    public UserType UserType { get; set; }
    public bool IsActive { get; set; }
}

public class CreateUser
{
    public string FullName { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public string? Phone { get; set; }
    public string Password { get; set; }
    public UserType UserType { get; set; }
    public IEnumerable<string> UserRoles { get; set; }
}

public class CreateUserResult
{
    public Guid UserId { get; set; }
}

public class DeactivateUser
{
    public string UserId { get; set; }
}

public class ActivateUser
{
    public string UserId { get; set; }
}
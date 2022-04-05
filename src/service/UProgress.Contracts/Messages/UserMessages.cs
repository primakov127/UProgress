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
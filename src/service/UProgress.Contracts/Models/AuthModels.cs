using UProgress.Contracts.Core;

namespace UProgress.Contracts.Models;

public class AuthClaimType : Cnum<AuthClaimType>
{
    public const string Policy = "Policy";
}

public class AuthClaims : Cnum<AuthClaims>
{
    // User
    public const string GetCurrentUser = "User:GetCurrentUser";
    public const string GetAllUsers = "GetAllUsers";
    public const string EditUsers = "EditUsers";
    public const string GetAllDisciplines = "GetAllDisciplines";
}

public class AuthRoles : Cnum<AuthRoles>
{
    public const string Admin = "Admin";
    public const string Teacher = "Teacher";
    public const string GroupHead = "GroupHead";
    public const string Student = "Student";
}
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using UProgress.Contracts.Models;

namespace UProgress.Service.Config.Extensions;

public static class ModelBuilderExtensions
{
    private static readonly PasswordHasher<IdentityUser> _passwordHasher = new PasswordHasher<IdentityUser>();
    private static readonly Guid SeedAdminId = Guid.Parse("f9ddb088-1875-4713-b7ea-c1c71292c3e1");
    private const string SeedAdminUsername = "admin";
    private const string SeedAdminPassword = "admin";
    private const string SeedAdminEmail = "primakov127@gmail.com";
    private const string SeedTeacherUsername = "teacher";
    private const string SeedTeacherPassword = "teacher";

    private static readonly List<IdentityRole<Guid>> Roles = new()
    {
        new()
        {
            Id = Guid.Parse("193d2a83-4371-4e70-8cc1-420d401a02df"),
            Name = AuthRoles.Admin,
            NormalizedName = AuthRoles.Admin.ToUpper()
        },
        new()
        {
            Id = Guid.Parse("5c6a2bb9-2662-4420-bae4-73e2d260c649"),
            Name = AuthRoles.Teacher,
            NormalizedName = AuthRoles.Teacher.ToUpper()
        }
    };

    private static readonly List<IdentityRoleClaim<Guid>> RoleClaims = new()
    {
        new()
        {
            Id = 1,
            RoleId = Roles.First(r => r.Name == AuthRoles.Admin).Id,
            ClaimType = AuthClaimType.Policy,
            ClaimValue = AuthClaims.EditUsers
        },
        new()
        {
            Id = 2,
            RoleId = Roles.First(r => r.Name == AuthRoles.Admin).Id,
            ClaimType = AuthClaimType.Policy,
            ClaimValue = AuthClaims.GetCurrentUser
        }
    };

    private static readonly List<IdentityUser<Guid>> Users = new()
    {
        new()
        {
            Id = Guid.Parse("0294124d-5084-4953-ba67-332ee3632762"),
            UserName = SeedAdminUsername,
            Email = "primakov127@gmail.com",
            PhoneNumber = "+375447843293",
            EmailConfirmed = true,
            NormalizedUserName = SeedAdminUsername.ToUpper(),
            PasswordHash = _passwordHasher.HashPassword(null, SeedAdminPassword)
        }
    };

    private static readonly List<IdentityUserRole<Guid>> UserRoles = new()
    {
        new()
        {
            UserId = Guid.Parse("0294124d-5084-4953-ba67-332ee3632762"),
            RoleId = Guid.Parse("193d2a83-4371-4e70-8cc1-420d401a02df")
        }
    };

    private static readonly List<User> AppUsers = new()
    {
        new()
        {
            Id = Guid.Parse("0294124d-5084-4953-ba67-332ee3632762"),
            FullName = "Шиман Дмитрий Владимирович",
            Role = UserType.Dean,
        }
    };

    public static void SeedAuthData(this ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<IdentityRole<Guid>>().HasData(Roles);
        modelBuilder.Entity<IdentityRoleClaim<Guid>>().HasData(RoleClaims);
        modelBuilder.Entity<IdentityUser<Guid>>().HasData(Users);
        modelBuilder.Entity<IdentityUserRole<Guid>>().HasData(UserRoles);
    }

    public static void SeedAppData(this ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasData(AppUsers);
    }
}
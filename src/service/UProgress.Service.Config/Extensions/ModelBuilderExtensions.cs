using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using UProgress.Contracts.Models;

namespace UProgress.Service.Config.Extensions;

public static class ModelBuilderExtensions
{
    private static readonly PasswordHasher<IdentityUser> _passwordHasher = new PasswordHasher<IdentityUser>();

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
        },
        new()
        {
            Id = Guid.Parse("e27f0634-9582-41fc-991e-eec2150a4179"),
            Name = AuthRoles.GroupHead,
            NormalizedName = AuthRoles.GroupHead.ToUpper()
        },
        new()
        {
            Id = Guid.Parse("51822b2a-fc6b-4f79-a5d7-86687d20128d"),
            Name = AuthRoles.Student,
            NormalizedName = AuthRoles.Student.ToUpper()
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
            UserName = "decan",
            Email = "shiman@gmail.com",
            EmailConfirmed = true,
            NormalizedUserName = "DECAN",
            PasswordHash = _passwordHasher.HashPassword(null, "decan")
        },
        new()
        {
            Id = Guid.Parse("afbb9749-f7c1-4886-8284-1f9294477c76"),
            UserName = "teacher",
            Email = "patsei@gmail.com",
            PhoneNumber = "+375295463843",
            EmailConfirmed = true,
            NormalizedUserName = "TEACHER",
            PasswordHash = _passwordHasher.HashPassword(null, "teacher")
        },
        new()
        {
            Id = Guid.Parse("625a7ff4-39a4-445b-af85-12b5e8392278"),
            UserName = "head",
            Email = "primakov127@gmail.com",
            PhoneNumber = "+375447843293",
            EmailConfirmed = true,
            NormalizedUserName = "HEAD",
            PasswordHash = _passwordHasher.HashPassword(null, "head")
        },
        new()
        {
            Id = Guid.Parse("4abc4d94-7e61-44e6-ad97-ecb795d3b995"),
            UserName = "student",
            Email = "ginko@gmail.com",
            PhoneNumber = "+375447835693",
            EmailConfirmed = true,
            NormalizedUserName = "STUDENT",
            PasswordHash = _passwordHasher.HashPassword(null, "student")
        }
    };

    private static readonly List<IdentityUserRole<Guid>> UserRoles = new()
    {
        new()
        {
            UserId = Guid.Parse("0294124d-5084-4953-ba67-332ee3632762"),
            RoleId = Guid.Parse("193d2a83-4371-4e70-8cc1-420d401a02df")
        },
        new()
        {
            UserId = Guid.Parse("0294124d-5084-4953-ba67-332ee3632762"),
            RoleId = Guid.Parse("5c6a2bb9-2662-4420-bae4-73e2d260c649")
        },
        new()
        {
            UserId = Guid.Parse("afbb9749-f7c1-4886-8284-1f9294477c76"),
            RoleId = Guid.Parse("5c6a2bb9-2662-4420-bae4-73e2d260c649")
        },
        new()
        {
            UserId = Guid.Parse("625a7ff4-39a4-445b-af85-12b5e8392278"),
            RoleId = Guid.Parse("e27f0634-9582-41fc-991e-eec2150a4179")
        },
        new()
        {
            UserId = Guid.Parse("625a7ff4-39a4-445b-af85-12b5e8392278"),
            RoleId = Guid.Parse("51822b2a-fc6b-4f79-a5d7-86687d20128d")
        },
        new()
        {
            UserId = Guid.Parse("4abc4d94-7e61-44e6-ad97-ecb795d3b995"),
            RoleId = Guid.Parse("51822b2a-fc6b-4f79-a5d7-86687d20128d")
        }
    };

    private static readonly List<User> AppUsers = new()
    {
        new()
        {
            Id = Guid.Parse("0294124d-5084-4953-ba67-332ee3632762"),
            FullName = "Шиман Дмитрий Васильевич",
            IsActive = true,
            Role = UserType.Dean,
        },
        new()
        {
            Id = Guid.Parse("afbb9749-f7c1-4886-8284-1f9294477c76"),
            FullName = "Пацей Наталья Владимировна",
            IsActive = true,
            Role = UserType.Teacher,
        },
        new()
        {
            Id = Guid.Parse("625a7ff4-39a4-445b-af85-12b5e8392278"),
            FullName = "Примаков Максим Николаевич",
            IsActive = true,
            Role = UserType.Student,
        },
        new()
        {
            Id = Guid.Parse("4abc4d94-7e61-44e6-ad97-ecb795d3b995"),
            FullName = "Гинько Вадим Рудольфович",
            IsActive = true,
            Role = UserType.Student,
        }
    };

    private static readonly List<Speciality> Specialities = new()
    {
        new()
        {
            Id = Guid.Parse("7e39d9e9-3d2b-45f7-ab52-03e68ce29715"),
            ShortName = "ПОИТ",
            Name = "Программное Обеспечение Информационных Технологий",
            SemesterCount = 8
        },
        new()
        {
            Id = Guid.Parse("e2a85d58-fe08-4b02-a3f5-c042b838bd37"),
            ShortName = "ИСиТ",
            Name = "Информационные Системы и Технологии",
            SemesterCount = 8
        },
        new()
        {
            Id = Guid.Parse("7affbec3-9f41-4583-8268-0fe869be2709"),
            ShortName = "ПОИБМС",
            Name = "Программное Обеспечение Информационной Безопасности Мобильных Систем",
            SemesterCount = 8
        },
        new()
        {
            Id = Guid.Parse("670e2fc2-c0fb-4f9f-a5cd-69888ad5e7f0"),
            ShortName = "ДЭиВИ",
            Name = "Дизайн Электронных и Веб-изданий",
            SemesterCount = 8
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
        modelBuilder.Entity<Speciality>().HasData(Specialities);
    }
}
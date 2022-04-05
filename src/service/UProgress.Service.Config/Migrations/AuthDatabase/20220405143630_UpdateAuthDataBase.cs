using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UProgress.Service.Config.Migrations.AuthDatabase
{
    public partial class UpdateAuthDataBase : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { new Guid("5c6a2bb9-2662-4420-bae4-73e2d260c649"), new Guid("7ceb10a6-27ea-4350-abbc-2cfd8b6e5056") });

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: new Guid("7ceb10a6-27ea-4350-abbc-2cfd8b6e5056"));

            migrationBuilder.InsertData(
                table: "AspNetRoleClaims",
                columns: new[] { "Id", "ClaimType", "ClaimValue", "RoleId" },
                values: new object[] { 2, "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/authorizationdecision", "User:GetCurrentUser", new Guid("193d2a83-4371-4e70-8cc1-420d401a02df") });

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("193d2a83-4371-4e70-8cc1-420d401a02df"),
                column: "ConcurrencyStamp",
                value: "9f07b752-7d07-47fa-a515-bbb289d265aa");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("5c6a2bb9-2662-4420-bae4-73e2d260c649"),
                column: "ConcurrencyStamp",
                value: "ff635e86-6b17-41c9-93dd-f60252da1fe2");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: new Guid("0294124d-5084-4953-ba67-332ee3632762"),
                columns: new[] { "ConcurrencyStamp", "Email", "EmailConfirmed", "PasswordHash", "PhoneNumber" },
                values: new object[] { "2e4c0e01-536a-4267-966c-739d46dda043", "primakov127@gmail.com", true, "AQAAAAEAACcQAAAAED77ZAINYjD13hPqE2walZY92S6A3mQJ6/Hm9iyuGNC14j+L62sOUvP4MmkGxdkjVg==", "+375447843293" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("193d2a83-4371-4e70-8cc1-420d401a02df"),
                column: "ConcurrencyStamp",
                value: "66af47f6-f5b7-474a-b3c9-48a63c4e4adc");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("5c6a2bb9-2662-4420-bae4-73e2d260c649"),
                column: "ConcurrencyStamp",
                value: "8eae8812-a951-45a6-b824-de95ecf0d614");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: new Guid("0294124d-5084-4953-ba67-332ee3632762"),
                columns: new[] { "ConcurrencyStamp", "Email", "EmailConfirmed", "PasswordHash", "PhoneNumber" },
                values: new object[] { "08c409f2-4173-4e85-ba3e-47ece24d249d", null, false, "AQAAAAEAACcQAAAAEGzxI7XzPyAv2ljQICBLuxdZ2zttCKj1FbQnfJAseZxyC5tlv8fVpLEbO7SM03DC4w==", null });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { new Guid("7ceb10a6-27ea-4350-abbc-2cfd8b6e5056"), 0, "afaf2039-0faa-4dfe-bee2-ace88659ba08", null, false, false, null, null, "TEACHER", "AQAAAAEAACcQAAAAED1RXudv4CYvP2F2qEHY49CwjbTlWmSTRGbDShlAPjibJWceWdc9nWdv6KaDUv1eYw==", null, false, null, false, "teacher" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[] { new Guid("5c6a2bb9-2662-4420-bae4-73e2d260c649"), new Guid("7ceb10a6-27ea-4350-abbc-2cfd8b6e5056") });
        }
    }
}

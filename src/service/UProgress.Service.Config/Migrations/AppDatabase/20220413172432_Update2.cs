using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UProgress.Service.Config.Migrations
{
    public partial class Update2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TaskAnswers_Users_ApprovedById",
                table: "TaskAnswers");

            migrationBuilder.AlterColumn<Guid>(
                name: "ApprovedById",
                table: "TaskAnswers",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddForeignKey(
                name: "FK_TaskAnswers_Users_ApprovedById",
                table: "TaskAnswers",
                column: "ApprovedById",
                principalTable: "Users",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TaskAnswers_Users_ApprovedById",
                table: "TaskAnswers");

            migrationBuilder.AlterColumn<Guid>(
                name: "ApprovedById",
                table: "TaskAnswers",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_TaskAnswers_Users_ApprovedById",
                table: "TaskAnswers",
                column: "ApprovedById",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

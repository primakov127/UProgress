﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using UProgress.Service.Config.Contexts;

#nullable disable

namespace UProgress.Service.Config.Migrations.AppDatabase
{
    [DbContext(typeof(AppDbContext))]
    partial class AppDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.3")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("UProgress.Contracts.Models.AnswerAttachment", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<Guid>("AnswerId")
                        .HasColumnType("uuid");

                    b.Property<string>("Extension")
                        .IsRequired()
                        .HasMaxLength(32)
                        .HasColumnType("character varying(32)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(128)
                        .HasColumnType("character varying(128)");

                    b.HasKey("Id");

                    b.HasIndex("AnswerId");

                    b.ToTable("AnswerAttachments");
                });

            modelBuilder.Entity("UProgress.Contracts.Models.AnswerHistory", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<Guid>("AnswerId")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("Date")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Message")
                        .HasColumnType("text");

                    b.Property<int>("StatusMovedTo")
                        .HasColumnType("integer");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("AnswerId");

                    b.HasIndex("UserId");

                    b.ToTable("AnswerHistory");
                });

            modelBuilder.Entity("UProgress.Contracts.Models.Discipline", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<int?>("Semester")
                        .HasColumnType("integer");

                    b.Property<Guid?>("SpecialityId")
                        .IsRequired()
                        .HasColumnType("uuid");

                    b.Property<int>("Type")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("Name");

                    b.HasIndex("SpecialityId");

                    b.ToTable("Disciplines");
                });

            modelBuilder.Entity("UProgress.Contracts.Models.Group", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<int>("GraduatedYear")
                        .HasColumnType("integer");

                    b.Property<Guid>("HeadId")
                        .HasColumnType("uuid");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(128)
                        .HasColumnType("character varying(128)");

                    b.Property<int>("Number")
                        .HasColumnType("integer");

                    b.Property<Guid>("SpecialityId")
                        .HasColumnType("uuid");

                    b.Property<int>("StartYear")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("HeadId")
                        .IsUnique();

                    b.HasIndex("SpecialityId");

                    b.HasIndex("StartYear");

                    b.ToTable("Groups");
                });

            modelBuilder.Entity("UProgress.Contracts.Models.Speciality", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<int>("SemesterCount")
                        .HasColumnType("integer");

                    b.Property<string>("ShortName")
                        .IsRequired()
                        .HasMaxLength(32)
                        .HasColumnType("character varying(32)");

                    b.HasKey("Id");

                    b.ToTable("Specialities");

                    b.HasData(
                        new
                        {
                            Id = new Guid("7e39d9e9-3d2b-45f7-ab52-03e68ce29715"),
                            Name = "Программное Обеспечение Информационных Технологий",
                            SemesterCount = 8,
                            ShortName = "ПОИТ"
                        },
                        new
                        {
                            Id = new Guid("e2a85d58-fe08-4b02-a3f5-c042b838bd37"),
                            Name = "Информационные Системы и Технологии",
                            SemesterCount = 8,
                            ShortName = "ИСиТ"
                        },
                        new
                        {
                            Id = new Guid("7affbec3-9f41-4583-8268-0fe869be2709"),
                            Name = "Программное Обеспечение Информационной Безопасности Мобильных Систем",
                            SemesterCount = 8,
                            ShortName = "ПОИБМС"
                        },
                        new
                        {
                            Id = new Guid("670e2fc2-c0fb-4f9f-a5cd-69888ad5e7f0"),
                            Name = "Дизайн Электронных и Веб-изданий",
                            SemesterCount = 8,
                            ShortName = "ДЭиВИ"
                        });
                });

            modelBuilder.Entity("UProgress.Contracts.Models.StudentDiscipline", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<Guid>("DisciplineId")
                        .HasColumnType("uuid");

                    b.Property<bool>("IsAvailable")
                        .HasColumnType("boolean");

                    b.Property<int?>("Mark")
                        .HasColumnType("integer");

                    b.Property<Guid>("StudentId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("DisciplineId");

                    b.HasIndex("StudentId");

                    b.ToTable("UserDisciplines");
                });

            modelBuilder.Entity("UProgress.Contracts.Models.Task", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<Guid>("DisciplineId")
                        .HasColumnType("uuid");

                    b.Property<bool>("IsRequired")
                        .HasColumnType("boolean");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.HasKey("Id");

                    b.HasIndex("DisciplineId");

                    b.ToTable("Tasks");
                });

            modelBuilder.Entity("UProgress.Contracts.Models.TaskAnswer", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Answer")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<Guid?>("ApprovedById")
                        .HasColumnType("uuid");

                    b.Property<int?>("Mark")
                        .HasColumnType("integer");

                    b.Property<int>("Status")
                        .HasColumnType("integer");

                    b.Property<Guid>("StudentId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("TaskId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("ApprovedById");

                    b.HasIndex("StudentId");

                    b.HasIndex("TaskId");

                    b.ToTable("TaskAnswers");
                });

            modelBuilder.Entity("UProgress.Contracts.Models.TaskAttachment", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Extension")
                        .IsRequired()
                        .HasMaxLength(32)
                        .HasColumnType("character varying(32)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(128)
                        .HasColumnType("character varying(128)");

                    b.Property<Guid>("TaskId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("TaskId");

                    b.ToTable("TaskAttachments");
                });

            modelBuilder.Entity("UProgress.Contracts.Models.TeacherGroupDiscipline", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<Guid>("DisciplineId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("GroupId")
                        .HasColumnType("uuid");

                    b.Property<int>("SubGroup")
                        .HasColumnType("integer");

                    b.Property<Guid>("TeacherId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("DisciplineId");

                    b.HasIndex("GroupId");

                    b.HasIndex("TeacherId");

                    b.ToTable("TeacherGroupDisciplines");
                });

            modelBuilder.Entity("UProgress.Contracts.Models.User", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasMaxLength(512)
                        .HasColumnType("character varying(512)");

                    b.Property<Guid?>("GroupId")
                        .HasColumnType("uuid");

                    b.Property<bool>("IsActive")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("boolean")
                        .HasDefaultValue(false);

                    b.Property<int>("Role")
                        .HasColumnType("integer");

                    b.Property<int?>("SubGroup")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("GroupId");

                    b.HasIndex("Role");

                    b.ToTable("Users");

                    b.HasData(
                        new
                        {
                            Id = new Guid("0294124d-5084-4953-ba67-332ee3632762"),
                            FullName = "Шиман Дмитрий Васильевич",
                            IsActive = true,
                            Role = 0
                        },
                        new
                        {
                            Id = new Guid("afbb9749-f7c1-4886-8284-1f9294477c76"),
                            FullName = "Пацей Наталья Владимировна",
                            IsActive = true,
                            Role = 1
                        },
                        new
                        {
                            Id = new Guid("625a7ff4-39a4-445b-af85-12b5e8392278"),
                            FullName = "Примаков Максим Николаевич",
                            IsActive = true,
                            Role = 2
                        },
                        new
                        {
                            Id = new Guid("4abc4d94-7e61-44e6-ad97-ecb795d3b995"),
                            FullName = "Гинько Вадим Рудольфович",
                            IsActive = true,
                            Role = 2
                        });
                });

            modelBuilder.Entity("UProgress.Contracts.Models.AnswerAttachment", b =>
                {
                    b.HasOne("UProgress.Contracts.Models.TaskAnswer", "Answer")
                        .WithMany("Attachments")
                        .HasForeignKey("AnswerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Answer");
                });

            modelBuilder.Entity("UProgress.Contracts.Models.AnswerHistory", b =>
                {
                    b.HasOne("UProgress.Contracts.Models.TaskAnswer", "Answer")
                        .WithMany("History")
                        .HasForeignKey("AnswerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("UProgress.Contracts.Models.User", "User")
                        .WithMany("UserTaskAnswerHistory")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Answer");

                    b.Navigation("User");
                });

            modelBuilder.Entity("UProgress.Contracts.Models.Discipline", b =>
                {
                    b.HasOne("UProgress.Contracts.Models.Speciality", "Speciality")
                        .WithMany("Disciplines")
                        .HasForeignKey("SpecialityId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Speciality");
                });

            modelBuilder.Entity("UProgress.Contracts.Models.Group", b =>
                {
                    b.HasOne("UProgress.Contracts.Models.User", "Head")
                        .WithOne("HeadGroup")
                        .HasForeignKey("UProgress.Contracts.Models.Group", "HeadId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("UProgress.Contracts.Models.Speciality", "Speciality")
                        .WithMany("Groups")
                        .HasForeignKey("SpecialityId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Head");

                    b.Navigation("Speciality");
                });

            modelBuilder.Entity("UProgress.Contracts.Models.StudentDiscipline", b =>
                {
                    b.HasOne("UProgress.Contracts.Models.Discipline", "Discipline")
                        .WithMany("DisciplineStudents")
                        .HasForeignKey("DisciplineId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("UProgress.Contracts.Models.User", "Student")
                        .WithMany("StudentDisciplines")
                        .HasForeignKey("StudentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Discipline");

                    b.Navigation("Student");
                });

            modelBuilder.Entity("UProgress.Contracts.Models.Task", b =>
                {
                    b.HasOne("UProgress.Contracts.Models.Discipline", "Discipline")
                        .WithMany("Tasks")
                        .HasForeignKey("DisciplineId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Discipline");
                });

            modelBuilder.Entity("UProgress.Contracts.Models.TaskAnswer", b =>
                {
                    b.HasOne("UProgress.Contracts.Models.User", "ApprovedBy")
                        .WithMany("TeacherApprovedTaskAnswers")
                        .HasForeignKey("ApprovedById");

                    b.HasOne("UProgress.Contracts.Models.User", "Student")
                        .WithMany("StudentTaskAnswers")
                        .HasForeignKey("StudentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("UProgress.Contracts.Models.Task", "Task")
                        .WithMany("Answers")
                        .HasForeignKey("TaskId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("ApprovedBy");

                    b.Navigation("Student");

                    b.Navigation("Task");
                });

            modelBuilder.Entity("UProgress.Contracts.Models.TaskAttachment", b =>
                {
                    b.HasOne("UProgress.Contracts.Models.Task", "Task")
                        .WithMany("Attachments")
                        .HasForeignKey("TaskId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Task");
                });

            modelBuilder.Entity("UProgress.Contracts.Models.TeacherGroupDiscipline", b =>
                {
                    b.HasOne("UProgress.Contracts.Models.Discipline", "Discipline")
                        .WithMany("TeacherGroupDisciplines")
                        .HasForeignKey("DisciplineId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("UProgress.Contracts.Models.Group", "Group")
                        .WithMany("TeacherGroupDisciplines")
                        .HasForeignKey("GroupId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("UProgress.Contracts.Models.User", "Teacher")
                        .WithMany("TeacherGroupDisciplines")
                        .HasForeignKey("TeacherId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Discipline");

                    b.Navigation("Group");

                    b.Navigation("Teacher");
                });

            modelBuilder.Entity("UProgress.Contracts.Models.User", b =>
                {
                    b.HasOne("UProgress.Contracts.Models.Group", "Group")
                        .WithMany("Students")
                        .HasForeignKey("GroupId")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.Navigation("Group");
                });

            modelBuilder.Entity("UProgress.Contracts.Models.Discipline", b =>
                {
                    b.Navigation("DisciplineStudents");

                    b.Navigation("Tasks");

                    b.Navigation("TeacherGroupDisciplines");
                });

            modelBuilder.Entity("UProgress.Contracts.Models.Group", b =>
                {
                    b.Navigation("Students");

                    b.Navigation("TeacherGroupDisciplines");
                });

            modelBuilder.Entity("UProgress.Contracts.Models.Speciality", b =>
                {
                    b.Navigation("Disciplines");

                    b.Navigation("Groups");
                });

            modelBuilder.Entity("UProgress.Contracts.Models.Task", b =>
                {
                    b.Navigation("Answers");

                    b.Navigation("Attachments");
                });

            modelBuilder.Entity("UProgress.Contracts.Models.TaskAnswer", b =>
                {
                    b.Navigation("Attachments");

                    b.Navigation("History");
                });

            modelBuilder.Entity("UProgress.Contracts.Models.User", b =>
                {
                    b.Navigation("HeadGroup")
                        .IsRequired();

                    b.Navigation("StudentDisciplines");

                    b.Navigation("StudentTaskAnswers");

                    b.Navigation("TeacherApprovedTaskAnswers");

                    b.Navigation("TeacherGroupDisciplines");

                    b.Navigation("UserTaskAnswerHistory");
                });
#pragma warning restore 612, 618
        }
    }
}

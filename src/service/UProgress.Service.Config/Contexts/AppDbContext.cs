using Microsoft.EntityFrameworkCore;
using UProgress.Contracts.Models;
using UProgress.Service.Config.Extensions;
using Task = UProgress.Contracts.Models.Task;

namespace UProgress.Service.Config.Contexts;

public sealed class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Speciality> Specialities { get; set; }
    public DbSet<Group> Groups { get; set; }
    public DbSet<TeacherGroupDiscipline> TeacherGroupDisciplines { get; set; }
    public DbSet<StudentDiscipline> UserDisciplines { get; set; }
    public DbSet<Discipline> Disciplines { get; set; }
    public DbSet<Task> Tasks { get; set; }
    public DbSet<TaskAttachment> TaskAttachments { get; set; }
    public DbSet<TaskAnswer> TaskAnswers { get; set; }
    public DbSet<AnswerHistory> AnswerHistory { get; set; }
    public DbSet<AnswerAttachment> AnswerAttachments { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        #region User Model Configuration

        modelBuilder.Entity<User>().HasKey(u => u.Id);
        modelBuilder.Entity<User>().Property(u => u.FullName).HasMaxLength(512).IsRequired();
        modelBuilder.Entity<User>().Property(u => u.Role).HasConversion<int>().IsRequired();
        modelBuilder.Entity<User>().Property(u => u.IsActive).HasDefaultValue(false);
        modelBuilder.Entity<User>().HasOne(u => u.Group)
            .WithMany(g => g.Students).IsRequired(false)
            .HasForeignKey(u => u.GroupId)
            .OnDelete(DeleteBehavior.SetNull);
        modelBuilder.Entity<User>().HasOne(u => u.HeadGroup)
            .WithOne(g => g.Head)
            .HasForeignKey<Group>(g => g.HeadId);
        modelBuilder.Entity<User>().Property(u => u.SubGroup).HasConversion<int>();

        modelBuilder.Entity<User>().HasIndex(u => u.Role);
        modelBuilder.Entity<User>().HasIndex(u => u.GroupId);

        #endregion

        #region Speciality Model Configuration

        modelBuilder.Entity<Speciality>().HasKey(s => s.Id);
        modelBuilder.Entity<Speciality>().Property(s => s.ShortName).HasMaxLength(32).IsRequired();
        modelBuilder.Entity<Speciality>().Property(s => s.Name).HasMaxLength(256).IsRequired();
        modelBuilder.Entity<Speciality>().Property(s => s.SemesterCount).IsRequired();

        #endregion

        #region Group Model Configuration

        modelBuilder.Entity<Group>().HasKey(g => g.Id);
        modelBuilder.Entity<Group>().Property(g => g.StartYear).IsRequired();
        modelBuilder.Entity<Group>().Property(g => g.GraduatedYear).IsRequired();
        modelBuilder.Entity<Group>().Property(g => g.Name).HasMaxLength(128).IsRequired();
        modelBuilder.Entity<Group>().Property(g => g.Number).IsRequired();
        modelBuilder.Entity<Group>().HasOne(g => g.Speciality)
            .WithMany(s => s.Groups)
            .HasForeignKey(g => g.SpecialityId);

        modelBuilder.Entity<Group>().HasIndex(g => g.StartYear);

        #endregion

        #region TeacherGroupDiscipline Model Configuration

        modelBuilder.Entity<TeacherGroupDiscipline>().HasKey(tgd => tgd.Id);
        modelBuilder.Entity<TeacherGroupDiscipline>().Property(tgd => tgd.SubGroup).HasConversion<int>();
        modelBuilder.Entity<TeacherGroupDiscipline>().HasOne(tgd => tgd.Teacher)
            .WithMany(u => u.TeacherGroupDisciplines)
            .HasForeignKey(tgd => tgd.TeacherId);
        modelBuilder.Entity<TeacherGroupDiscipline>().HasOne(tgd => tgd.Group)
            .WithMany(g => g.TeacherGroupDisciplines)
            .HasForeignKey(tgd => tgd.GroupId);
        modelBuilder.Entity<TeacherGroupDiscipline>().HasOne(tgd => tgd.Discipline)
            .WithMany(d => d.TeacherGroupDisciplines)
            .HasForeignKey(tgd => tgd.DisciplineId);

        #endregion

        #region StudentDiscipline Model Configuration

        modelBuilder.Entity<StudentDiscipline>().HasKey(ud => ud.Id);
        modelBuilder.Entity<StudentDiscipline>().Property(ud => ud.IsAvailable).IsRequired();
        modelBuilder.Entity<StudentDiscipline>().Property(ud => ud.Mark);
        modelBuilder.Entity<StudentDiscipline>().HasOne(ud => ud.Student)
            .WithMany(u => u.StudentDisciplines)
            .HasForeignKey(ud => ud.StudentId);
        modelBuilder.Entity<StudentDiscipline>().HasOne(ud => ud.Discipline)
            .WithMany(d => d.DisciplineStudents)
            .HasForeignKey(ud => ud.DisciplineId);

        #endregion

        #region Discipline Model Configuration

        modelBuilder.Entity<Discipline>().HasKey(d => d.Id);
        modelBuilder.Entity<Discipline>().Property(d => d.Name).HasMaxLength(256).IsRequired();
        modelBuilder.Entity<Discipline>().Property(d => d.Description).IsRequired();
        modelBuilder.Entity<Discipline>().Property(d => d.Semester);
        modelBuilder.Entity<Discipline>().Property(d => d.Type).HasConversion<int>().IsRequired();
        modelBuilder.Entity<Discipline>().HasOne(d => d.Speciality)
            .WithMany(s => s.Disciplines)
            .HasForeignKey(d => d.SpecialityId);

        modelBuilder.Entity<Discipline>().HasIndex(d => d.Name);

        #endregion

        #region Task Model Configuration

        modelBuilder.Entity<Task>().HasKey(t => t.Id);
        modelBuilder.Entity<Task>().Property(t => t.Name).HasMaxLength(256).IsRequired();
        modelBuilder.Entity<Task>().Property(t => t.Description).IsRequired();
        modelBuilder.Entity<Task>().Property(t => t.IsRequired).IsRequired();
        modelBuilder.Entity<Task>().HasOne(t => t.Discipline)
            .WithMany(d => d.Tasks)
            .HasForeignKey(t => t.DisciplineId);

        #endregion

        #region TaskAttachment Model Configuration

        modelBuilder.Entity<TaskAttachment>().HasKey(ta => ta.Id);
        modelBuilder.Entity<TaskAttachment>().Property(ta => ta.Name).HasMaxLength(128).IsRequired();
        modelBuilder.Entity<TaskAttachment>().Property(ta => ta.Extension).HasMaxLength(32).IsRequired();
        modelBuilder.Entity<TaskAttachment>().HasOne(ta => ta.Task)
            .WithMany(t => t.Attachments)
            .HasForeignKey(ta => ta.TaskId);

        #endregion

        #region TaskAnswer Model Configuration

        modelBuilder.Entity<TaskAnswer>().HasKey(ta => ta.Id);
        modelBuilder.Entity<TaskAnswer>().Property(ta => ta.Answer).IsRequired();
        modelBuilder.Entity<TaskAnswer>().Property(ta => ta.Mark);
        modelBuilder.Entity<TaskAnswer>().Property(ta => ta.Status).HasConversion<int>().IsRequired();
        modelBuilder.Entity<TaskAnswer>().HasOne(ta => ta.Task)
            .WithMany(t => t.Answers)
            .HasForeignKey(ta => ta.TaskId);
        modelBuilder.Entity<TaskAnswer>().HasOne(ta => ta.Student)
            .WithMany(u => u.StudentTaskAnswers)
            .HasForeignKey(ta => ta.StudentId);
        modelBuilder.Entity<TaskAnswer>().HasOne(ta => ta.ApprovedBy)
            .WithMany(u => u.TeacherApprovedTaskAnswers).IsRequired(false)
            .HasForeignKey(ta => ta.ApprovedById);

        #endregion

        #region AnswerHistory Model Configuration

        modelBuilder.Entity<AnswerHistory>().HasKey(ah => ah.Id);
        modelBuilder.Entity<AnswerHistory>().Property(ah => ah.Date).IsRequired();
        modelBuilder.Entity<AnswerHistory>().Property(ah => ah.StatusMovedTo).HasConversion<int>().IsRequired();
        modelBuilder.Entity<AnswerHistory>().Property(ah => ah.Message);
        modelBuilder.Entity<AnswerHistory>().HasOne(ah => ah.User)
            .WithMany(u => u.UserTaskAnswerHistory)
            .HasForeignKey(ah => ah.UserId);
        modelBuilder.Entity<AnswerHistory>().HasOne(ah => ah.Answer)
            .WithMany(a => a.History)
            .HasForeignKey(ah => ah.AnswerId);

        #endregion

        #region AnswerAttachment Model Configuration

        modelBuilder.Entity<AnswerAttachment>().HasKey(p => p.Id);
        modelBuilder.Entity<AnswerAttachment>().Property(ta => ta.Name).HasMaxLength(128).IsRequired();
        modelBuilder.Entity<AnswerAttachment>().Property(ta => ta.Extension).HasMaxLength(32).IsRequired();
        modelBuilder.Entity<AnswerAttachment>().HasOne(ta => ta.Answer)
            .WithMany(t => t.Attachments)
            .HasForeignKey(ta => ta.AnswerId);

        #endregion

        modelBuilder.SeedAppData();
    }
}
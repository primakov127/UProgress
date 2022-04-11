using UProgress.Contracts.Models;
using Task = UProgress.Contracts.Models.Task;

namespace UProgress.Contracts.Messages;

public class CreateDiscipline
{
    public string Name { get; set; }
    public string Description { get; set; }
    public int Semester { get; set; }
    public DisciplineType Type { get; set; }
    public Guid SpecialityId { get; set; }
}

public class CreateDisciplineResult
{
    public Guid DisciplineId { get; set; }
}

public class GetDisciplineListResult
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public int? Semester { get; set; }
    public DisciplineType Type { get; set; }
    public string SpecialityShortName { get; set; }
}

public class DeleteDiscipline
{
    public Guid DisciplineId { get; set; }
}

public class CreateTask
{
    public Guid DisciplineId { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public bool IsRequired { get; set; }
}

public class CreateTaskResult
{
    public Guid TaskId { get; set; }
}

public class DeleteTask
{
    public Guid TaskId { get; set; }
}

public class GetDiscipline
{
    public Guid DisciplineId { get; set; }
}

public class GetDisciplineResult
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public int? Semester { get; set; }
    public DisciplineType Type { get; set; }
    public Guid? SpecialityId { get; set; }
    public IEnumerable<GetDisciplineResultTask> Tasks { get; set; }
}

public class GetDisciplineResultTask
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public bool IsRequired { get; set; }
}

public class GetTask
{
    public Guid TaskId { get; set; }
}

public class GetTaskResult
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public bool IsRequired { get; set; }
    public Guid DisciplineId { get; set; }
}
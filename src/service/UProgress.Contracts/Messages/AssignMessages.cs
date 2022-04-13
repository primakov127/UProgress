namespace UProgress.Contracts.Messages;

public class AssignDisciplineToStudent
{
    public Guid DisciplineId { get; set; }
    public Guid StudentId { get; set; }
}

public class AssignDisciplineToGroup
{
    public Guid DisciplineId { get; set; }
    public Guid GroupId { get; set; }
    public Guid FirstSubGroupTeacherId { get; set; }
    public Guid?  SecondSubGroupTeacherId { get; set; }
}
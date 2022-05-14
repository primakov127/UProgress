using UProgress.Contracts.Models;

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
    public Guid? SecondSubGroupTeacherId { get; set; }
}

public class GetMyGroupDisciplinesResult
{
    public Guid Id { get; set; }
    public Guid TeacherId { get; set; }
    public SubGroupType SubGroupType { get; set; }
    public Guid GroupId { get; set; }
    public string GroupName { get; set; }
    public Guid DisciplineId { get; set; }
    public string DisciplineName { get; set; }
    public int? DisciplineSemester { get; set; }
    public DisciplineType DisciplineType { get; set; }
}

public class GetGroupDiscipline
{
    public Guid GroupId { get; set; }
    public Guid DisciplineId { get; set; }
    public SubGroupType SubGroupType { get; set; }
}

public class GetGroupDisciplineResult
{
    public Guid GroupId { get; set; }
    public string GroupName { get; set; }
    public Guid DisciplineId { get; set; }
    public string DisciplineName { get; set; }
    public DisciplineType DisciplineType { get; set; }
    public IEnumerable<GetGroupDisciplineStudent> Students { get; set; }
    public IEnumerable<GetGroupDisciplineTask> Tasks { get; set; }
}

public class GetGroupDisciplineTask
{
    public Guid TaskId { get; set; }
    public string Name { get; set; }
    public bool IsRequired { get; set; }
}

public class GetGroupDisciplineStudent
{
    public Guid StudentId { get; set; }
    public string FullName { get; set; }
    public int? FinalMark { get; set; }
    public IEnumerable<GetGroupDisciplineTaskAnswer> TaskAnswers { get; set; }
}

public class GetGroupDisciplineTaskAnswer
{
    public Guid TaskId { get; set; }
    public Guid TaskAnswerId { get; set; }
    public int? Mark { get; set; }
    public AnswerStatus Status { get; set; }
}

public class GetGroupSessionAccess
{
    public Guid GroupId { get; set; }
    public int Semester { get; set; }
}

public class GetGroupSessionAccessResult
{
    public IEnumerable<GetGroupSessionAccessStudent> Students { get; set; }
}

public class GetGroupSessionAccessStudent
{
    public Guid StudentId { get; set; }
    public string FullName { get; set; }
    public bool Access { get; set; }
}

public class ChangeFinalMarks
{
    public Guid DisciplineId { get; set; }
    public IEnumerable<ChangeFinalMarksStudent> Students { get; set; }
}

public class ChangeFinalMarksStudent
{
    public Guid StudentId { get; set; }
    public int? Mark { get; set; }
}

public class SelectStudents
{
    public Guid DisciplineId { get; set; }
    public string Operator { get; set; }
    public int Mark { get; set; }
}

public class SelectStudentsResult
{
    public IEnumerable<SelectStudentsResultStudent> Students { get; set; }
}

public class SelectStudentsResultStudent
{
    public Guid StudentId { get; set; }
    public string StudentName { get; set; }
    public Guid GroupId { get; set; }
    public string GroupName { get; set; }
}
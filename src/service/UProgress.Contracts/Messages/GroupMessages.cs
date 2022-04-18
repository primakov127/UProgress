using UProgress.Contracts.Models;

namespace UProgress.Contracts.Messages;

public class CreateGroup
{
    public int StartYear { get; set; }
    public int GraduatedYear { get; set; }
    public int Number { get; set; }
    public Guid HeadId { get; set; }
    public Guid SpecialityId { get; set; }
    public List<CreateGroupStudent> Students { get; set; }
}

public class CreateGroupStudent
{
    public Guid StudentId { get; set; }
    public SubGroupType SubGroupType { get; set; }
}

public class DeleteGroup
{
    public Guid GroupId { get; set; }
}

public class GetSpecialityListResult
{
    public Guid Id { get; set; }
    public string ShortName { get; set; }
    public string Name { get; set; }
    public int SemesterCount { get; set; }
}

public class CreateGroupResult
{
    public Guid GroupId { get; set; }
}

public class GetGroupListResult
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public Guid HeadId { get; set; }
    public string HeadName { get; set; }
}

public class GetGroup
{
    public Guid GroupId { get; set; }
}

public class GetGroupResult
{
    public Guid Id { get; set; }
    public int StartYear { get; set; }
    public int GraduatedYear { get; set; }
    public int Number { get; set; }
    public Guid HeadId { get; set; }
    public string HeadName { get; set; }
    public Guid SpecialityId { get; set; }
    public string SpecialityShortName { get; set; }
    public IEnumerable<GetGroupStudent> Students { get; set; }
}

public class GetGroupStudent
{
    public Guid StudentId { get; set; }
    public string StudentName { get; set; }
    public SubGroupType? SubGroupType { get; set; }
}

public class UpdateGroup
{
    public Guid GroupId { get; set; }
    public int StartYear { get; set; }
    public int GraduatedYear { get; set; }
    public int Number { get; set; }
    public Guid HeadId { get; set; }
}

public class AddGroupStudent
{
    public Guid GroupId { get; set; }
    public Guid StudentId { get; set; }
    public SubGroupType SubGroupType { get; set; }
}

public class RemoveGroupStudent
{
    public Guid GroupId { get; set; }
    public Guid StudentId { get; set; }
}
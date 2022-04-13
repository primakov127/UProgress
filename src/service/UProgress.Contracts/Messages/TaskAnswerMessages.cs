using UProgress.Contracts.Models;

namespace UProgress.Contracts.Messages;

public class CreateTaskAnswer
{
    public string Answer { get; set; }
    public Guid StudentId { get; set; }
    public Guid TaskId { get; set; }
}

public class CreateTaskAnswerResult
{
    public Guid TaskAnswerId { get; set; }
}

public class GetTaskAnswer
{
    public Guid TaskAnswerId { get; set; }
}

public class GetTaskAnswerResult
{
    public Guid Id { get; set; }
    public int? Mark { get; set; }
    public AnswerStatus Status { get; set; }
    public Guid TaskId { get; set; }
    public Guid StudentId { get; set; }
    public Guid? ApprovedById { get; set; }
    public List<GetTaskAnswerResultHistory> History { get; set; }
}

public class GetTaskAnswerResultHistory
{
    public DateTime Date { get; set; }
    public AnswerStatus StatusMovedTo { get; set; }
    public string? Message { get; set; }
    public Guid UserId { get; set; }
    public Guid AnswerId { get; set; }
    public GetTaskAnswerResultHistoryUser User { get; set; }
}

public class GetTaskAnswerResultHistoryUser
{
    public Guid UserId { get; set; }
    public string FullName { get; set; }
}

public class RequestApprove
{
    public Guid TaskAnswerId { get; set; }
    public string? Message { get; set; }
    public string Answer { get; set; }
}

public class Approve
{
    public Guid TaskAnswerId { get; set; }
    public string? Message { get; set; }
    public int Mark { get; set; }
}

public class Reject
{
    public Guid TaskAnswerId { get; set; }
    public string? Message { get; set; }
}
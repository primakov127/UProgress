using Microsoft.EntityFrameworkCore;
using UProgress.Contracts.Models;
using UProgress.Service.Repositories;

namespace UProgress.Service.Services;

public class TaskAnswerService
{
    private readonly TaskAnswerRepository _taskAnswerRepository;
    private readonly AnswerHistoryRepository _answerHistoryRepository;
    private readonly UnitOfWork _unitOfWork;

    public TaskAnswerService(TaskAnswerRepository taskAnswerRepository, UnitOfWork unitOfWork,
        AnswerHistoryRepository answerHistoryRepository)
    {
        _taskAnswerRepository = taskAnswerRepository;
        _unitOfWork = unitOfWork;
        _answerHistoryRepository = answerHistoryRepository;
    }

    public async Task<Guid> CreateTaskAnswer(string answer, Guid taskId, Guid studentId)
    {
        var taskAnswer = new TaskAnswer
        {
            Answer = answer,
            Status = AnswerStatus.Draft,
            TaskId = taskId,
            StudentId = studentId
        };

        _taskAnswerRepository.Insert(taskAnswer);
        await _unitOfWork.SaveAsync();

        return taskAnswer.Id;
    }

    public async Task<Guid> CreateAnswerHistory(AnswerStatus statusMovedTo, Guid userId, Guid answerId,
        string? message = null)
    {
        var answerHistory = new AnswerHistory
        {
            Date = DateTime.UtcNow,
            StatusMovedTo = statusMovedTo,
            Message = message,
            UserId = userId,
            AnswerId = answerId
        };

        _answerHistoryRepository.Insert(answerHistory);
        await _unitOfWork.SaveAsync();

        return answerHistory.Id;
    }

    public async Task<bool> RequestApprove(Guid taskAnswerId, string? message, string answer)
    {
        var taskAnswer = _taskAnswerRepository.Get().Include(ta => ta.History)
            .FirstOrDefault(ta => ta.Id == taskAnswerId);
        if (taskAnswer == null)
        {
            return false;
        }

        taskAnswer.Status = AnswerStatus.Approvable;
        taskAnswer.Answer = answer;
        taskAnswer.History.Add(new AnswerHistory
        {
            Date = DateTime.UtcNow,
            StatusMovedTo = AnswerStatus.Approvable,
            Message = message,
            UserId = taskAnswer.StudentId,
            AnswerId = taskAnswer.Id
        });

        _taskAnswerRepository.Update(taskAnswer);
        await _unitOfWork.SaveAsync();

        return true;
    }

    public async Task<bool> Approve(Guid taskAnswerId, Guid teacherId, string? message, int mark)
    {
        var taskAnswer = _taskAnswerRepository.Get().Include(ta => ta.History)
            .FirstOrDefault(ta => ta.Id == taskAnswerId);
        if (taskAnswer == null)
        {
            return false;
        }

        taskAnswer.Status = AnswerStatus.Approved;
        taskAnswer.Mark = mark;
        taskAnswer.ApprovedById = teacherId;
        taskAnswer.History.Add(new AnswerHistory
        {
            Date = DateTime.UtcNow,
            StatusMovedTo = AnswerStatus.Approved,
            Message = message,
            UserId = teacherId,
            AnswerId = taskAnswer.Id
        });

        _taskAnswerRepository.Update(taskAnswer);
        await _unitOfWork.SaveAsync();

        return true;
    }

    public async Task<bool> Reject(Guid taskAnswerId, Guid teacherId, string? message)
    {
        var taskAnswer = _taskAnswerRepository.Get().Include(ta => ta.History)
            .FirstOrDefault(ta => ta.Id == taskAnswerId);
        if (taskAnswer == null)
        {
            return false;
        }

        taskAnswer.Status = AnswerStatus.Rejected;
        taskAnswer.History.Add(new AnswerHistory
        {
            Date = DateTime.UtcNow,
            StatusMovedTo = AnswerStatus.Rejected,
            Message = message,
            UserId = teacherId,
            AnswerId = taskAnswer.Id
        });

        _taskAnswerRepository.Update(taskAnswer);
        await _unitOfWork.SaveAsync();

        return true;
    }
}
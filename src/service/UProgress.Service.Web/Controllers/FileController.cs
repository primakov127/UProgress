using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UProgress.Contracts.Models;
using UProgress.Service.Repositories;

namespace UProgress.Service.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
// [Authorize]
public class FileController : ControllerBase
{
    private readonly TaskAttachmentRepository _taskAttachmentRepository;
    private readonly AnswerAttachmentRepository _answerAttachmentRepository;
    private readonly TaskRepository _taskRepository;
    private readonly TaskAnswerRepository _taskAnswerRepository;
    private readonly UnitOfWork _unitOfWork;

    private readonly Dictionary<string, string> _mimeTypes = new()
    {
        {".txt", "text/plain"},
        {".pdf", "application/pdf"},
        {".doc", "application/vnd.ms-word"},
        {".docx", "application/vnd.ms-word"},
        {".xls", "application/vnd.ms-excel"},
        {".xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"},
        {".png", "image/png"},
        {".jpg", "image/jpeg"},
        {".jpeg", "image/jpeg"},
        {".gif", "image/gif"},
        {".csv", "text/csv"}
    };

    public FileController(TaskAttachmentRepository taskAttachmentRepository,
        AnswerAttachmentRepository answerAttachmentRepository, TaskRepository taskRepository,
        TaskAnswerRepository taskAnswerRepository, UnitOfWork unitOfWork)
    {
        _taskAttachmentRepository = taskAttachmentRepository;
        _answerAttachmentRepository = answerAttachmentRepository;
        _taskRepository = taskRepository;
        _taskAnswerRepository = taskAnswerRepository;
        _unitOfWork = unitOfWork;
    }

    private string GetContentType(string path)
    {
        var ext = Path.GetExtension(path).ToLowerInvariant();
        return _mimeTypes[ext];
    }

    [HttpPost("uploadtaskattachment/{taskId}")]
    public async Task<IActionResult> UploadTaskAttachment(Guid taskId, IList<IFormFile> files)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        var task = _taskRepository.Get().Include(t => t.Attachments).FirstOrDefault(t => t.Id == taskId);
        if (task == null)
        {
            return BadRequest();
        }

        foreach (var file in files)
        {
            var extension = Path.GetExtension(file.FileName).Replace(".", "").ToLowerInvariant();
            var name = file.FileName.Replace($".{extension}", "");
            
            var attachment = new TaskAttachment
            {
                TaskId = task.Id,
                Extension = extension,
                Name = name
            };
            _taskAttachmentRepository.Insert(attachment);
            await _unitOfWork.SaveAsync();
            
            var path = Path.Combine(Directory.GetCurrentDirectory(), "upload", $"{attachment.Id}_{file.FileName}");

            await using (var stream = new FileStream(path, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
        }

        return Ok();
    }

    [HttpPost("uploadanswerattachment/{answerId}")]
    public async Task<IActionResult> UploadAnswerAttachment(Guid answerId, IList<IFormFile> files)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        var answer = _taskAnswerRepository.Get().Include(a => a.Attachments).FirstOrDefault(a => a.Id == answerId);
        if (answer == null)
        {
            return BadRequest();
        }

        foreach (var file in files)
        {
            var extension = Path.GetExtension(file.FileName).Replace(".", "").ToLowerInvariant();
            var name = file.FileName.Replace($".{extension}", "");

            var attachment = new AnswerAttachment
            {
                AnswerId = answer.Id,
                Extension = extension,
                Name = name
            };
            _answerAttachmentRepository.Insert(attachment);
            await _unitOfWork.SaveAsync();
            
            var path = Path.Combine(Directory.GetCurrentDirectory(), "upload", $"{attachment.Id}_{file.FileName}");

            await using (var stream = new FileStream(path, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
        }

        return Ok();
    }

    [HttpGet("download/{id}")]
    public async Task<IActionResult> DownloadFile(Guid id)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        string? fileName = null;
        string? downloadName = null;
        var taskAttachment = await _taskAttachmentRepository.GetById(id);
        var answerAttachment = await _answerAttachmentRepository.GetById(id);

        if (taskAttachment != null)
        {
            fileName = $"{taskAttachment.Id}_{taskAttachment.Name}.{taskAttachment.Extension}";
            downloadName = $"{taskAttachment.Name}.{taskAttachment.Extension}";
        }
        else if (answerAttachment != null)
        {
            fileName = $"{answerAttachment.Id}_{answerAttachment.Name}.{answerAttachment.Extension}";
            downloadName = $"{answerAttachment.Name}.{answerAttachment.Extension}";
        }
        else
        {
            return BadRequest();
        }

        var path = Path.Combine(Directory.GetCurrentDirectory(), "upload", fileName);
        if (!System.IO.File.Exists(path))
        {
            return BadRequest();
        }

        var memory = new MemoryStream();
        await using (var stream = new FileStream(path, FileMode.Open))
        {
            await stream.CopyToAsync(memory);
        }

        memory.Position = 0;
        return File(memory, GetContentType(path), downloadName);
    }
    
    [HttpPost("remove/{id}")]
    public async Task<IActionResult> RemoveFile(Guid id)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        string? fileName = null;
        var taskAttachment = await _taskAttachmentRepository.GetById(id);
        var answerAttachment = await _answerAttachmentRepository.GetById(id);

        if (taskAttachment != null)
        {
            fileName = $"{taskAttachment.Id}_{taskAttachment.Name}.{taskAttachment.Extension}";
            _taskAttachmentRepository.Delete(taskAttachment);
        }
        else if (answerAttachment != null)
        {
            fileName = $"{answerAttachment.Id}_{answerAttachment.Name}.{answerAttachment.Extension}";
            _answerAttachmentRepository.Delete(answerAttachment);
        }
        else
        {
            return BadRequest();
        }

        var path = Path.Combine(Directory.GetCurrentDirectory(), "upload", fileName);
        if (!System.IO.File.Exists(path))
        {
            return BadRequest();
        }

        System.IO.File.Delete(path);
        await _unitOfWork.SaveAsync();
        
        return Ok();
    }

    // private bool Upload(IList<IFormFile> files)
    // {
    // }
    //
    // [HttpPost]
    // public IActionResult Upload1(IList<IFormFile> files)
    // {
    //     //either you can pass the list of files in the method or you can initialize them inside the method like the commented line below
    //     //var files = HttpContext.Request.Form.Files;
    //     FileDetail fileDetail = new FileDetail();
    //     foreach (var file in files)
    //     {
    //         var fileType = Path.GetExtension(file.FileName);
    //         //var ext = file.;
    //         if (fileType.ToLower() == ".pdf" || fileType.ToLower() == ".jpg" || fileType.ToLower() == ".png" ||
    //             fileType.ToLower() == ".jpeg")
    //         {
    //             var filePath = _env.ContentRootPath;
    //             var docName = Path.GetFileName(file.FileName);
    //             if (file != null && file.Length > 0)
    //             {
    //                 fileDetail.Id = Guid.NewGuid();
    //                 fileDetail.DocumentName = docName;
    //                 fileDetail.DocType = fileType;
    //                 fileDetail.DocUrl = Path.Combine(filePath, "Files", fileDetail.Id.ToString() + fileDetail.DocType);
    //                 using (var stream = new FileStream(fileDetail.DocUrl, FileMode.Create))
    //                 {
    //                     file.CopyToAsync(stream);
    //                 }
    //
    //                 _context.Add(fileDetail);
    //                 _context.SaveChangesAsync();
    //             }
    //             else
    //             {
    //                 return BadRequest();
    //             }
    //         }
    //     }
    //
    //     return Ok();
    // }
    //
    //
    // [HttpGet]
    // public IActionResult Download(Guid id)
    // {
    //     var fileDetail = _context.FileDetail
    //         .Where(x => x.Id == id)
    //         .FirstOrDefault();
    //     if (fileDetail != null)
    //     {
    //         System.Net.Mime.ContentDisposition cd = new System.Net.Mime.ContentDisposition
    //         {
    //             FileName = fileDetail.DocumentName,
    //             Inline = false
    //         };
    //         Response.Headers.Add("Content-Disposition", cd.ToString());
    //
    //         //get physical path
    //         var path = _env.ContentRootPath;
    //         var fileReadPath = Path.Combine(path, "Files", fileDetail.Id.ToString() + fileDetail.DocType);
    //
    //         var file = System.IO.File.OpenRead(fileReadPath);
    //         return File(file, fileDetail.DocType);
    //     }
    //     else
    //     {
    //         return StatusCode(404);
    //     }
    // }
}
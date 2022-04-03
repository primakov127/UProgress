using System.Net;
using System.Net.Mail;
using UProgress.Service.Interfaces;

namespace UProgress.Service.Services;

public class EmailService : IEmailService
{
    private readonly SmtpClient _smtpClient;
    private readonly string _fromEmail;
        
    public EmailService(string smtpHost, int port, string email, string password)
    {
        _smtpClient = new SmtpClient(smtpHost)
        {
            Port = port,
            Credentials = new NetworkCredential(email, password),
            EnableSsl = true
        };
        _fromEmail = email;
    }
        
    public void SendEmail(string recipientEmail, string subject, string message)
    {
        var mailMessage = new MailMessage(_fromEmail, recipientEmail, subject, message);
        mailMessage.IsBodyHtml = true;
            
        _smtpClient.Send(mailMessage);
            
    }
}
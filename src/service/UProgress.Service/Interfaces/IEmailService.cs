namespace UProgress.Service.Interfaces;

public interface IEmailService
{
    public void SendEmail(string recipientEmail, string subject, string message);
}
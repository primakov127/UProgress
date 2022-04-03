namespace UProgress.Contracts.Messages;

public class ApiBadRequest
{
    public ApiBadRequest(string error)
    {
        Error = error;
    }

    public string Error { get; set; }
}
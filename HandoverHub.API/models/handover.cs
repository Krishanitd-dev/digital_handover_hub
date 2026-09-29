namespace HandoverHub.API.Models;

public class Handover
{
    public int Id { get; set; }

    public int ProjectId { get; set; }

    public string FromUser { get; set; } = "";

    public string ToUser { get; set; } = "";

    public string Status { get; set; } = "Pending";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
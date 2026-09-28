namespace HandoverHub.API.Models;

public class Project
{
    public int Id { get; set; }

    public string ProjectName { get; set; } = "";

    public string Description { get; set; } = "";

    public DateTime StartDate { get; set; }

    public DateTime ExpectedCompletion { get; set; }

    public string Priority { get; set; } = "Medium";

    public int Progress { get; set; }

    public string Status { get; set; } = "In Progress";

    public string Owner { get; set; } = "";
}

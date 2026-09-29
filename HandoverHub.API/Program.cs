using HandoverHub.API.Data;
using HandoverHub.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<HandoverHubDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection") ));
builder.Services.AddCors(options =>
{options.AddPolicy("ReactApp", policy =>
    { policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
var app = builder.Build();
app.UseCors("ReactApp");
app.MapPost("/api/users", async (
    CreateUserRequest request,
    HandoverHubDbContext db) =>
{
    var existingUser = await db.Users
        .FirstOrDefaultAsync(u =>
            u.Email.ToLower() == request.Email.ToLower());

    if (existingUser != null)
    {
        return Results.BadRequest(new
        {message = "A user with this email already exists."});
    }
    var user = new User
    {
        DisplayName = request.DisplayName,
        Email = request.Email,
        Role = request.Role
    };
    var passwordHasher = new PasswordHasher<User>();
    user.PasswordHash =
        passwordHasher.HashPassword(
     user,
        request.Password
        );
    db.Users.Add(user);
    await db.SaveChangesAsync();
    return Results.Ok(new
    {
     message = "User created successfully.",
        id = user.Id,
        displayName = user.DisplayName,
        email = user.Email,
        role = user.Role});
});

app.MapPost("/api/auth/login", async (
    LoginRequest request,
    HandoverHubDbContext db) =>
{
    var user = await db.Users
    .FirstOrDefaultAsync(u =>u.Email.ToLower() == request.Email.ToLower());
    if (user == null)
    {
    return Results.Unauthorized();
    }
    var passwordHasher = new PasswordHasher<User>();

    var passwordResult =
        passwordHasher.VerifyHashedPassword(
         user,
        user.PasswordHash,
     request.Password
        );
    if (passwordResult ==
        PasswordVerificationResult.Failed)
    {
        return Results.Unauthorized();
    }
    return Results.Ok(new
    {
        success = true,
        message = "Login successful",
        id = user.Id,
        email = user.Email,
        displayName = user.DisplayName,
        role = user.Role
    });
});
app.MapGet("/api/test", () =>
{
    return Results.Ok(new
    {message = "HandoverHub API is running"});
});
app.MapGet("/api/projects", async (HandoverHubDbContext db) =>
{
    var projects = await db.Projects
        .OrderByDescending(p => p.Id)
        .ToListAsync();

    return Results.Ok(projects);
});

app.MapGet("/api/projects/owner/{owner}", async (
    string owner,
    HandoverHubDbContext db) =>
{
    var projects = await db.Projects
        .Where(p => p.Owner == owner)
        .OrderByDescending(p => p.Id)
        .ToListAsync();

    return Results.Ok(projects);
});

app.MapPost("/api/projects", async (
    Project project,
    HandoverHubDbContext db) =>
{
    db.Projects.Add(project);

    await db.SaveChangesAsync();

    return Results.Ok(project);
});

app.MapPut("/api/projects/{id}/progress", async (
    int id,
    ProgressUpdate request,
    HandoverHubDbContext db) =>
{
    var project = await db.Projects.FindAsync(id);

    if (project == null)
    {
        return Results.NotFound();
    }

    project.Progress = request.Progress;

    if (project.Progress == 0)
    {
        project.Status = "Not Started";
    }
    else if (project.Progress >= 100)
    {
        project.Progress = 100;
        project.Status = "Completed";
    }
    else
    {
        project.Status = "In Progress";
    }

    await db.SaveChangesAsync();

    return Results.Ok(project);
});

app.MapGet("/api/users", async (
    HandoverHubDbContext db) =>
{
    var users = await db.Users
        .Select(u => new
        {
            id = u.Id,
            displayName = u.DisplayName,
            email = u.Email,
            role = u.Role
        })
        .OrderBy(u => u.displayName)
        .ToListAsync();

    return Results.Ok(users);
});
app.MapPost("/api/handovers", async (
    CreateHandoverRequest request,
    HandoverHubDbContext db) =>
{
    var project = await db.Projects.FindAsync(request.ProjectId);

    if (project == null)
    {
        return Results.NotFound(new
        {
            message = "Project not found."
        });
    }

    if (project.Owner != request.FromUser)
    {
        return Results.BadRequest(new
        {
            message = "Only the project owner can send a handover."
        });
    }

    if (request.FromUser == request.ToUser)
    {
        return Results.BadRequest(new
        {
            message = "You cannot hand over a project to yourself."
        });
    }

    var existingHandover = await db.Handovers
        .FirstOrDefaultAsync(h =>
            h.ProjectId == request.ProjectId &&
            h.Status == "Pending");

    if (existingHandover != null)
    {
        return Results.BadRequest(new
        {
            message = "This project already has a pending handover."
        });
    }

    var handover = new Handover
    {
        ProjectId = request.ProjectId,
        FromUser = request.FromUser,
        ToUser = request.ToUser,
        Status = "Pending"
    };

    db.Handovers.Add(handover);

    await db.SaveChangesAsync();

    return Results.Ok(handover);
});

app.MapGet("/api/handovers/from/{user}", async (
    string user,
    HandoverHubDbContext db) =>
{
    var handovers = await db.Handovers
        .Where(h => h.FromUser == user)
        .OrderByDescending(h => h.CreatedAt)
        .ToListAsync();

    return Results.Ok(handovers);
});

app.MapGet("/api/handovers/to/{user}", async (
    string user,
    HandoverHubDbContext db) =>
{
    var handovers = await db.Handovers
        .Where(h =>
            h.ToUser == user &&
            h.Status == "Pending")
        .OrderByDescending(h => h.CreatedAt)
        .ToListAsync();

    return Results.Ok(handovers);
});

app.MapGet("/api/handovers", async (
    HandoverHubDbContext db) =>
{
    var handovers = await db.Handovers
        .OrderByDescending(h => h.CreatedAt)
        .ToListAsync();

    return Results.Ok(handovers);
});

app.Run();
public record CreateUserRequest(
    string DisplayName,
    string Email,
    string Password,
    string Role
);
public record LoginRequest(
    string Email,
    string Password
);
public record ProgressUpdate(int Progress);

public record CreateHandoverRequest(
    int ProjectId,
    string FromUser,
    string ToUser
);
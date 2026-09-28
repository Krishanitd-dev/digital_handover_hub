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

app.MapPost("/api/projects", async (
    Project project,
    HandoverHubDbContext db) =>
{
    db.Projects.Add(project);

    await db.SaveChangesAsync();

    return Results.Ok(project);
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
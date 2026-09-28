using HandoverHub.API.Models;
using Microsoft.EntityFrameworkCore;

namespace HandoverHub.API.Data;

public class HandoverHubDbContext : DbContext
{
    public HandoverHubDbContext(
        DbContextOptions<HandoverHubDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
}
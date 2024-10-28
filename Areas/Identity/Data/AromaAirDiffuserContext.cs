using AromaAirDiffuser.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace AromaAirDiffuser.Data;

public class AromaAirDiffuserContext : IdentityDbContext<IdentityUser>
{
    public AromaAirDiffuserContext(DbContextOptions<AromaAirDiffuserContext> options)
         : base(options)
    {
    }

    public DbSet<Product> Products { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<Payment> Payments { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Configure Payment to Order relationship with Restrict on delete
        builder.Entity<Payment>()
            .HasOne(p => p.Order)
            .WithMany(o => o.Payments) // Ensure Order has a Payments collection
            .HasForeignKey(p => p.OrderId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

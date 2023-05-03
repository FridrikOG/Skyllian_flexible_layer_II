using Microsoft.EntityFrameworkCore;
using cbdc_service.Entities;

namespace cbdc_service.Models.Context
{
    public class SocialLoginContext : DbContext
    {
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {

            optionsBuilder.UseNpgsql(@"User ID=edvywqqe;Password=JL08LT_iLhv0Rw5OTj7BKGPQJQPlZqgx;Host=mouse.db.elephantsql.com;Port=5432;Database=edvywqqe;");
            base.OnConfiguring(optionsBuilder);
        }
        public DbSet<User> Users { get; set; }
        public DbSet<OperationClaim> OperationClaims { get; set; }
        public DbSet<UserOperationClaim> UserOperationClaims { get; set; }
    }
}

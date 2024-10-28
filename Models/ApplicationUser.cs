using Microsoft.AspNetCore.Identity;

namespace AromaAirDiffuser.Models
{
    public class ApplicationUser:IdentityUser
    {
        public string Address { get; set; }
        public string City { get; set; }
        public string PostalCode { get; set; }
        public string StripeCustomerId { get; set; }
    }
}

namespace AromaAirDiffuser.Models
{
    public class Order
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }
        public DateTime OrderDate { get; set; }
        public string Status { get; set; }
        public decimal TotalAmount { get; set; }
        public string OrderPlace { get; set; }
        public string Name { get; set; }
        
        public string Email { get; set; }
        public string PhoneNumber { get; set; }

        public PaymentType PaymentType { get; set; }
        public List<OrderItem> OrderItems { get; set; }
        public ICollection<Payment> Payments { get; set; } = new List<Payment>();
    }
}

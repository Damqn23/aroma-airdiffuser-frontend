using AromaAirDiffuser.Data;
using AromaAirDiffuser.Models;
using Microsoft.Extensions.Options;
using Stripe;

namespace AromaAirDiffuser.Stripe
{
    public class StripePaymentService : IStripePaymentService
    {
        private readonly AromaAirDiffuserContext _context;
        private readonly StripeSettings _stripeOptions;

        public StripePaymentService(AromaAirDiffuserContext context, IOptions<StripeSettings> stripeOptions)
        {
            _context = context;
            _stripeOptions = stripeOptions.Value;
            StripeConfiguration.ApiKey = _stripeOptions.SecretKey;
        }

        // Process payment through Stripe
        public async Task<string> ProcessPaymentAsync(decimal amount, string paymentMethodId, string userId, int orderId)
        {
            var customerId = await GetOrCreateStripeCustomerId(userId);

            var options = new PaymentIntentCreateOptions
            {
                Amount = (long)(amount * 100), // Amount in cents
                Currency = "usd", // Adjust currency as needed
                Customer = customerId,
                PaymentMethod = paymentMethodId,
                Confirm = true,
                PaymentMethodTypes = new List<string> { "card" }
            };

            var service = new PaymentIntentService();
            var paymentIntent = await service.CreateAsync(options);

            // If payment succeeds, record the payment in the database
            if (paymentIntent.Status == "succeeded")
            {
                await RecordPayment(paymentIntent, userId, amount, orderId);
            }

            return paymentIntent.Status;
        }

        // Retrieve or create Stripe Customer ID for the user
        public async Task<string> GetOrCreateStripeCustomerId(string userId)
        {
            var user = await _context.Users.FindAsync(userId) as ApplicationUser;

            if (user == null)
            {
                throw new Exception("User not found.");
            }

            if (!string.IsNullOrEmpty(user.StripeCustomerId))
            {
                return user.StripeCustomerId;
            }

            var customerOptions = new CustomerCreateOptions
            {
                Email = user.Email,
                Name = user.UserName
            };

            var customerService = new CustomerService();
            var stripeCustomer = await customerService.CreateAsync(customerOptions);

            user.StripeCustomerId = stripeCustomer.Id;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return stripeCustomer.Id;
        }

        // Record a successful payment in the database
        private async Task RecordPayment(PaymentIntent paymentIntent, string userId, decimal amount, int orderId)
        {
            var payment = new Payment
            {
                OrderId = orderId,  // Use the orderId parameter
                UserId = userId,
                Amount = amount,
                PaymentDate = DateTime.Now,
                Status = "Completed",
                StripePaymentId = paymentIntent.Id,
                StripeCustomerId = paymentIntent.CustomerId
            };

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();
        }
    }
}

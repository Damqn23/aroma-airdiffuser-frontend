namespace AromaAirDiffuser.Stripe
{
    public interface IStripePaymentService
    {
        Task<string> ProcessPaymentAsync(decimal amount, string paymentMethodId, string userId, int orderId);


        Task<string> GetOrCreateStripeCustomerId(string userId);
    }
}

using AromaAirDiffuser.Data;
using AromaAirDiffuser.Stripe;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AromaAirDiffuser.Controllers
{
    public class PaymentsController : Controller
    {
        private readonly IStripePaymentService _stripePaymentService;
        private readonly AromaAirDiffuserContext _context;

        public PaymentsController(IStripePaymentService stripePaymentService, AromaAirDiffuserContext context)
        {
            _stripePaymentService = stripePaymentService;
            _context = context;
        }

        [HttpPost("process")]
        public async Task<IActionResult> ProcessPayment(int orderId, string paymentMethodId)
        {
            // Retrieve the order from the database
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == orderId);

            if (order == null)
            {
                return NotFound("Order not found.");
            }

            // Assuming user authentication and userId retrieval
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User is not authenticated.");
            }

            // Process payment using Stripe, passing orderId as a parameter
            var paymentStatus = await _stripePaymentService.ProcessPaymentAsync(order.TotalAmount, paymentMethodId, userId, orderId);

            if (paymentStatus == "succeeded")
            {
                // Update the order status to Paid
                order.Status = "Paid";
                _context.Orders.Update(order);
                await _context.SaveChangesAsync();

                return Ok("Payment successful.");
            }
            else
            {
                return BadRequest("Payment failed.");
            }
        }
    }
}

using AromaAirDiffuser.Data;
using AromaAirDiffuser.EmailSender;
using AromaAirDiffuser.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AromaAirDiffuser.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : Controller
    {
        private readonly AromaAirDiffuserContext _context;
        private readonly IEmailService _emailService;

        public OrderController(AromaAirDiffuserContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        // USER-LEVEL ENDPOINTS

        // GET /api/orders - Retrieve all orders for the authenticated user
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetUserOrders()
        {
            // Get the authenticated user's ID
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User is not authenticated.");
            }

            // Fetch orders for the user
            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Where(o => o.UserId == userId)
                .ToListAsync();

            return Ok(orders);
        }

        // GET /api/orders/{id} - Retrieve a specific order's details for the authenticated user
        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrderById(int id)
        {
            // Get the authenticated user's ID
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User is not authenticated.");
            }

            // Fetch the order and related order items
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .FirstOrDefaultAsync(o => o.Id == id && o.UserId == userId);

            if (order == null)
            {
                return NotFound("Order not found.");
            }

            return Ok(order);
        }

        // POST /api/orders - Place a new order for the authenticated user
        [HttpPost]
        public async Task<IActionResult> PlaceOrder(Order order)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User is not authenticated.");
            }

            // Set order properties
            order.UserId = userId;
            order.Status = "Pending";
            order.OrderDate = DateTime.Now;

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // Send order confirmation email
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            await _emailService.SendEmailAsync(userEmail, "Order Confirmation", $"Thank you for your order #{order.Id}!");

            return CreatedAtAction(nameof(GetOrderById), new { id = order.Id }, order);
        }

        [HttpGet("payment-history")]
        public async Task<ActionResult<IEnumerable<Payment>>> GetUserPaymentHistory()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User is not authenticated.");
            }

            var payments = await _context.Payments
                .Include(p => p.Order)
                .Where(p => p.UserId == userId)
                .ToListAsync();

            return Ok(payments);
        }

        // ADMIN-LEVEL ENDPOINTS

        // GET /api/orders/all - Retrieve all orders (admin only)
        [Authorize(Roles = "Admin")]
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<Order>>> GetAllOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .ToListAsync();

            return Ok(orders);
        }

        // PUT /api/orders/{id}/status - Update the status of an order (admin only)
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusRequest request)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound("Order not found.");
            }

            // Update the order status
            order.Status = request.Status;
            _context.Entry(order).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();

                // Send order status update email to user
                var user = await _context.Users.FindAsync(order.UserId);
                if (user != null)
                {
                    await _emailService.SendEmailAsync(user.Email, "Order Status Update", $"Your order #{order.Id} is now {order.Status}.");
                }
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        private bool OrderExists(int id)
        {
            return _context.Orders.Any(e => e.Id == id);
        }
    }
}

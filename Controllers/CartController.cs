using AromaAirDiffuser.Data;
using AromaAirDiffuser.Models;
using Microsoft.AspNetCore.Mvc;

namespace AromaAirDiffuser.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private const string SessionCartKey = "Cart";
        private readonly AromaAirDiffuserContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CartController(AromaAirDiffuserContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        // Helper method to get the cart from session
        private List<CartItem> GetCart()
        {
            var session = _httpContextAccessor.HttpContext.Session;
            var cart = session.GetObjectFromJson<List<CartItem>>(SessionCartKey) ?? new List<CartItem>();
            return cart;
        }

        // Helper method to save the cart to session
        private void SaveCart(List<CartItem> cart)
        {
            var session = _httpContextAccessor.HttpContext.Session;
            session.SetObjectAsJson(SessionCartKey, cart);
        }

        // Helper method to clear the cart from session
        private void ClearCart()
        {
            var session = _httpContextAccessor.HttpContext.Session;
            session.Remove(SessionCartKey);
        }

        // GET /api/cart - View cart items
        [HttpGet]
        public ActionResult<IEnumerable<CartItem>> GetCartItems()
        {
            var cart = GetCart();
            return Ok(cart);
        }

        // POST /api/cart - Add item to cart
        [HttpPost]
        public IActionResult AddToCart(CartItem item)
        {
            var cart = GetCart();

            var existingItem = cart.FirstOrDefault(i => i.ProductId == item.ProductId);
            if (existingItem != null)
            {
                existingItem.Quantity += item.Quantity;
            }
            else
            {
                cart.Add(item);
            }

            SaveCart(cart);
            return Ok(cart);
        }

        // DELETE /api/cart/{productId} - Remove item from cart
        [HttpDelete("{productId}")]
        public IActionResult RemoveFromCart(int productId)
        {
            var cart = GetCart();
            var item = cart.FirstOrDefault(i => i.ProductId == productId);

            if (item == null)
            {
                return NotFound();
            }

            cart.Remove(item);
            SaveCart(cart);
            return NoContent();
        }

        // POST /api/cart/checkout - Checkout and create an order
        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout()
        {
            var cart = GetCart();
            if (cart == null || !cart.Any())
            {
                return BadRequest("Cart is empty.");
            }

            // Create a new order
            var order = new Order
            {
                UserId = _httpContextAccessor.HttpContext.User.Identity.Name, // Assuming user is logged in
                OrderDate = DateTime.Now,
                Status = "Pending",
                TotalAmount = 0
            };

            // Calculate the total amount and create order items
            var orderItems = new List<OrderItem>();
            foreach (var cartItem in cart)
            {
                var product = await _context.Products.FindAsync(cartItem.ProductId);
                if (product == null)
                {
                    return BadRequest($"Product with ID {cartItem.ProductId} not found.");
                }

                var orderItem = new OrderItem
                {
                    ProductId = product.Id,
                    Quantity = cartItem.Quantity,
                    Order = order
                };

                orderItems.Add(orderItem);
                order.TotalAmount += product.Price * cartItem.Quantity;
            }

            // Save the order and order items
            order.OrderItems = orderItems;
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // Clear the cart after checkout
            ClearCart();

            return Ok(new { Message = "Order placed successfully.", OrderId = order.Id });
        }
    }
}

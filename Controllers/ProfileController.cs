using AromaAirDiffuser.Data;
using AromaAirDiffuser.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AromaAirDiffuser.Controllers
{
    public class ProfileController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly AromaAirDiffuserContext _context;

        public ProfileController(UserManager<IdentityUser> userManager, AromaAirDiffuserContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        // GET /api/profile - Get user profile information
        [HttpGet]
        public async Task<IActionResult> GetUserProfile()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            var profile = new
            {
                Email = user.Email,
                FullName = user.UserName // Replace with additional fields if needed
            };

            return Ok(profile);
        }

        // PUT /api/profile - Update user profile information
        [HttpPut]
        public async Task<IActionResult> UpdateUserProfile([FromBody] UpdateProfileRequest model)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            user.UserName = model.FullName; // Update full name or other fields as needed
            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return NoContent();
        }

        // GET /api/profile/orders - Get user order history
        [HttpGet("orders")]
        public async Task<IActionResult> GetUserOrderHistory()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Where(o => o.UserId == userId)
                .ToListAsync();

            var orderHistory = orders.Select(o => new
            {
                o.Id,
                o.OrderDate,
                o.TotalAmount,
                o.Status,
                Items = o.OrderItems.Select(oi => new
                {
                    oi.Product.Name,
                    oi.Quantity,
                    oi.Product.Price
                })
            });

            return Ok(orderHistory);
        }
    }
}

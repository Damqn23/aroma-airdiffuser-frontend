
using AromaAirDiffuser.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Identity.Web;
using Microsoft.EntityFrameworkCore;
using AromaAirDiffuser.Data;
using Microsoft.AspNetCore.Identity;
using AromaAirDiffuser.Stripe;
using AromaAirDiffuser.EmailSender;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Configure Database Connection
var connectionString = builder.Configuration.GetConnectionString("AromaAirDiffuserContextConnection")
                       ?? throw new InvalidOperationException("Connection string 'AromaAirDiffuserContextConnection' not found.");

builder.Services.AddDbContext<AromaAirDiffuserContext>(options =>
    options.UseSqlServer(connectionString));
// Identity Configuration
builder.Services.AddDefaultIdentity<ApplicationUser>()
    .AddEntityFrameworkStores<AromaAirDiffuserContext>();

// CORS Policy to Allow Requests from React Frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000") // Adjust for your frontend URL
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});
// Register StripeSettings for Dependency Injection
builder.Services.Configure<StripeSettings>(builder.Configuration.GetSection("StripeSettings"));

// Register Stripe Payment Service
//builder.Services.AddScoped<IStripePaymentService, StripePaymentService>();
builder.Services.Configure<SmtpSettings>(builder.Configuration.GetSection("SmtpSettings"));
builder.Services.AddScoped<IEmailService, SmptEmailService>();

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.WriteIndented = true;
    });
// Configure Swagger for API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();



// Enable Session and Distributed Memory Cache
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession();

var app = builder.Build();

// Enable session handling
app.UseSession();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication(); // Ensure authentication is enabled before authorization
app.UseAuthorization();
app.UseCors("AllowFrontend");
app.MapControllers();

app.Run();
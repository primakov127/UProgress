using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using UProgress.Service.Config.Contexts;
using UProgress.Service.Interfaces;
using UProgress.Service.Services;
using UProgress.Service.Web.Authorization;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;
var frontendUrl = builder.Configuration.GetValue<string>("FrontendBaseUrl");

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(configuration.GetConnectionString("App")));
builder.Services.AddDbContext<AuthDbContext>(options => options.UseNpgsql(configuration.GetConnectionString("Auth")));

builder.Services.AddIdentityCore<IdentityUser<Guid>>(options =>
    {
        options.User.RequireUniqueEmail = true;
        options.Password.RequireDigit = false;
        options.Password.RequiredLength = 3;
        options.Password.RequireLowercase = false;
        options.Password.RequireUppercase = false;
        options.Password.RequireNonAlphanumeric = false;
    })
    .AddRoles<IdentityRole<Guid>>()
    .AddEntityFrameworkStores<AuthDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options => options.TokenValidationParameters = new TokenValidationParameters
{
    ValidateIssuer = true,
    ValidateAudience = true,
    ValidAudience = "CP",
    ValidIssuer = "CP",
    RequireExpirationTime = true,
    IssuerSigningKey =
        new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes("This is the key that we will use in the encryption")),
    ValidateIssuerSigningKey = true
});

builder.Services.AddAuthorization(PolicyConfig.SetPolicies);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins(frontendUrl).AllowAnyHeader().AllowAnyMethod().AllowCredentials();
    });
});

builder.Services.AddSingleton<IEmailService>(new EmailService(
    configuration.GetValue<string>("EmailServiceConfig:SmtpHost"),
    configuration.GetValue<int>("EmailServiceConfig:Port"),
    configuration.GetValue<string>("EmailServiceConfig:Email"),
    configuration.GetValue<string>("EmailServiceConfig:Password"))
);
builder.Services.AddScoped<AuthService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
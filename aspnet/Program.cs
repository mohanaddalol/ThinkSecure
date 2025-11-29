// Sample Program.cs for ASP.NET Core to load YARP reverse proxy from proxy.config.json
// Place this in your ASP.NET project Program.cs (merge with your existing file).

using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

// Load optional proxy config (ensure the file exists in the project folder and is copied to output)
builder.Configuration.AddJsonFile("proxy.config.json", optional: true, reloadOnChange: true);

// Add reverse proxy and load configuration from the "ReverseProxy" section
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

// Add controllers or razor pages as needed
builder.Services.AddControllersWithViews();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseStaticFiles();
app.UseRouting();

// Map the reverse proxy middleware
app.MapReverseProxy();

// Map other endpoints
app.MapDefaultControllerRoute();

app.Run();

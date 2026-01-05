
var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<NaraSettings>(
    builder.Configuration.GetSection("Nara")
);
builder.Services.AddHttpClient<INaraClient, NaraClient>();
builder.Services.AddScoped<QueryService>();
builder.Services.AddOpenApi();

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}



app.Run();

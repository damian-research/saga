
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();

builder.Services.Configure<NaraSettings>(
    builder.Configuration.GetSection("Nara")
);

builder.Services.AddSingleton<INaraClient, NaraClient>();
builder.Services.AddScoped<QueryService>();
builder.Services.AddHttpClient<DownloadService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCors", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors("DevCors");

app.UseAuthorization();
app.MapControllers();

app.Run();

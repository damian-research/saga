
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();

builder.Services.Configure<SagaSettings>(
    builder.Configuration.GetSection("Nara")
);

builder.Services.AddAutoMapper(cfg =>
{
    cfg.AddProfile<NaraToEad3Profile>();
});
builder.Services.AddScoped<INaraToEad3Mapper, NaraToEad3Mapper>();
builder.Services.AddScoped<INaraClient, NaraClientWithMapper>();
//builder.Services.AddSingleton<IUknaClient, UknaClient>();
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

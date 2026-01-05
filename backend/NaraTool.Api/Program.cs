
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();

builder.Services.Configure<NaraSettings>(
    builder.Configuration.GetSection("Nara")
);
builder.Services.AddHttpClient<INaraClient, NaraClient>();
builder.Services.AddScoped<QueryService>();
builder.Services.AddHttpClient<DownloadService>();

var app = builder.Build();
// app.UseSwagger();
// app.UseSwaggerUI();
//app.UseHttpsRedirection();

app.MapControllers();

app.Run();

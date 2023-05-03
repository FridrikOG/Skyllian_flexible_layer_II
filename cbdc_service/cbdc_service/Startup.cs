using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
// using sofo.data; // where our connection is in
using cbdc_service.Entities;
using cbdc_service.Models.Interfaces;
using cbdc_service.Models.Context;
using cbdc_service.Models.EntityFramework;
using cbdc_service.Services.Interfaces;
using cbdc_service.Services.Implementations;
using cbdc_service.Utilities.Security.Encryption;
using cbdc_service.Utilities.Security.JWT;
using cbdc_service.Utilities.Security.JWT.Interfaces;
// Import IEXcloud 
using IEXSharp;
using IEXSharp.Model.CoreData;
using System;
using IEXSharp.Service.Legacy.Stock;

namespace cbdc_service
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Here I am injecting Database ApiDbContext so it is available everywhere
            // var conn = Configuration.GetConnectionString("DefaultConnection");
            // services.AddDbContext<SocialLoginContext>(options => options.UseNpgsql(conn));

            services.AddControllers();
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                    builder => builder.AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader());
            });

            services.AddSingleton<IEXCloudClient>(sp =>
            {
                string secretToken = Configuration["IEXCloud:APIKey"];
                string publishableToken = Configuration["IEXCloud:PublishableToken"];
                bool isSandbox = Convert.ToBoolean(Configuration["IEXCloud:IsSandbox"]);


                string baseUrl = isSandbox ? "https://sandbox.iexapis.com/stable/" : "https://cloud.iexapis.com/stable/";

                return new IEXCloudClient(publishableToken, secretToken, false, isSandbox);
            });

            services.AddAutoMapper(typeof(Startup));
            services.Configure<GoogleProviderOptions>(Configuration.GetSection("GoogleProviderOptions"));
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "WebAPISocialLogin", Version = "v1" });
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "JWT Authorization header using the Bearer scheme. \r\n\r\n Enter 'Bearer' [space] and then your token in the text input below.\r\n\r\nExample: \"Bearer 12345abcdef\"",
                });
                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                          new OpenApiSecurityScheme
                            {
                                Reference = new OpenApiReference
                                {
                                    Type = ReferenceType.SecurityScheme,
                                    Id = "Bearer"
                                }
                            },
                            new string[] {}

                    }
                });
            });
            var tokenOptions = Configuration.GetSection("TokenOptions").Get<TokenOptions>();

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidIssuer = tokenOptions.Issuer,
                        ValidAudience = tokenOptions.Audience,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = SecurityKeyHelper.CreateSecurityKey(tokenOptions.SecurityKey)
                    };
                });

            services.AddTransient<IAuthService, AuthManager>();
            services.AddTransient<ITokenHelper, JwtHelper>();
            services.AddTransient<IUserService, UserManager>();
            services.AddTransient<IUserDal, EfUserDal>();





        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "WebAPISocialLogin v1"));
            }
            app.UseCors("CorsPolicy");

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}

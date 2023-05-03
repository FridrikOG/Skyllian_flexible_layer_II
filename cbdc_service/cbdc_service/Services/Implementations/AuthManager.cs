using Google.Apis.Auth;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;

using cbdc_service.Entities;
using cbdc_service.Entities.Dto;
using cbdc_service.Entities.Enums;
using cbdc_service.Services.Interfaces;
using cbdc_service.Utilities.Result;
using cbdc_service.Utilities.Security.JWT;
using cbdc_service.Utilities.Security.JWT.Interfaces;
using cbdc_service.Utilities.Security.Hashing;
using cbdc_service.Models.Dto;

namespace cbdc_service.Services.Implementations
{
    public class AuthManager : IAuthService
    {
        private readonly IUserService _userService;
        private readonly ITokenHelper _tokenHelper;
        private readonly GoogleProviderOptions _googleProviderOptions;

        public AuthManager(IUserService userService, ITokenHelper tokenHelper, IOptions<GoogleProviderOptions> googleProviderOptions)
        {
            _userService = userService;
            _tokenHelper = tokenHelper;
            _googleProviderOptions = googleProviderOptions.Value;
        }

        public IDataResult<User> Register(UserForRegisterDto userForRegisterDto)
        {
            HashingHelper.CreatePasswordHash(userForRegisterDto.Password, out byte[] passwordHash, out byte[] passwordSalt);
            var user = new User
            {
                Email = userForRegisterDto.Email,
                FirstName = userForRegisterDto.FirstName,
                LastName = userForRegisterDto.LastName,
                UserName = userForRegisterDto.UserName,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                Status = true
            };
            _userService.Add(user);
            return new SuccessDataResult<User>(user, "User registered");
        }

        public IDataResult<User> Login(UserForLoginDto userForLoginDto)
        {
            var userToCheck = _userService.GetByMail(userForLoginDto.Email);
            if (!userToCheck.Success)
            {
                return new ErrorDataResult<User>(userToCheck.Data, "User not found");
            }

            if (!HashingHelper.VerifyPassowrdHash(userForLoginDto.Password, userToCheck.Data.PasswordHash, userToCheck.Data.PasswordSalt))
            {
                return new ErrorDataResult<User>(userToCheck.Data, "Incorrect password");
            }

            return new SuccessDataResult<User>(userToCheck.Data, "Login successful, redirecting...");
        }

        public IResult UserExists(string email, string userName)
        {
            var result = _userService.GetByMail(email);
            if (result.Success)
            {
                return new ErrorResult("User with email exists " + email);
            }
            var result2 = _userService.GetByUserName(userName);
            if (result2.Success)
            {
                return new ErrorResult("User with username exists " + userName);
            }
            return new SuccessResult();
        }

        public IDataResult<AccessToken> CreateAccessToken(User user)
        {
            var claims = _userService.GetClaims(user);
            var accessToken = _tokenHelper.CreateToken(user, claims.Data);
            return new SuccessDataResult<AccessToken>(accessToken, "Token created");
        }

        public IDataResult<AccessToken> ProviderSignIn(AuthenticateRequest data)
        {
            // Creates user if it doesn't exist
            if (data.Provider == Provider.GOOGLE.Value)
            {
                GoogleJsonWebSignature.ValidationSettings settings = new GoogleJsonWebSignature.ValidationSettings();
                // Change this to your google client ID
                settings.Audience = new List<string>() { _googleProviderOptions.ClientId };

                GoogleJsonWebSignature.Payload payload = GoogleJsonWebSignature.ValidateAsync(data.IdToken, settings).Result;
                var result = _userService.GetByMail(payload.Email);
                if (result.Success)
                {
                    Console.WriteLine("Successfully signed in with GOOGLE");
                    Console.WriteLine(result.Data);
                    var result2 = CreateAccessToken(result.Data);
                    Console.WriteLine(result2.Data);
                    Console.WriteLine(result2.Data.Expiration);
                    Console.WriteLine(result2.Data.RefreshToken);
                    Console.WriteLine(result2.Data.Token);
                    return new SuccessDataResult<AccessToken>(result2.Data);
                }
                else {
                    var user = new User
                    {
                        Email = payload.Email,
                        FirstName = payload.GivenName,
                        LastName = payload.FamilyName,
                        UserName = payload.Email,
                        Status = true
                    };
                    _userService.Add(user);
                    var result2 = CreateAccessToken(user);
                    return new SuccessDataResult<AccessToken>(result2.Data);
                }
                return new ErrorDataResult<AccessToken>("User not found. New User Will Be Created...");
            }
            else if (data.Provider == Provider.FACEBOOK.Value)
            {

            }
            else if (data.Provider == Provider.TWITTER.Value)
            {

            }
            else if (data.Provider == Provider.VK.Value)
            {

            }
            else if (data.Provider == Provider.MICROSOFT.Value)
            {

            }
            else if (data.Provider == Provider.AMAZON.Value)
            {

            }

            return null;

        }
    }
}

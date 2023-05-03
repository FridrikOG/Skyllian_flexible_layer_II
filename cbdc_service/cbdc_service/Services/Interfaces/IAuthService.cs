using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using cbdc_service.Entities;
using cbdc_service.Entities.Dto;
using cbdc_service.Models.Dto;
using cbdc_service.Utilities.Result;
using cbdc_service.Utilities.Security.JWT;

namespace cbdc_service.Services.Interfaces
{
    public interface IAuthService
    {
        IDataResult<User> Register(UserForRegisterDto userForRegisterDto);
        IDataResult<User> Login(UserForLoginDto userForLoginDto);
        IResult UserExists(string email, string userName);
        IDataResult<AccessToken> CreateAccessToken(User user);

        IDataResult<AccessToken> ProviderSignIn(AuthenticateRequest data);
       

    }
}

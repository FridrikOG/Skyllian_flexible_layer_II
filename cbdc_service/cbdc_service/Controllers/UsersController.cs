using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;

using cbdc_service.Entities;
using cbdc_service.Entities.Dto;
using cbdc_service.Services.Interfaces;

namespace cbdc_service.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public UsersController(IUserService userService, IMapper mapper)
        {
            _userService = userService;
            _mapper = mapper;
        }

        public class SearchUserRequest
        {
            public string SearchString { get; set; }
        }

        
        [HttpPost("search-users")]
        public IActionResult SearchUser([FromBody] SearchUserRequest request)
        {
            var searchString = request.SearchString;
            Console.WriteLine("Here we go ");
            Console.WriteLine(searchString);
            
            var users = _userService.SearchUser(searchString);
            
            if (users.Success)
            {
                return Ok(users);
            }
            return Ok();
        }

        // TODO: GET USER BY USERNAME

        [HttpPost("get-user")]
        public IActionResult GetUser([FromBody] UserForInformationDto user)
            {
            var getUserInfo = _userService.GetByMail(user.Email);
            if (getUserInfo.Success)
            {

                return Ok(new UserForSetUserDto { User = getUserInfo.Data});
            }
            return Ok();
        }
        [HttpPost("set-user")]
        public IActionResult SetUser([FromBody] User user)
        {
            var result = _userService.SetUserUpdate(user);
            if (result.Success)
            {
                return Ok(result);
            }
            return BadRequest();
        }
    }
}

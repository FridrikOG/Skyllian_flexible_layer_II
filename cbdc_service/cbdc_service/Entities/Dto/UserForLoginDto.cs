using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using cbdc_service.Entities.Interfaces;

namespace cbdc_service.Models.Dto
{
    public class UserForLoginDto : IDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using cbdc_service.Entities.Interfaces;

namespace cbdc_service.Entities.Dto
{
    public class UserForRegisterDto : IDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string ProviderId { get; set; }
        public string ProviderName { get; set; }

    }
}

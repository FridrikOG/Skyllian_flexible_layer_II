using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using cbdc_service.Entities.Interfaces;

namespace cbdc_service.Entities.Dto
{
    public class UserForInformationDto:IDto
    {
        public string Email { get; set; }

    }
}

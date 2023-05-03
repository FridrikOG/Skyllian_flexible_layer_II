using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using cbdc_service.Entities;

namespace cbdc_service.Utilities.Security.JWT.Interfaces
{
    public interface ITokenHelper
    {
        AccessToken CreateToken(User user, List<OperationClaim> operationClaims);

    }
}

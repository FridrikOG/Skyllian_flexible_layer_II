using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using cbdc_service.Entities;
using cbdc_service.Entities.Dto;
using cbdc_service.Models.EntityFramework;
using cbdc_service.Utilities.Result;

namespace cbdc_service.Models.Interfaces
{
    public interface IUserDal : IEntityRepository<User>
    {
        List<OperationClaim> GetClaims(User user);
        List<UserSearchResult> GetUsersByCriteria(String searchString);
    }
}

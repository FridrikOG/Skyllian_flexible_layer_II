using System.Collections.Generic;
using System.Linq;

using cbdc_service.Entities;
using cbdc_service.Entities.Dto;
using cbdc_service.Models.Interfaces;
using cbdc_service.Models.Context;

namespace cbdc_service.Models.EntityFramework;




public class EfUserDal : EfEntityRepositoryBase<User, SocialLoginContext>, IUserDal
{
    public List<OperationClaim> GetClaims(User user)
    {
        using (var context = new SocialLoginContext())
        {
            var result = from operationClaim in context.OperationClaims
                join userOperationClaim in context.UserOperationClaims
                    on operationClaim.Id equals userOperationClaim.OperationClaimId
                where userOperationClaim.UserId == user.Id
                select new OperationClaim { Id = operationClaim.Id, Name = operationClaim.Name };
            return result.ToList();
        }
    }

    public List<UserSearchResult> GetUsersByCriteria(string searchString)
        // Search string, either in username, firstname, or last name (we can also query emai)
    {
        searchString = searchString.Trim().ToLower();

        using (var context = new SocialLoginContext())
        {
            var result = context.Users
                .Where(u => u.UserName.Contains(searchString) || u.FirstName.Contains(searchString) ||
                            u.LastName.Contains(searchString)).Select(u => new UserSearchResult
                            { Id = u.Id, FirstName = u.FirstName, LastName = u.LastName, UserName = u.UserName, Email= u.Email }).ToList();
            return result;
        }
    }
}
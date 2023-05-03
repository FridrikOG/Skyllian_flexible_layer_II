using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using cbdc_service.Entities;
using cbdc_service.Utilities.Result;
using cbdc_service.Models.EntityFramework;
using cbdc_service.Entities.Dto;

namespace cbdc_service.Services.Interfaces
{
    public interface IUserService
    {
        IResult Add(User user);
        IResult Update(User user);
        IResult Delete(User user);
        IResult SetUserUpdate(User user);
        IDataResult<User> GetById(int id);
        IDataResult<List<User>> GetAll();
        IDataResult<List<OperationClaim>> GetClaims(User user);
        IDataResult<User> GetByMail(string mail);
        IDataResult<User> GetByUserName(string mail);
        IDataResult<List<UserSearchResult>> SearchUser(string searchString);
    }
}

using AutoMapper;
using System;
using System.Collections.Generic;

using cbdc_service.Entities;
using cbdc_service.Models.Interfaces;
using cbdc_service.Services.Interfaces;
using cbdc_service.Utilities.Result;
using cbdc_service.Entities.Dto;

namespace cbdc_service.Services.Implementations
{
    public class UserManager : IUserService
    {
        private readonly IUserDal _userDal;
        private readonly IMapper _mapper;

        public UserManager(IUserDal userDal, IMapper mapper)
        {
            _userDal = userDal;
            _mapper = mapper;
        }


        public IDataResult<List<UserSearchResult>> SearchUser(string searchString)
        {
            var users = _userDal.GetUsersByCriteria(searchString);
            // here we want to write the logic
            /* var users = _userDal.Users
                 .Where(u => u.Username.Contains(searchString) || u.FirstName.Contains(searchString))
                 .ToList();*/
            if (users == null)
            {
                return new ErrorDataResult<List<UserSearchResult>>(users, "");
            }
            else
            {
                return new SuccessDataResult<List<UserSearchResult>>(users, "");
            }
        }

        public IDataResult<List<User>> GetAll()
        {
            var result = _userDal.GetAll();
            return new SuccessDataResult<List<User>>(result, "");
        }

        public IDataResult<User> GetById(int id)
        {
            var result = _userDal.Get(u => u.Id == id);
            if (result == null)
            {
                return new ErrorDataResult<User>(result, "User not found");

            }
            return new SuccessDataResult<User>(result, "User found");
        }
        public IDataResult<User> GetByMail(string mail)
        {
            User user = _userDal.Get(p => p.Email == mail);
            if (user == null)
            {
                return new ErrorDataResult<User>(user, "");
            }
            else
            {
                return new SuccessDataResult<User>(user, "");
            }
        }
        // This function should check if UserName already exists
        public IDataResult<User> GetByUserName(string userName)
        {
            User user = _userDal.Get(p => p.UserName == userName);
            if (user == null)
            {
                return new ErrorDataResult<User>(user, "");
            }
            else
            {
                return new SuccessDataResult<User>(user, "");
            }
        }

        public IDataResult<List<OperationClaim>> GetClaims(User user)
        {
            return new SuccessDataResult<List<OperationClaim>>(_userDal.GetClaims(user));
        }

        public IResult Update(User user)
        {
            _userDal.Update(user);
            return new SuccessResult("");
        }
        //[SecuredOperation("user.add,administrator")]
        //[ValidationAspect(typeof(UserValidator))]
        //[CacheRemoveAspect("IUserService.Get")]
        public IResult Add(User user)
        {
            _userDal.Add(user);
            return new SuccessResult("");
        }

        public IResult Delete(User user)
        {
            _userDal.Delete(user);
            return new SuccessResult("");
        }

        public IResult SetUserUpdate(User user)
        {
            try
            {
                User getUser = _userDal.Get(x => x.Id == user.Id);
                getUser.Address = user.Address;
                getUser.City = user.City;
                getUser.County = user.County;
                getUser.UserName = user.UserName;
                getUser.ProfileAvatarUrl = user.ProfileAvatarUrl;
                getUser.Tel = user.Tel;
                getUser.FirstName = user.FirstName;
                getUser.LastName = user.LastName;
                var entity = _userDal.Update(getUser);
                return new SuccessResult("Record updated");
            }
            catch (Exception)
            {

                return new ErrorResult();
            }


        }
    }
}

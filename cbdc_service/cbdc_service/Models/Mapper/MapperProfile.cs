using AutoMapper;


using cbdc_service.Entities;
using cbdc_service.Entities.Dto;


namespace WebAPISocialLogin.Models.Mapper
{
    public class MapperProfile : Profile
    {
        public MapperProfile()
        {
            CreateMap<UserForSetUserDto, User>();
              
        }
    }
}

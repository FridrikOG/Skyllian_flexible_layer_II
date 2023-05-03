using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using cbdc_service.Entities.Interfaces;

namespace cbdc_service.Models.Interfaces
{
    public interface IEntityRepository<T> where T : class, IEntity, new()
    {

        List<T> GetAll(Expression<Func<T, bool>> filter = null);
        T Get(Expression<Func<T, bool>> filter = null);
        T Add(T entity);
        IEnumerable<T> AddRange(IEnumerable<T> entity);
        T Update(T entity);
        void Delete(T entity);
    }
}

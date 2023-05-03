using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using cbdc_service.Entities.Interfaces;

namespace cbdc_service.Entities
{
    public class UserOperationClaim : IEntity
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int OperationClaimId { get; set; }

    }
}

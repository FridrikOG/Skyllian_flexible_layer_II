#nullable enable

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using cbdc_service.Entities.Interfaces;

namespace cbdc_service.Entities
{
    public class Post : IEntity
    {
        public int Id { get; set; }
        public string Comment { get; set; }
        public DateTime CreatedAt { get; set; }


        
        public User User { get; set; }
        public int UserId { get; set; }

        public Post Parent { get; set; }
        public int ParentId { get; set; }


        

        // public Post(int id, string comment, DateTime? createdAt, int userId, int parentId)
        // {
        //     Id = id;
        //     UserId = userId;
        //     ParentId = parentId;

        //     Comment = comment;
        //     CreatedAt = createdAt;
        // }
    }
}

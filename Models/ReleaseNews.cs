using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DailyTaskTracker.Models
{
    public class ReleaseNews
    {
        public int Id { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string UserId { get; set; }
        public virtual ApplicationUser User { get; set; }
    }
}

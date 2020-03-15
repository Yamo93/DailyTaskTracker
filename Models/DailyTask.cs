using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DailyTaskTracker.Models
{
    public class DailyTask
    {
        public int Id { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Description { get; set; }
        public double TimeSpentInHours { get; set; }
        public string GitHubBranchUrl { get; set; }
        public string TrelloBoardUrl { get; set; }
        public string UserId { get; set; }
    }
}

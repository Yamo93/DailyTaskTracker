using DailyTaskTracker.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace DailyTaskTracker.Authorization
{
    public class TaskAuthorizationHandler : AuthorizationHandler<OperationAuthorizationRequirement, DailyTask>
    {
        private UserManager<ApplicationUser> _userManager;
        public TaskAuthorizationHandler(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context,
                                               OperationAuthorizationRequirement requirement,
                                               DailyTask resource)
        {
            if (resource.UserId == context.User.FindFirstValue(ClaimTypes.NameIdentifier))
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }
    }

    public class SameUserRequirement : IAuthorizationRequirement { }
}

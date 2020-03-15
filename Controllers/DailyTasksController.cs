using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DailyTaskTracker.Data;
using DailyTaskTracker.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization.Infrastructure;

namespace DailyTaskTracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DailyTasksController : ControllerBase
    {
        private readonly IAuthorizationService _authorizationService;
        private readonly ApplicationDbContext _context;
        private UserManager<ApplicationUser> _userManager;

        public DailyTasksController(IAuthorizationService authorizationService, ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _authorizationService = authorizationService;
            _context = context;
            _userManager = userManager;
        }

        // GET: api/DailyTasks
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DailyTask>>> GetTask()
        {
            return await _context.Task.ToListAsync();
        }

        // GET: api/DailyTasks/5
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<DailyTask>> GetDailyTask(int id)
        {
            var dailyTask = await _context.Task.FindAsync(id);

            if (dailyTask == null)
            {
                return NotFound();
            }

            var authorizationResult = await _authorizationService.AuthorizeAsync(User, dailyTask, Operations.Read);

            if (authorizationResult.Succeeded)
            {
                return dailyTask;
            } else
            {
                return new ForbidResult();
            }

        }

        // PUT: api/DailyTasks/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDailyTask(int id, DailyTask dailyTask)
        {
            if (id != dailyTask.Id)
            {
                return BadRequest();
            }

            _context.Entry(dailyTask).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DailyTaskExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/DailyTasks
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<DailyTask>> PostDailyTask(DailyTask dailyTask)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // will give the user's userId

            dailyTask.UserId = userId;

            _context.Task.Add(dailyTask);

            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDailyTask", new { id = dailyTask.Id }, dailyTask);
        }

        // DELETE: api/DailyTasks/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult<DailyTask>> DeleteDailyTask(int id)
        {
            var dailyTask = await _context.Task.FindAsync(id);
            if (dailyTask == null)
            {
                return NotFound();
            }

            _context.Task.Remove(dailyTask);
            await _context.SaveChangesAsync();

            return dailyTask;
        }

        private bool DailyTaskExists(int id)
        {
            return _context.Task.Any(e => e.Id == id);
        }
    }

    public static class Operations
    {
        public static OperationAuthorizationRequirement Create =
            new OperationAuthorizationRequirement { Name = nameof(Create) };
        public static OperationAuthorizationRequirement Read =
            new OperationAuthorizationRequirement { Name = nameof(Read) };
        public static OperationAuthorizationRequirement Update =
            new OperationAuthorizationRequirement { Name = nameof(Update) };
        public static OperationAuthorizationRequirement Delete =
            new OperationAuthorizationRequirement { Name = nameof(Delete) };
    }
}

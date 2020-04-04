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

namespace DailyTaskTracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReleaseNewsController : ControllerBase
    {
        private readonly IAuthorizationService _authorizationService;
        private readonly ApplicationDbContext _context;
        private UserManager<ApplicationUser> _userManager;

        public ReleaseNewsController(IAuthorizationService authorizationService, ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _authorizationService = authorizationService;
            _context = context;
            _userManager = userManager;
        }

        // GET: api/ReleaseNews
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReleaseNews>>> GetNews()
        {
            return await _context.News.ToListAsync();
        }

        // GET: api/ReleaseNews/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ReleaseNews>> GetReleaseNews(int id)
        {
            var releaseNews = await _context.News.FindAsync(id);

            if (releaseNews == null)
            {
                return NotFound();
            }

            return releaseNews;
        }

        // PUT: api/ReleaseNews/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReleaseNews(int id, ReleaseNews releaseNews)
        {
            if (id != releaseNews.Id)
            {
                return BadRequest();
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // will give the user's userId
            var user = await _userManager.FindByIdAsync(userId);
            var role = await _userManager.GetRolesAsync(user);

            if (role.Count == 0 || role[0] != "Admin")
            {
                return Forbid();
            }

            releaseNews.UpdatedDate = DateTime.Now;
            _context.Entry(releaseNews).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ReleaseNewsExists(id))
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

        // POST: api/ReleaseNews
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<ReleaseNews>> PostReleaseNews(ReleaseNews releaseNews)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // will give the user's userId
            var user = await _userManager.FindByIdAsync(userId);
            var role = await _userManager.GetRolesAsync(user);

            if (role.Count == 0 || role[0] != "Admin")
            {
                return Forbid();
            }

            releaseNews.CreatedDate = DateTime.Now;
            _context.News.Add(releaseNews);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetReleaseNews", new { id = releaseNews.Id }, releaseNews);
        }

        // DELETE: api/ReleaseNews/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult<ReleaseNews>> DeleteReleaseNews(int id)
        {
            var releaseNews = await _context.News.FindAsync(id);
            if (releaseNews == null)
            {
                return NotFound();
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // will give the user's userId
            var user = await _userManager.FindByIdAsync(userId);
            var role = await _userManager.GetRolesAsync(user);

            if (role.Count == 0 || role[0] != "Admin")
            {
                return Forbid();
            }

            _context.News.Remove(releaseNews);
            await _context.SaveChangesAsync();

            return releaseNews;
        }

        private bool ReleaseNewsExists(int id)
        {
            return _context.News.Any(e => e.Id == id);
        }
    }
}

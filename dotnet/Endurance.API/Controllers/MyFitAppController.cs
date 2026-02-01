using Endurance.API.Interfaces;
using Endurance.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace Endurance.Api.Controllers;

[ApiController]
[Route("myfitapp")]
public class MyFitAppController : ControllerBase
{
    private readonly IMyFitAppService _myFitAppClient;
    private readonly IWatchedClassService _watchedClassService;

    public MyFitAppController(
        IMyFitAppService myFitAppClient,
        IWatchedClassService watchedClassService)
    {
        _myFitAppClient = myFitAppClient;
        _watchedClassService = watchedClassService;
    }

    [HttpGet("get-venues")]
    [ProducesResponseType(typeof(List<Venue>), StatusCodes.Status200OK)]
    public IActionResult GetVenues()
    {
        var venues = new List<Venue>
        {
            new() { Id = "48261", Name = "Club Pellikaan Almere" },
            new() { Id = "48260", Name = "Club Pellikaan Amersfoort" },
            new() { Id = "48262", Name = "Club Pellikaan Apeldoorn" },
            new() { Id = "48259", Name = "Club Pellikaan Breda" },
            new() { Id = "48258", Name = "Club Pellikaan Goirle" },
            new() { Id = "48255", Name = "Club Pellikaan Maastricht" },
            new() { Id = "48257", Name = "Club Pellikaan Tilburg" }
        };

        return Ok(venues);
    }

    [HttpGet("get-classes")]
    public async Task<IActionResult> GetClasses(
        [FromQuery] string venueId,
        [FromQuery] DateTime startDate)
    {
        try
        {
            var classes = await _myFitAppClient.GetScheduledClasses(venueId, startDate);
            return Ok(classes);
        }
        catch (Exception ex)
        {
            return Problem(ex.Message);
        }
    }

    [HttpPost("add-classes")]
    public async Task<IActionResult> AddClasses([FromBody] AddWatchedClassRequest request)
    {
        try
        {
            await _watchedClassService.AddEmailWatcher(
                request.VenueId,
                request.ClassId,
                request.EmailAddress,
                request.StartDateTime
            );

            return Ok();
        }
        catch (Exception ex)
        {
            return Problem(ex.Message);
        }
    }
}
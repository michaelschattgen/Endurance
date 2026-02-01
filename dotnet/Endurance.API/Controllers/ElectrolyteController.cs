using Endurance.API.Clients;
using Endurance.API.Interfaces;
using Endurance.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace Endurance.Api.Controllers;

[ApiController]
public class ElectrolyteController : ControllerBase
{
    private readonly IElectrolyteClient _electrolyteClient;
    private readonly IWatchedClassService _watchedClassService;

    public ElectrolyteController(
        IElectrolyteClient electrolyteClient,
        IWatchedClassService watchedClassService)
    {
        _electrolyteClient = electrolyteClient;
        _watchedClassService = watchedClassService;
    }

    [HttpGet("/get-venues")]
    public async Task<IActionResult> GetVenues()
    {
        try
        {
            var response = await _electrolyteClient.GetVenues();
            return Ok(response);
        }
        catch (Exception ex)
        {
            return Problem(ex.Message);
        }
    }

    [HttpGet("/get-classes")]
    public async Task<IActionResult> GetClasses(
        [FromQuery] string venueId,
        [FromQuery] DateTime startDate)
    {
        try
        {
            var formattedStartDate = startDate.ToString("yyyy-MM-ddTHH:mm:ss.fffzzz");

            var response = await _electrolyteClient.GetScheduledClasses(
                venueId,
                false,
                formattedStartDate,
                "all"
            );

            var classes = response.ScheduledClasses.Select(x => new ScheduledClassModel
            {
                Id = x.Id,
                VenueId = x.VenueId,
                Description = x.Activity.Description,
                DurationSeconds = x.DurationSeconds,
                SpotsAvailable = x.SpotsAvailable,
                Capacity = x.Capacity,
                StartTime = x.StartTime,
                ClassTypeIcon = x.ClassTypeIcon,
                Activity = x.Activity
            });

            return Ok(classes);
        }
        catch (Exception ex)
        {
            return Problem(ex.Message);
        }
    }

    [HttpPost("/add-classes")]
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

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using server.DTOs;
using server.Interfaces;
using server.Models;
using server.Repositories;
using server.Services;
using System.Text;
using System.Text.Json;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GiftController : ControllerBase
    {
        private readonly IGiftService _giftService;
        private readonly ILogger<GiftController> _logger;
        private readonly IDistributedCache _cache;


        public GiftController(IGiftService giftService, ILogger<GiftController> logger, IDistributedCache cache)
        {
            _giftService = giftService;
            _logger = logger;
            _cache = cache;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<GiftResponseDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<GiftResponseDto>>> GetAll()
        {
            var cacheKey = "all-gifts";

            var cachedData = await _cache.GetStringAsync(cacheKey);

            if (!string.IsNullOrEmpty(cachedData))
            {
                _logger.LogInformation("CACHE HIT");
                var giftsFromCache = JsonSerializer.Deserialize<IEnumerable<GiftResponseDto>>(cachedData);
                return Ok(giftsFromCache);
            }

            _logger.LogInformation("CACHE MISS");

            var gifts = await _giftService.GetAll();

            var serializedData = JsonSerializer.Serialize(gifts);
            var cacheOptions = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(300)
            };
            await _cache.SetStringAsync(cacheKey, serializedData, cacheOptions);

            return Ok(gifts);
        }
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(GiftResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> GetById(int id)
        {
            var gift = await _giftService.GetById(id);
            if (gift == null)
            {
                return NotFound(new { message = $"Gift with ID {id} not exist" });
            }
            return Ok(gift);
        }
        [HttpPost]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(typeof(GiftResponseDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> AddGIft([FromBody] CreateGiftDto createDto)
        {
            try
            {
                var gift = await _giftService.AddGift(createDto);
                //return CreatedAtAction(nameof(GetById), new { id = category.Id, category });
                return Ok(gift);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { messege = ex.Message });
            }
        }
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(typeof(GiftResponseDto), StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteGift(int id)
        {
            var reasult = await _giftService.DeleteGift(id);
            if (!reasult)
            {
                return NotFound(new { message = $"Gift with Id {id} not found" });
            }
            return NoContent();
        }

        [HttpPut("{giftId}")]
        //[Authorize(Roles = "Admin")]
        [ProducesResponseType(typeof(GiftResponseDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> UpdateGift([FromRoute] int giftId, [FromBody] UpdateGiftDto createDto)
        {
            try
            {
                var gift = await _giftService.UpdateGift(giftId, createDto);
                //return CreatedAtAction(nameof(GetById), new { id = category.Id, category });
                return Ok(gift);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { messege = ex.Message });
            }
        }

        [HttpPut("Lottery")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(typeof(GiftResponseDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Lottery([FromBody] int giftId)
        {
            try
            {
                var gift = await _giftService.Lottery(giftId);
                return Ok(gift);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { messege = ex.Message });
            }

        }
        [HttpGet("filterGifts")]
        [ProducesResponseType(typeof(GiftResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]

        public async Task<ActionResult<IEnumerable<GiftResponseDto>>> FilterGifts([FromQuery] string? giftName, [FromQuery] string? donorName, [FromQuery] int? buyerCount, [FromQuery] int? categoryId)
        {
            var gifts = await _giftService.FilterGifts(giftName, donorName, buyerCount, categoryId);
            return Ok(gifts);
        }

        [HttpGet("download-report")]
        public async Task<IActionResult> DownloadReport()
        {
            try
            {
                byte[] reportData = await _giftService.GenerateWinnersReport();
                string fileName = $"WinnersReport_{DateTime.Now:yyyyMMdd}.csv";

                return File(reportData, "text/csv; charset=utf-8", fileName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "אירעה שגיאה ביצירת הדוח: " + ex.Message);
            }
        }

    }
}

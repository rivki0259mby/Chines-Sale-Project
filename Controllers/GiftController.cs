using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using server.DTOs;
using server.Interfaces;
using server.Models;
using server.Services;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GiftController : ControllerBase
    {
        private readonly IGiftService _giftService;

        public GiftController(IGiftService giftService)
        {
            _giftService = giftService;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<GiftResponseDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<GiftResponseDto>>> GetAll()
        {
            var gifts = await _giftService.GetAll();
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

        [HttpPut("lottery/{giftId}")]
        public async Task<ActionResult> Lottery([FromRoute] int giftId)
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
        public async Task<ActionResult<IEnumerable<GiftResponseDto>>> FilterGifts([FromQuery] string? giftName, [FromQuery] string? donorName, [FromQuery] int? buyerCount)
        {
            var gifts = await _giftService.FilterGifts(giftName,donorName,buyerCount);
            return Ok(gifts);
        }
    }
}

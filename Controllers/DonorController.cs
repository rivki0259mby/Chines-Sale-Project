using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using server.DTOs;
using server.Interfaces;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DonorController : ControllerBase
    {
        private readonly IDonorService _donorService;

        public DonorController(IDonorService donorService)
        {
            _donorService = donorService;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<DonorResponseDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<DonorResponseDto>>> GetAll()
        {
            var donors = await _donorService.GetAll();
            return Ok(donors);
        }
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(DonorResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> GetById(string id)
        {
            var donor = await _donorService.GetById(id);
            if (donor == null)
            {
                return NotFound(new { message = $"Package with ID {id} not exist" });
            }
            return Ok(donor);
        }
        [HttpPost]
        [ProducesResponseType(typeof(DonorResponseDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> AddDonor([FromBody] DonorCreateDto createDto)
        {
            try
            {
                var donor = await _donorService.AddDonor(createDto);
                //return CreatedAtAction(nameof(GetById), new { id = category.Id, category });
                return Ok(donor);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { messege = ex.Message });
            }
        }
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(DonorResponseDto), StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteDonor(string id)
        {
            var reasult = await _donorService.DeleteDonor(id);
            if (!reasult)
            {
                return NotFound(new { message = $"Donor with Id {id} not found" });
            }
            return NoContent();
        }

        [HttpPut("{id}")]
        [ProducesResponseType(typeof(DonorResponseDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> UpdateDonor([FromRoute]string id, [FromBody] DonorUpdateDto updateDto)
        {
            try
            {
                var donor = await _donorService.UpdateDonor(id, updateDto);
                //return CreatedAtAction(nameof(GetById), new { id = category.Id, category });
                return Ok(donor);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { messege = ex.Message });
            }
        }

        [HttpGet("filterDonor")]
        public async Task<ActionResult<IEnumerable<DonorResponseDto>>> FilterDonors([FromQuery] string? name , [FromQuery] string? email, [FromQuery] int? giftId)
        {
            var donors = await _donorService.FilterDonors(name, email, giftId);
            return Ok(donors);
        }

    }
}

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using server.DTOs;
using server.Interfaces;
using server.Models;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PurchaseController : ControllerBase
    {
        private readonly IPurchaseService _purchaseService;

        public PurchaseController(IPurchaseService purchaseService)
        {
            _purchaseService = purchaseService;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<PurchaseResponseDtos>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<PurchaseResponseDtos>>> GetAll()
        {
            var purchase = await _purchaseService.GetAll();
            return Ok(purchase);
        }
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(PurchaseResponseDtos), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> GetById(int id)
        {
            var purchase = await _purchaseService.GetById(id);
            if (purchase == null)
            {
                return NotFound(new { message = $"Purchase with ID {id} not exist" });
            }
            return Ok(purchase);
        }

        [HttpGet("getByUserId/{userId}")]
        [ProducesResponseType(typeof(PurchaseResponseDtos), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> GetByUserId(string userId)
        {
            var purchase = await _purchaseService.GetByUserId(userId);
            if (purchase == null)
            {
                return NotFound(new { message = $"Purchase with UserId {userId} not exist" });
            }
            return Ok(purchase);
        }
        [HttpPost]
        [ProducesResponseType(typeof(PurchaseResponseDtos), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> AddPurchase([FromBody] PurchaseCreateDtos createDto)
        {
            try
            {
                var purchase = await _purchaseService.AddPurchase(createDto);
                //return CreatedAtAction(nameof(GetById), new { id = category.Id, category });
                return Ok(purchase);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { messege = ex.Message });
            }
        }
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(PurchaseResponseDtos), StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeletePurchase(int id)
        {
            var reasult = await _purchaseService.DeletePurchase(id);
            if (!reasult)
            {
                return NotFound(new { message = $"Purchase with Id {id} not found" });
            }
            return NoContent();
        }

        [HttpPut("{purchaseId}")]
        [ProducesResponseType(typeof(PurchaseResponseDtos), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> UpdatePurchase([FromRoute] int purchaseId, [FromBody] PurchaseUpdateDtos updateDto)
        {
            try
            {
                var purchase = await _purchaseService.UpdatePurchase(purchaseId,updateDto);
                //return CreatedAtAction(nameof(GetById), new { id = category.Id, category });
                return Ok(purchase);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { messege = ex.Message });
            }
        }
        [HttpPost("AddTicket/{purchaseId}")]
        [ProducesResponseType(typeof(PurchaseResponseDtos), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> AddTicketToPurchase([FromRoute] int purchaseId, [FromBody] Ticket ticket)
        {
            try
            {
                var purchase = await _purchaseService.AddTickeToPurchase(purchaseId,ticket);
                return Ok(purchase);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { messege = ex.Message });
            }

        }

        [HttpDelete("{purchaseId}/{ticketId}")]
        [ProducesResponseType(typeof(PurchaseResponseDtos), StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteTicketFromPurchase([FromRoute]int purchaseId, [FromRoute] int ticketId)
        {
            var reasult = await _purchaseService.DeleteTicketFromPurchase(purchaseId, ticketId);
            if (reasult == null)
            {
                return NotFound(new { message = $"Purchase with ticketId {ticketId} not found" });
            }
            return NoContent();
        }

        [HttpPost("AddPackage/{purchaseId}")]
        [ProducesResponseType(typeof(PurchaseResponseDtos), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> AddPackageToPurchase([FromRoute] int purchaseId, [FromBody] Package package)
        {
            try
            {
                var purchase = await _purchaseService.AddPackageToPurchase(purchaseId, package);
                return Ok(purchase);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { messege = ex.Message });
            }

        }

        [HttpDelete("{purchaseId}/{packageId}")]
        [ProducesResponseType(typeof(PurchaseResponseDtos), StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeletePackageFromPurchase([FromRoute] int purchaseId,[FromRoute] int packageId)
        {
            var reasult = await _purchaseService.DeleteTicketFromPurchase(purchaseId, packageId);
            if (reasult == null)
            {
                return NotFound(new { message = $"Purchase with packageId {packageId} not found" });
            }
            return NoContent();
        }
    }
}

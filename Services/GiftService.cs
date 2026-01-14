using server.DTOs;
using server.Interfaces;
using server.Models;

namespace server.Services
{
    public class GiftService:IGiftService
    {
        private readonly IGiftRepository _giftRepository;
        private readonly ILogger<GiftService> _logger;
        public GiftService(IGiftRepository giftRepository, ILogger<GiftService> logger)
        {
            _giftRepository = giftRepository;
            _logger = logger;
        }
        public async Task<GiftResponseDto> AddGift(CreateGiftDto giftDto)
        {
            _logger.LogInformation("Post /add gift called");

            var gift = new Gift
            {
                Name = giftDto.Name,
                Description = giftDto.Description,
                Price = giftDto.Price,
                ImageUrl = giftDto.ImageUrl,
                CategoryId = giftDto.CategoryId,
                DonorId = giftDto.DonorId,
                WinnerId = giftDto.WinnerId,
            };
            try
            {
                var createdGift = await _giftRepository.AddGift(gift);
                return MapToResponeseDto(createdGift);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while adding gift");
                throw;
            }
        }
            

        public async Task<bool> DeleteGift(int id)
        {
            _logger.LogInformation("Post / delete gift {giftId} deleted", id);
            try
            {
                return await _giftRepository.DeleteGift(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting gift");
                throw;
            }
            
        }

        public async Task<IEnumerable<GiftResponseDto>> GetAll()
        {
            _logger.LogInformation("Get / all gift called");
            try
            {
                var gifts = await _giftRepository.GetAll();
                return gifts.Select(MapToResponeseDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving gifts");
                throw;
            }
            
        }

        public async Task<GiftResponseDto> GetById(int id)
        {
            _logger.LogInformation("Get / get gift : {giftId} called", id);
            try
            {
                var gift = await _giftRepository.GetById(id);
                return gift != null ? MapToResponeseDto(gift) : null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving gift by ID");
                throw;
            }
        }
            
        public async Task<GiftResponseDto> UpdateGift(int giftId, UpdateGiftDto giftDto)
        {
            _logger.LogInformation("PUT / update gift : {giftId} called", giftId);
            try
            {
                var existingGift = await _giftRepository.GetById(giftId);
                if (existingGift == null)
                    return null;
                existingGift.Name = giftDto.Name;
                existingGift.Description = giftDto.Description;
                existingGift.Price = giftDto.Price;
                existingGift.ImageUrl = giftDto.ImageUrl;
                existingGift.CategoryId = giftDto.CategoryId;
                existingGift.DonorId = giftDto.DonorId;
                existingGift.WinnerId = giftDto.WinnerId;
                existingGift.IsDrown = giftDto.IsDrown;
                var updatedGift = await _giftRepository.UpdateGift(existingGift);
                return MapToResponeseDto(updatedGift);
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating gift");
                throw;
            }

            
        }



        private static GiftResponseDto MapToResponeseDto(Gift gift)
        {
            return new GiftResponseDto
            {
                Id = gift.Id,
                Name = gift.Name,
                Description = gift.Description,
                Price = gift.Price,
                ImageUrl = gift.ImageUrl,
                CategoryId = gift.CategoryId,
                DonorId = gift.DonorId,
                WinnerId = gift.WinnerId,
                IsDrown = gift.IsDrown
            };
        }
        public async Task<GiftResponseDto> Lottery(int giftId)
        {
            _logger.LogInformation("PUT / lottery gift : {giftId} called", giftId);
            try
            {
                var gift = await _giftRepository.GetById(giftId);
                if (gift == null)
                    throw new InvalidOperationException("this gift not exist");
                if (gift.IsDrown)
                {
                    throw new InvalidOperationException("this gift alredy drown");
                }
                var tickets = gift.Tickets.Where(t => !t.Purchase.IsDraft).ToList();
                if (!tickets.Any())
                    throw new InvalidOperationException("No tickets avilable for lottery");

                var random = new Random();
                var randomTicket = tickets[random.Next(tickets.Count)];

                gift.WinnerId = randomTicket.Purchase.BuyerId;
                gift.IsDrown = true;


                var result = await _giftRepository.UpdateGift(gift);
                if (result != null)
                {
                    return MapToResponeseDto(result);
                }
                else
                {
                    throw new InvalidOperationException("error");

                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while lottery gift");
                throw;
            }

           
        }
        public async Task<IEnumerable<GiftResponseDto>> FilterGifts(string? giftName, string? donorName, int? buyersCount)
        {
            _logger.LogInformation("Get / filter gift called");
            try
            {
                var gifts = await _giftRepository.FilterGifts(giftName, donorName, buyersCount);
                return gifts.Select(MapToResponeseDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while filter gift");
                throw;
            }

           

        }





    }
}

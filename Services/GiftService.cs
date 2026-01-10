using server.DTOs;
using server.Interfaces;
using server.Models;

namespace server.Services
{
    public class GiftService:IGiftService
    {
        private readonly IGiftRepository _giftRepository;
        public GiftService(IGiftRepository giftRepository)
        {
            _giftRepository = giftRepository;
        }
        public async Task<GiftResponseDto> AddGift(CreateGiftDto giftDto)
        {
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
            var createdGift = await _giftRepository.AddGift(gift);
            return MapToResponeseDto(createdGift);
        }

        public async Task<bool> DeleteGift(int id)
        {
            return await _giftRepository.DeleteGift(id);
        }

        public async Task<IEnumerable<GiftResponseDto>> GetAll()
        {
            var gifts = await _giftRepository.GetAll();
            return gifts.Select(MapToResponeseDto);
        }

        public async Task<GiftResponseDto> GetById(int id)
        {
            var gift = await _giftRepository.GetById(id);
            return gift != null ? MapToResponeseDto(gift) : null;
        }
        public async Task<GiftResponseDto> UpdateGift(int giftId, UpdateGiftDto giftDto)
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
            var gift = await _giftRepository.GetById(giftId);
            if (gift == null)
                throw new InvalidOperationException("this gift not exist");
            if (gift.IsDrown)
            {
                throw new InvalidOperationException("this gift alredy drown");
            }
            var tickets = gift.Tickets.Where(t=>!t.Purchase.IsDraft).ToList();
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
        public async Task<IEnumerable<GiftResponseDto>> FilterGifts(string? giftName, string? donorName, int? buyersCount)
        {
            var gifts = await _giftRepository.FilterGifts(giftName, donorName, buyersCount);
            return gifts.Select(MapToResponeseDto);

        }





    }
}

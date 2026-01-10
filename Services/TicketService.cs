using server.DTOs;
using server.Interfaces;
using server.Models;
using server.Repositories;

namespace server.Services
{
    public class TicketService:ITicketService
    {
        private readonly ITicketRepository _ticketRepository;
        private readonly IPurchaseService _purchaseService;
        private readonly IGiftService _giftService;


        public TicketService(ITicketRepository ticketRepository, IPurchaseService purchaseService,IGiftService giftService)
        {
            _ticketRepository = ticketRepository;
            _purchaseService = purchaseService;
            _giftService = giftService;
        }
        public async Task<TicketResponseDtos> AddTicket(TicketCreateDtos ticketDto)
        {
            var gift = await _giftService.GetById(ticketDto.GiftId);
            if (gift.IsDrown)
                throw new InvalidOperationException("this gift alredy drown");
           
            var ticket = new Ticket
            {
                PurchaseId = ticketDto.PurchaseId,
                GiftId = ticketDto.GiftId,
                Quantity = ticketDto.Quantity
            };
            var createdTicket = await _ticketRepository.AddTicket(ticket);
            await _purchaseService.AddTickeToPurchase(ticketDto.PurchaseId, createdTicket);

            return MapToResponeseDto(createdTicket);
        }

        public async Task<bool> DeleteTicket(int id)
        {
            return await _ticketRepository.DeleteTicket(id);
        }

        public async Task<IEnumerable<TicketResponseDtos>> GetAll()
        {
            var tickets = await _ticketRepository.GetAll();
            return tickets.Select(MapToResponeseDto);
        }

        public async Task<TicketResponseDtos> GetById(int id)
        {
            var ticket = await _ticketRepository.GetById(id);
            return ticket != null ? MapToResponeseDto(ticket) : null;
        }
        public async Task<TicketResponseDtos> UpdateTicket(int ticketId,TicketUpdateDtos ticketDto)
        {
            var existingTicket = await _ticketRepository.GetById(ticketId);
            if (existingTicket == null)
                return null;
            existingTicket.PurchaseId = ticketDto.PurchaseId;
            existingTicket.GiftId = ticketDto.GiftId;
            existingTicket.Quantity = ticketDto.Quantity;
            var updatedTicket = await _ticketRepository.UpdateTicket(existingTicket);
            return MapToResponeseDto(updatedTicket);
        }



        private static TicketResponseDtos MapToResponeseDto(Ticket ticket)
        {
            return new TicketResponseDtos
            {
                Id = ticket.Id,
                PurchaseId = ticket.PurchaseId,
                GiftId = ticket.GiftId,
                Quantity = ticket.Quantity
            };
        }
    }
}

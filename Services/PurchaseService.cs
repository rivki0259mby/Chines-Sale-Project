using server.DTOs;
using server.Interfaces;
using server.Models;

namespace server.Services
{
    public class PurchaseService:IPurchaseService
    {
        private readonly IPurchaseRepository _purchaseRepository;
        
        
        public PurchaseService(IPurchaseRepository purchaseRepository)
        {
            _purchaseRepository = purchaseRepository;
           
        }
        public async Task<PurchaseResponseDtos> AddPurchase(PurchaseCreateDtos PurchaseDto)
        {
            var purchase = new Purchase
            {
                BuyerId = PurchaseDto.BuyerId,
                TotalAmount = PurchaseDto.TotalAmount,
                OrderDate = PurchaseDto.OrderDate,
            };
            var createdPurchase = await _purchaseRepository.AddPurchase(purchase);
            return MapToResponeseDto(createdPurchase);
        }

        public async Task<bool> DeletePurchase(int id)
        {
            return await _purchaseRepository.DeletePurchase(id);
        }

        public async Task<IEnumerable<PurchaseResponseDtos>> GetAll()
        {
            var purchases = await _purchaseRepository.GetAll();
            return purchases.Select(MapToResponeseDto);
        }

        public async Task<PurchaseResponseDtos> GetById(int id)
        {
            var purchase = await _purchaseRepository.GetById(id);
            return purchase != null ? MapToResponeseDto(purchase) : null;
        }

        public async Task<PurchaseResponseDtos> GetByUserId(string userId)
        {
            var purchase = await _purchaseRepository.GetByUserId(userId);
            return purchase != null ? MapToResponeseDto(purchase) : null;
        }
        public async Task<PurchaseResponseDtos> UpdatePurchase(int purchaseId, PurchaseUpdateDtos purchaseDto)
        {
            var existingPurchase = await _purchaseRepository.GetById(purchaseId);
            if (existingPurchase == null)
                return null;
            existingPurchase.BuyerId = purchaseDto.BuyerId;
            existingPurchase.TotalAmount = purchaseDto.TotalAmount;
            existingPurchase.OrderDate = purchaseDto.OrderDate;
            existingPurchase.IsDraft = purchaseDto.IsDraft;
            var updatedPurchase = await _purchaseRepository.UpdatePurchase(existingPurchase);
            return MapToResponeseDto(updatedPurchase);
        }

        public async Task<PurchaseResponseDtos> AddTickeToPurchase(int purchaseId, Ticket tikcet)
        {
            var purchase = await _purchaseRepository.GetById(purchaseId);
            if (purchase == null) return null;

            if (!purchase.IsDraft)
                throw new InvalidOperationException("cannot modigy a finalized purchase");

            if (GetRemainingTicketsCount(purchase) <= 0)
            {
                throw new InvalidOperationException("you need to buy a new package");
            }

            if (purchase.Tickets.Any(t => t.Id == tikcet.Id))
                tikcet.Quantity++;

            var update = await _purchaseRepository.AddTicketToPurchase(purchaseId, tikcet);
            return MapToResponeseDto(update);
        }
        public async Task<PurchaseResponseDtos> DeleteTicketFromPurchase(int purchaseId,int ticketId)
        {
            var purchase = await _purchaseRepository.GetById(purchaseId);
            if (purchase == null) return null;

            if (!purchase.IsDraft)
                throw new InvalidOperationException("cannot modigy a finalized purchase");

            var update = await _purchaseRepository.DeleteTicketFromPurchase(purchaseId,ticketId);
            return MapToResponeseDto(update);
                
        }
        public async Task<PurchaseResponseDtos> AddPackageToPurchase(int purchaseId, Package package)
        {
            var purchase = await _purchaseRepository.GetById(purchaseId);
            if (purchase == null) return null;

            if (!purchase.IsDraft)
                throw new InvalidOperationException("cannot modigy a finalized purchase");


            var update = await _purchaseRepository.AddPackageToPurchase(purchaseId, package);
            return MapToResponeseDto(update);
        }
        public async Task<PurchaseResponseDtos> DeletePackageFromPurchase(int purchaseId, int packageId)
        {
            var purchase = await _purchaseRepository.GetById(purchaseId);
            if (purchase == null) return null;

            if (!purchase.IsDraft)
                throw new InvalidOperationException("cannot modigy a finalized purchase");



            var update = await _purchaseRepository.DeletePackageFromPurchase(purchaseId, packageId);
            return MapToResponeseDto(update);

        }

        private int GetRemainingTicketsCount(Purchase purchase)
        {
            var packageCount = purchase.Packages.Sum(p => p.Quentity);
            var ticketCount = purchase.Tickets.Sum(t => t.Quantity);
            return packageCount - ticketCount;
        }




        private static PurchaseResponseDtos MapToResponeseDto(Purchase purchase)
        {
            return new PurchaseResponseDtos
            {
                Id = purchase.Id,
                BuyerId = purchase.BuyerId,
                TotalAmount = purchase.TotalAmount,
                OrderDate = purchase.OrderDate,
                IsDraft = purchase.IsDraft
            };
        }

        
        
    }
}

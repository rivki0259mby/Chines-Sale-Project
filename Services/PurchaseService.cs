using server.DTOs;
using server.Interfaces;
using server.Models;

namespace server.Services
{
    public class PurchaseService:IPurchaseService
    {
        private readonly IPurchaseRepository _purchaseRepository;
        private readonly ILogger<PurchaseService> _logger;
        
        
        public PurchaseService(IPurchaseRepository purchaseRepository,ILogger<PurchaseService> logger)
        {
            _purchaseRepository = purchaseRepository;
            _logger = logger;
           
        }
        public async Task<PurchaseResponseDtos> AddPurchase(PurchaseCreateDtos PurchaseDto)
        {
            _logger.LogInformation("Post /add purchase called");

            var purchase = new Purchase
            {
                BuyerId = PurchaseDto.BuyerId,
                TotalAmount = PurchaseDto.TotalAmount,
                OrderDate = PurchaseDto.OrderDate,
            };
            try
            {
                var createdPurchase = await _purchaseRepository.AddPurchase(purchase);
                return MapToResponeseDto(createdPurchase);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while adding purchase");
                throw;
            }
            
        }

        public async Task<bool> DeletePurchase(int id)
        {
            _logger.LogInformation("Post / delete purchase {purchaseId} deleted", id);
            try
            {
                return await _purchaseRepository.DeletePurchase(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting purchase");
                throw;
            }
            
        }

        public async Task<IEnumerable<PurchaseResponseDtos>> GetAll()
        {
            _logger.LogInformation("Get / all purchase called");
            try
            {
                var purchases = await _purchaseRepository.GetAll();
                return purchases.Select(MapToResponeseDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving purchase");
                throw;
            }
           
        }

        public async Task<PurchaseResponseDtos> GetById(int id)
        {
            _logger.LogInformation("Get / get purchase : {purchaseId} called", id);
            try
            {
                var purchase = await _purchaseRepository.GetById(id);
                return purchase != null ? MapToResponeseDto(purchase) : null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving purchase by ID");
                throw;
            }
            
        }

        public async Task<PurchaseResponseDtos> GetByUserId(string userId)
        {
            _logger.LogInformation("Get / get purchase by user : {userId} called", userId);
            try
            {
                var purchase = await _purchaseRepository.GetByUserId(userId);
                return purchase != null ? MapToResponeseDto(purchase) : null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving purchase by userID");
                throw;
            }
        }
           
        public async Task<PurchaseResponseDtos> UpdatePurchase(int purchaseId, PurchaseUpdateDtos purchaseDto)
        {
            _logger.LogInformation("PUT / update purchase : {purchaseId} called", purchaseId);
            try
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
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating purchase");
                throw;
            }
            
        }

        public async Task<PurchaseResponseDtos> AddTickeToPurchase(int purchaseId, Ticket tikcet)
        {
            _logger.LogInformation("POST / add ticket to purchase : {purchaseId} called", purchaseId);
            try
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
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while add ticket to purchase");
                throw;
            }
            
        }
        public async Task<PurchaseResponseDtos> DeleteTicketFromPurchase(int purchaseId,int ticketId)
        {
            _logger.LogInformation("POST / delete ticket from purchase : {purchaseId} called", purchaseId);
            try
            {
                var purchase = await _purchaseRepository.GetById(purchaseId);
                if (purchase == null) return null;

                if (!purchase.IsDraft)
                    throw new InvalidOperationException("cannot modigy a finalized purchase");

                var update = await _purchaseRepository.DeleteTicketFromPurchase(purchaseId, ticketId);
                return MapToResponeseDto(update);
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, "Error occurred while delete ticket from purchase");
                throw;
            }
           
                
        }
        public async Task<PurchaseResponseDtos> AddPackageToPurchase(int purchaseId, Package package)
        {
            _logger.LogInformation("POST / add package to purchase : {purchaseId} called", purchaseId);
            try
            {
                var purchase = await _purchaseRepository.GetById(purchaseId);
                if (purchase == null) return null;

                if (!purchase.IsDraft)
                    throw new InvalidOperationException("cannot modigy a finalized purchase");


                var update = await _purchaseRepository.AddPackageToPurchase(purchaseId, package);
                return MapToResponeseDto(update);
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, "Error occurred while add package to purchase");
                throw;
            }
            
        }
        public async Task<PurchaseResponseDtos> DeletePackageFromPurchase(int purchaseId, int packageId)
        {
            _logger.LogInformation("POST / delet package from purchase : {purchaseId} called", purchaseId);
            try
            {
                var purchase = await _purchaseRepository.GetById(purchaseId);
                if (purchase == null) return null;

                if (!purchase.IsDraft)
                    throw new InvalidOperationException("cannot modigy a finalized purchase");



                var update = await _purchaseRepository.DeletePackageFromPurchase(purchaseId, packageId);
                return MapToResponeseDto(update);

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while delet package from purchase");
                throw;
            }


        }

        private int GetRemainingTicketsCount(Purchase purchase)
        {
            _logger.LogInformation("GET / Get Remaining Tickets Count");
            try
            {
                var packageCount = purchase.Packages.Sum(p => p.Quentity);
                var ticketCount = purchase.Tickets.Sum(t => t.Quantity);
                return packageCount - ticketCount;
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, "Error occurred while Get Remaining Tickets Count");
                throw;
            }
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

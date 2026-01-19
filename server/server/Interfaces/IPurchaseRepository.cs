using server.Models;

namespace server.Interfaces
{
    public interface IPurchaseRepository
    {
        Task<IEnumerable<Purchase>> GetAll();
        Task<Purchase> GetById(int id);
        Task<Purchase> GetByUserId(string userId);
        Task<Purchase> AddPurchase(Purchase purchase);
        Task<Purchase> UpdatePurchase(Purchase purchase);
        Task<bool> DeletePurchase(int id);
        Task<Purchase> AddTicketToPurchase(int purchaseId, Ticket tikcet);
        Task<Purchase> DeleteTicketFromPurchase(int purchaseId, int tikcet);
        Task<Purchase> AddPackageToPurchase(int purchaseId, Package package);
        Task<Purchase> DeletePackageFromPurchase(int purchaseId, int package);
    }
}

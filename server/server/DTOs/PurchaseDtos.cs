using server.Models;

namespace server.DTOs
{
    public class PurchaseCreateDtos
    {
        public string BuyerId { get; set; }
        public decimal TotalAmount { get; set; } = 0;
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
       
        
    }
    public class PurchaseResponseDtos
    {
        public int Id { get; set; }
        public string BuyerId { get; set; }
        public decimal TotalAmount { get; set; } = 0;
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public bool IsDraft { get; set; } = true;
        public ICollection<PurchasePackageResponseDto> Packages { get; set; } = new List<PurchasePackageResponseDto>();
    }
    public class PurchaseUpdateDtos
    {
       
        public string BuyerId { get; set; }
        public decimal TotalAmount { get; set; } = 0;
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public bool IsDraft { get; set; } = true;
    }
}

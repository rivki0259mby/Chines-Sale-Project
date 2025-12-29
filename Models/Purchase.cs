namespace server.Models
{
    public class Purchase
    {
        public int Id { get; set; }
        public int BuyerId { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime CreatedAt { get; set; }
        public ICollection<Ticket> Tickets { get; set; }
        public Buyer Buyer { get; set; }
    }
}

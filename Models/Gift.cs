namespace server.Models
{
    public class Gift
    {
        public int Id { get; set; }
        public Category Category { get; set; }
        public string Name { get; set; }
        public string ?Description { get; set; }
        public double Price { get; set; } = 10;
        public string? ImageUrl { get; set; }
        public int NumberOfWinner { get; set; } = 1;
        public Donor Donor { get; set; }

        public ICollection<Buyer> Winners { get; set; } = null;

    }
}

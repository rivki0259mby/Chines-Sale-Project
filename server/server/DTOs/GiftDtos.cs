using server.Models;
using System.ComponentModel.DataAnnotations;

namespace server.DTOs
{
    public class CreateGiftDto
    {
        [Required,MaxLength(200)]
        public string Name { get; set; }
        [MaxLength(500)]
        public string? Description { get; set; }
        [Required]
        public decimal Price { get; set; } = 10;
        public string? ImageUrl { get; set; }
        public int CategoryId { get; set; }
        public string DonorId { get; set; }
        public string? WinnerId { get; set; }
        
    }
    public class GiftResponseDto
    {
        public int Id { get; set; }
        [Required, MaxLength(200)]
        public string Name { get; set; }
        [MaxLength(500)]
        public string? Description { get; set; }
        [Required]
        public decimal Price { get; set; } = 10;
        public string? ImageUrl { get; set; }
        public int CategoryId { get; set; }
        public string DonorId { get; set; }
        public string? WinnerId { get; set; }
        public bool IsDrown { get; set; } = false;


    }
    public class UpdateGiftDto
    {
        
        [ MaxLength(200)]
        public string Name { get; set; }
        [MaxLength(500)]
        public string? Description { get; set; }
       
        public decimal Price { get; set; } = 10;
        public string? ImageUrl { get; set; }
        public int CategoryId { get; set; }
        public string DonorId { get; set; }
        public string? WinnerId { get; set; }
        public bool IsDrown { get; set; } = false;

    }

}

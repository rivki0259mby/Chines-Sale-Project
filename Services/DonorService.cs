using server.DTOs;
using server.Interfaces;
using server.Models;

namespace server.Services
{
    public class DonorService:IDonorService
    {
        private readonly IDonorRepository _donorRepository;
        public DonorService(IDonorRepository donorRepository)
        {
            _donorRepository = donorRepository;
        }
        public async Task<DonorResponseDto> AddDonor(DonorCreateDto donorDto)
        {
            var donor = new Donor
            {
                
                Name = donorDto.Name,
                PhoneNumber = donorDto.PhoneNumber,
                Email = donorDto.Email,
                LogoUrl = donorDto.LogoUrl

            };
            var createdDonor = await _donorRepository.AddDonor(donor);
            return MapToResponeseDto(createdDonor);
        }

        public async Task<bool> DeleteDonor(string id)
        {
            return await _donorRepository.DeleteDonor(id);
        }

        public async Task<IEnumerable<DonorResponseDto>> GetAll()
        {
            var donors = await _donorRepository.GetAll();
            return donors.Select(MapToResponeseDto);
        }

        public async Task<DonorResponseDto> GetById(string id)
        {
            var donor = await _donorRepository.GetById(id);
            return donor != null ? MapToResponeseDto(donor) : null;
        }
        public async Task<DonorResponseDto> UpdateDonor(string donorId, DonorUpdateDto donorDto)
        {
            var existingDonor = await _donorRepository.GetById(donorId);
            if (existingDonor == null)
                return null;
            existingDonor.Name = donorDto.Name;
            existingDonor.PhoneNumber = donorDto.PhoneNumber;
            existingDonor.Email = donorDto.Email;
            existingDonor.LogoUrl = donorDto.LogoUrl;
            var updatedDonor = await _donorRepository.UpdateDonor(existingDonor);
            return MapToResponeseDto(updatedDonor);
        }
        public async Task<IEnumerable<DonorResponseDto>> FilterDonors(string? name, string? email, int? giftId)
        {
            var donors = await _donorRepository.FilterDonors(name, email, giftId);
            return donors.Select(MapToResponeseDto);
        }



        private static DonorResponseDto MapToResponeseDto(Donor donor)
        {
            return new DonorResponseDto
            {
                Id = donor.Id,
                Name = donor.Name,
                PhoneNumber= donor.PhoneNumber,
                Email = donor.Email,
                LogoUrl = donor.LogoUrl
            };
        }
    }
}

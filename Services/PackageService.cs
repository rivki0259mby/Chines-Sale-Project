using server.DTOs;
using server.Interfaces;
using server.Models;

namespace server.Services
{
    public class PackageService:IPackageService
    {
        private readonly IPackageRepository _packageRepository;
        public PackageService(IPackageRepository packageRepository)
        {
            _packageRepository = packageRepository;
        }
        public async Task<PackageResponseDtos> AddPackage(PackageCreateDtos packageDto)
        {
            var package = new Package
            {
                Name = packageDto.Name,
                Description = packageDto.Description,
                Quentity = packageDto.Quentity,
                Price = packageDto.Price,
            };
            var createdPackage = await _packageRepository.AddPackage(package);
            return MapToResponeseDto(createdPackage);
        }

        public async Task<bool> DeletePackage(int id)
        {
            return await _packageRepository.DeletePackage(id);
        }

        public async Task<IEnumerable<PackageResponseDtos>> GetAll()
        {
            var Package = await _packageRepository.GetAll();
            return Package.Select(MapToResponeseDto);
        }

        public async Task<PackageResponseDtos> GetById(int id)
        {
            var package = await _packageRepository.GetById(id);
            return package != null ? MapToResponeseDto(package) : null;
        }
        public async Task<PackageResponseDtos> UpdatePackage(int packageId, PackageUpdateDtos packageDto)
        {
            var existingPackage = await _packageRepository.GetById(packageId);
            if (existingPackage == null)
                return null;
            existingPackage.Name = packageDto.Name;
            existingPackage.Description = packageDto.Description;
            existingPackage.Quentity = packageDto.Quentity;
            existingPackage.Price = packageDto.Price;
            var updatedCategory = await _packageRepository.UpdatePackage(existingPackage);
            return MapToResponeseDto(updatedCategory);
        }

        private static PackageResponseDtos MapToResponeseDto(Package package)
        {
            return new PackageResponseDtos
            {
                Id = package.Id,
                Name = package.Name,
                Description = package.Description,
                Quentity = package.Quentity,
            };

        }
    }
}

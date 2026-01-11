using server.DTOs;
using server.Interfaces;
using server.Models;


namespace StoreApi.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly ITokenService _tokenService;
    private readonly IConfiguration _configuration;
    private readonly ILogger<UserService> _logger;

    public UserService(
        IUserRepository userRepository,
        ITokenService tokenService,
        IConfiguration configuration,
        ILogger<UserService> logger)
    {
        _userRepository = userRepository;
        _tokenService = tokenService;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<IEnumerable<UserResponseDto>> GetAll()
    {
        var users = await _userRepository.GetAll();
        return users.Select(MapToResponseDto);
    }

    public async Task<UserResponseDto?> GetById(string id)
    {
        var user = await _userRepository.GetById(id);
        return user != null ? MapToResponseDto(user) : null;
    }

    public async Task<UserResponseDto> AddUser(UserCreateDto createDto)
    {
        if (await _userRepository.UserNameExists(createDto.UserName))
        {
            throw new ArgumentException($"user {createDto.UserName} is already registered.");
        }
        var user = new User
        {
            Id = createDto.Id,
            FullName = createDto.FullName,
            UserName = createDto.UserName,
            Email = createDto.Email,
            Password = HashPassword(createDto.Password), 
            PhoneNumber = createDto.PhoneNumber
            
        };

        var createdUser = await _userRepository.AddUser(user);
        _logger.LogInformation("User created with ID: {UserId}", createdUser.Id);

        return MapToResponseDto(createdUser);
    }

    public async Task<UserResponseDto?> UpdateUser(string id, UserUpdateDto updateDto)
    {
        var existingUser = await _userRepository.GetById(id);
        if (existingUser == null) return null;

        if (updateDto.UserName != null && updateDto.UserName != existingUser.UserName)
        {
            if (await _userRepository.UserNameExists(updateDto.UserName))
            {
                throw new ArgumentException($"user {updateDto.UserName} is already registered.");
            }
            existingUser.UserName = updateDto.UserName;
        }

        if (updateDto.FullName != null) existingUser.FullName = updateDto.FullName;
        if (updateDto.Email != null) existingUser.Email = updateDto.Email;
        if (updateDto.PhoneNumber != null) existingUser.PhoneNumber = updateDto.PhoneNumber;

        var updatedUser = await _userRepository.UpdateUser(existingUser);
        return updatedUser != null ? MapToResponseDto(updatedUser) : null;
    }

    public async Task<bool> DeleteUser(string id)
    {
        return await _userRepository.DeleteUser(id);
    }

    public async Task<LoginResponseDto?> Authenticate(string userName, string password)
    {
        var user = await _userRepository.GetByUserName(userName);

        if (user == null)
        {
            _logger.LogWarning("Login attempt failed: User not found for userName {UserName}", userName);
            return null;
        }

        var hashedPassword = HashPassword(password);
        if (user.Password != hashedPassword)
        {
            _logger.LogWarning("Login attempt failed: Invalid password for userName {UserName}", userName);
            return null;
        }

        var token = _tokenService.GenerateToken(user.Id, user.Email, user.UserName);
        var expiryMinutes = _configuration.GetValue<int>("JwtSettings:ExpiryMinutes", 60);

        _logger.LogInformation("User {UserId} authenticated successfully", user.Id);

        return new LoginResponseDto
        {
            Token = token,
            TokenType = "Bearer",
            ExpiresIn = expiryMinutes * 60, 
            User = MapToResponseDto(user)
        };
    }

    private static UserResponseDto MapToResponseDto(User user)
    {
        return new UserResponseDto
        {
            Id = user.Id,
            FullName = user.UserName,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            
        };
    }

    private static string HashPassword(string password)
    {
        return Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(password));
    }
}

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using UProgress.Contracts.Models;
using UProgress.Service.Repositories;
using Task = System.Threading.Tasks.Task;

namespace UProgress.Service.Services;

public class UserService
{
    private readonly UserManager<IdentityUser<Guid>> _userManager;
    private readonly UserRepository _userRepository;
    private readonly UnitOfWork _unitOfWork;

    public UserService(UserManager<IdentityUser<Guid>> userManager, UserRepository userRepository,
        UnitOfWork unitOfWork)
    {
        _userManager = userManager;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<IdentityUser<Guid>?> GetUserByHttpContext(HttpContext httpContext)
    {
        var claimsPrincipal = httpContext.User;
        var user = await _userManager.GetUserAsync(claimsPrincipal);

        return user;
    }

    public async Task<Guid> CreateAppUser(string fullName, UserType userType)
    {
        var user = new User
        {
            FullName = fullName,
            Role = userType,
            IsActive = true
        };

        _userRepository.Insert(user);
        await _unitOfWork.SaveAsync();

        return user.Id;
    }

    public async Task RemoveUser(Guid id)
    {
        _userRepository.Delete(id);
        await _unitOfWork.SaveAsync();
    }

    public async Task<bool> DeactivateUser(Guid id)
    {
        var user = _userRepository.GetById(id);
        if (user == null)
        {
            return false;
        }

        user.IsActive = false;
        _userRepository.Update(user);
        await _unitOfWork.SaveAsync();

        return true;
    }

    public async Task<bool> ActivateUser(Guid id)
    {
        var user = _userRepository.GetById(id);
        if (user == null)
        {
            return false;
        }

        user.IsActive = true;
        _userRepository.Update(user);
        await _unitOfWork.SaveAsync();

        return true;
    }

    public async Task<bool> IsActiveUser(Guid id)
    {
        var user = _userRepository.GetById(id);

        return user is {IsActive: true};
    }
}
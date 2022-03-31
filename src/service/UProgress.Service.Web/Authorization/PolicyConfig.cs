using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using UProgress.Contracts.Models;

namespace UProgress.Service.Web.Authorization;

public static class PolicyConfig
{
    public static void SetPolicies(AuthorizationOptions options)
    {
        AuthClaims.Values.ForEach(claim =>
        {
            options.AddPolicy(claim,
                policy => policy.RequireClaim(AuthClaimType.Policy, claim));
        });
    }
}
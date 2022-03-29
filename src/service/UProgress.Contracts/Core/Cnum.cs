using System.Reflection;

namespace UProgress.Contracts.Core;

public abstract class Cnum<T>
{
    static Cnum()
    {
        Values = typeof(T).GetFields(BindingFlags.Static | BindingFlags.Public)
            .Select(prop => prop.Name).ToList();
    }

    public static List<string> Values { get; private set; }
}
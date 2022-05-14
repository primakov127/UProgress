namespace UProgress.Service.Interfaces;

public interface IRepository<TEntity> where TEntity : class
{
    public Task<TEntity?> GetById(object id);
    public IQueryable<TEntity> Get();
    public void Insert(TEntity entity);
    public void Update(TEntity entity);
    public void Delete(TEntity entity);
    public void Delete(object id);
}
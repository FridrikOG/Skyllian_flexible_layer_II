namespace cbdc_service.Utilities.Result
{
    public interface IDataResult<T> : IResult
    {
        T Data { get; }
    }
}

using System.Threading.Tasks;

namespace cbdc_service.Services.Interfaces
{
    public interface ITransactionService
    {
        Task CreateTransaction(string sender, string receiver, string ticker, double amount);
        Task<dynamic> CreateFaucet(string sender, string receiver, string ticker, double amount);
        Task<double> GetBalance(string ticker, string publicKey);
    }
}
using System.Collections.Generic;
using System.Threading.Tasks;
using cbdc_service.Models.Dto;
using Newtonsoft.Json.Linq;

namespace cbdc_service.Services.Interfaces
{
    public interface ICurrencyService
    {
        Task<CurrencyDto> CreateCurrency(string name, string ticker, string publicKey, string prevTicker);
        Task<CurrencyDto> GetCurrency(string ticker);
        void PatchCurrency(string name, string ticker);

        // Get Blocks
        Task<List<JObject>> GetBlocks();
        
    }
}
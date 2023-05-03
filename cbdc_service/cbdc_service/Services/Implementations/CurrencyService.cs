// Services
using cbdc_service.Services.Interfaces;
using cbdc_service.Services.Helpers;

// Models
using cbdc_service.Models.Dto;

// Third party libraries
using Newtonsoft.Json.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System;

namespace cbdc_service.Services.Implementations
{
    public class CurrencyService : ICurrencyService
    { 
        private const string url = "http://176.58.116.107:80/blocks";

        async public Task<List<JObject>> GetBlocks()
        {
            return await BlockExtensions.GetBlocks();
        }


        async public Task<CurrencyDto> CreateCurrency(string name, string ticker, string publicKey, string prevTicker)
        {
            // 1. Check if currency exists - send GET req to Annall and look for type="cbdc" where ticker is equal to given ticker.
            // 2. Ticker not found - Instantiate Blockheader entity & Currency entity.
            // 3. Wrap in body to send POST req to Annall.
            // 4. 
            Console.WriteLine("Line 26  " );
            string tickerUpper = ticker.ToUpper();
            string publicAddress = CryptoGraphy.GetPublicAddress();
            
            Console.WriteLine("Crypto address ");
            Console.WriteLine(publicAddress);
            CurrencyDto currency = new CurrencyDto(name=name, ticker=tickerUpper, publicKey= publicKey, publicAddress=publicAddress, prevTicker=prevTicker);

            // Get all blocks
            List<JObject> blocks = await BlockExtensions.GetBlocks();

            // Check if any blocks with specific ticker cbdc already exists
            CbdcExtensions.CheckIfTickerAlreadyExists(blocks, ticker);

            // Creates cbdcblock json object
            dynamic payload = BlockExtensions.CreateCbdcBlock(name=name, ticker=tickerUpper, publicKey=publicKey, publicAddress=publicAddress, prevTicker=prevTicker);

            // Posts block
            await BlockExtensions.PostBlock(payload);

            Console.WriteLine("Posted block to Annall");

            return currency;
        }
        async public Task<CurrencyDto> GetCurrency(string ticker)
        {

            // Get all blocks
            List<JObject> blocks = await BlockExtensions.GetBlocks();

            // Check if any blocks with specific ticker cbdc already exists
            List<JObject> cbdcBlocks = CbdcExtensions.CheckIfTickerDoesNotExist(blocks, ticker);

            // Fetch the one and only element in the list
            var cbdcBlock = cbdcBlocks[0];

            foreach (JObject b in cbdcBlocks)
            {
                Console.WriteLine(b);
            }




            string name = cbdcBlock?["payload"]?["payload"]?["name"]?.ToString();
            string actualTicker = cbdcBlock?["payload"]?["payload"]?["ticker"]?.ToString();
            string publicAddress = cbdcBlock?["payload"]?["payload"]?["publicAddress"]?.ToString();
            string publicKey = cbdcBlock?["payload"]?["headers"]?["publicKey"]?.ToString();
            string prevTicker = cbdcBlock?["payload"]?["headers"]?["prevTicker"]?.ToString();


            CurrencyDto currency = new CurrencyDto(name=name, ticker=actualTicker, publicKey=publicKey, publicAddress=publicAddress, prevTicker=prevTicker);
            return currency;
        }

        public string Test()
        {
            return "This text came from text func";
        }

     async public void PatchCurrency(string name, string ticker)
        {
          return;
        }

   
    }
}


using Microsoft.AspNetCore.Mvc;

using cbdc_service.Models.Dto;
using cbdc_service.Models.InputModels;

using cbdc_service.Services.Interfaces;
using System.Threading.Tasks;
using System;

namespace cbdc_service.Controllers 
{ 
    [Route("api/cbdc")]
    [ApiController]
    public class CbdcController : ControllerBase
    {
        // ========================== CBD Properties & Initializer ==========================


        private readonly ITransactionService _transactionService;
        private readonly ICurrencyService _currencyService;

        public CbdcController(ICurrencyService currencyService, ITransactionService transactionService)
        {
            _currencyService = currencyService;
            _transactionService = transactionService;
        }

        // ========================== GET BLOCK ==========================
        [HttpGet]
        [Route("")]
        public async Task<IActionResult> GetBlocks() {
            try {
                return Ok(await _currencyService.GetBlocks());
            } 
            catch (Exception ex) {
                return BadRequest(ex.Message);
            }
        }

 
        // ========================== CBDC Routes ==========================
        [HttpPost]
        [Route("currency")]
        public async Task<IActionResult> CreateCurrency([FromBody] CurrencyInputModel currencyInputModel) {

            string name = currencyInputModel.Name;
            string ticker = currencyInputModel.Ticker;
            string publicKey = currencyInputModel.PublicKey;
            string prevTicker = currencyInputModel.PrevTicker;


            try {
                CurrencyDto currencyDto = await _currencyService.CreateCurrency(name=name, ticker=ticker, publicKey=publicKey, prevTicker=prevTicker);
                Console.WriteLine("After async");
                return Ok(currencyDto);
            } 
            catch (Exception ex) {
                return BadRequest(ex.Message);
            }
        }
        
        [HttpGet]
        [Route("currency")]
        public async Task<IActionResult> GetCurrency([FromBody] CurrencyInputModel currencyInputModel)
        {
    
            string ticker = currencyInputModel.Ticker;
            
            Console.WriteLine("Before async");
            CurrencyDto currencyDto = await _currencyService.GetCurrency(ticker);
                
            try {
                
                Console.WriteLine("After async");
                return Ok(currencyDto);
            } 
            catch (Exception ex) {
                Console.WriteLine("Failure");
                return BadRequest(ex.Message);
            }
        }
        [HttpPatch]
        [Route("currency")]
        public async Task<IActionResult> PatchCurrency([FromBody] CurrencyInputModel currencyInputModel)
        {
                // Delete currency from Annall
                string ticker = currencyInputModel.Ticker;

                Console.WriteLine("Before async");
                CurrencyDto currencyDto = await _currencyService.GetCurrency(ticker);
                    
                try {
                    
                    Console.WriteLine("After async");
                    return Ok(currencyDto);
                } 
                catch (Exception ex) {
                    Console.WriteLine("Failure");
                    return BadRequest(ex.Message);
                }
        }


    }
}

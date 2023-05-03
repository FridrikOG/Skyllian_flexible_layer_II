using Microsoft.AspNetCore.Mvc;

using cbdc_service.Models.Dto;
using cbdc_service.Models.InputModels;

using cbdc_service.Services.Interfaces;
using System.Threading.Tasks;
using System;

namespace cbdc_service.Controllers 
{ 
    [Route("api/transaction")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        // ========================== CBD Properties & Initializer ==========================


        private readonly ITransactionService _transactionService;
        private readonly ICurrencyService _currencyService;

        public TransactionController(ICurrencyService currencyService, ITransactionService transactionService)
        {
            _currencyService = currencyService;
            _transactionService = transactionService;
        }

 
        // ========================== CBDC Routes ==========================
        [HttpPost]
        [Route("")]
        public async Task<IActionResult> CreateTransaction([FromBody] TransactionInputModel transactionInputModel)
        {
                
            string sender = transactionInputModel.Sender;
            string receiver = transactionInputModel.Receiver;
            string ticker = transactionInputModel.Ticker;
            double amount = transactionInputModel.Amount;

            Console.WriteLine("=== CreateTransaction ===");
            Console.WriteLine(sender + ", " + receiver + ", " + ticker + ", " + amount);

            try
            {
                await _transactionService.CreateTransaction(sender, receiver, ticker, amount);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Route("faucet")]
        public async Task<IActionResult> CreateFaucet([FromBody] TransactionInputModel transactionInputModel)
        {
                
            string sender = transactionInputModel.Sender;
            string receiver = transactionInputModel.Receiver;
            string ticker = transactionInputModel.Ticker;
            double amount = transactionInputModel.Amount;

            Console.WriteLine("=== CreateTransaction ===");
            Console.WriteLine(sender + ", " + receiver + ", " + ticker + ", " + amount);
            
            try
            {
                await _transactionService.CreateFaucet(sender, receiver, ticker, amount);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet]
        [Route("balance")]
        public async Task<IActionResult> Balance(string ticker, string publicKey)
        {
            try
            {
                double balance = await _transactionService.GetBalance(ticker.ToUpper(), publicKey);
                return Ok(balance);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }


        }
    }
}   
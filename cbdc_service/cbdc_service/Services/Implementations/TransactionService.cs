using cbdc_service.Services.Interfaces;
using cbdc_service.Services.Helpers;

// This is needed else it uses the in-built JObject
using Newtonsoft.Json.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System;

namespace cbdc_service.Services.Implementations
{
    public class TransactionService : ITransactionService 
    {
        async public Task CreateTransaction(string sender, string receiver, string ticker, double amount)
        {
            // TODO: Create transaction with a specific currency

            // 1. Find all instances of ticker=ticker
            // 2. 
            // 3. 

            Console.WriteLine("CreateTransactionService");
            Console.WriteLine(sender + ", " + receiver + ", " + ticker + ", " + amount);


            // ==================================== Get Blocks ====================================
            
            // All blocks
            List<JObject> blocks = await BlockExtensions.GetBlocks();


            // ==================================== Check if ticker exists ====================================
            // Watchout that the cbdc ticker exists in order to create a transaction - fires exception if ticker does not exist
            List<JObject> cbdcBlocks = CbdcExtensions.CheckIfTickerDoesNotExist(blocks, ticker);


            // ====================================  ====================================
            // 
            double newBalance = TransactionExtensions.CheckIfPublicKeyHasSufficientFunds(cbdcBlocks, ticker, sender, amount);

            dynamic transactionBlock = BlockExtensions.CreateTransactionBlock(sender, receiver, amount, ticker);

            await BlockExtensions.PostBlock(transactionBlock);

        }

        async public Task<dynamic> CreateFaucet(string sender, string receiver, string ticker, double amount)
        {
            //  Input {
            //  "sender".  // This is the creator of currency (in our case central bank). They can only keep allocating as long as the entire supply has not been allocated.
            // "receiver" // this is the public key of the person receiving
            // "amount" // this is the amount to be deducted from sender (CB) and added to receiver.
            // }
        

            // ==================== Example of a transaction ====================
            // {
            //   "payload": {
            //     "headers": {
            //       "type": "transaction",
            //       "public_key": "02a3293e85a7fbde059e221ace4edc6743a3ba5a2758cb3001acf6d81750089dcb",
            //       "nonce": 1,
            //       "signature": "_signature",
            //       "_hash": "_hash"
            //     },
            //     "payload": {
            //       "receiver": "039754c3ffabcff3859dc61157fc5e90ef8d66ad7454bd0d124abc5f46438ca1f7",
            //       "amount": "100"
            //     }
            //   }
            // }

            // Get all blocks
            List<JObject> blocks = await BlockExtensions.GetBlocks();

            // Check if ticker exists - and retrieve blocks with type="cbdc"
            List<JObject> cbdcBlocks = CbdcExtensions.CheckIfTickerDoesNotExist(blocks, ticker);

            // Check if the publickey/sender is the owner of the corresponding cbdc 
            CbdcExtensions.CheckIfPublicKeyIsOwnerOfCbdc(cbdcBlocks, sender);

            // We don't check if the CBDC actual has sufficient funds since it's a cbdc
            dynamic block = BlockExtensions.CreateTransactionBlock(sender, receiver, amount, ticker);

            Console.WriteLine(block);

            // Post block to Annall
            await BlockExtensions.PostBlock(block);

            return block;
        }

        async public Task<double> GetBalance(string ticker, string publicKey)
        {
            Console.WriteLine(ticker + " , " + publicKey);
            List<JObject> blocks = await BlockExtensions.GetBlocks();
            
            // Check if ticker exists - and retrieve blocks with type="cbdc"
            CbdcExtensions.CheckIfTickerDoesNotExist(blocks, ticker);
            
            List<JObject> transactionBlocks = TransactionExtensions.FilterOutByTransactions(blocks);

            double balance = TransactionExtensions.GetBalanceInTickerForPublickey(transactionBlocks, ticker, publicKey);

            return balance;

        }

    }
}
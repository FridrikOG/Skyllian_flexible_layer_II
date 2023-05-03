using System.Net;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;


namespace cbdc_service.Services.Helpers
{
    public static class TransactionExtensions
    {

        private const string AnnallURL = "http://176.58.116.107:80/blocks";

        public static double CheckIfPublicKeyHasSufficientFunds(List<JObject> blocks, string ticker, string sender, double amount)
        {
            // Check if pubkey has sufficient funds
            // 1. Accumulate balance - get balance
            // 2. Match balance against amount requesting to be sent
            // 3. 

            Console.WriteLine();
            Console.WriteLine(ticker);
            Console.WriteLine(sender);
            Console.WriteLine(amount);

            double balance = GetBalanceInTickerForPublickey(blocks, ticker, sender);
            Console.WriteLine();
            Console.WriteLine(balance);
            Console.WriteLine(amount);
            double newBalance = balance - amount;
            
            if (newBalance < 0)
            {
                throw new Exception("Insufficient funds: Publickey has " + newBalance + " ");
            }

            return newBalance;
        }

        public static double GetBalanceInTickerForPublickey(List<JObject> transactionBlocks, string ticker, string publicKey)
        {
            
            List<JObject> transactionBlocksByTicker =  FilterOutTransactionsByTicker(transactionBlocks, ticker);
            
            List<JObject> transactionsSent = transactionBlocksByTicker.Where(obj => (string)(obj?["payload"]?["headers"]?["publicKey"] ?? "") == publicKey).ToList();
            List<JObject> transactionsReceived = transactionBlocksByTicker.Where(obj => (string)(obj?["payload"]?["payload"]?["receiver"] ?? "") == publicKey).ToList();

            Console.WriteLine(transactionsSent.Count());
            Console.WriteLine(transactionsReceived.Count());

            double moneySent = transactionsSent.Sum(obj => (double)obj?["payload"]?["payload"]?["amount"]);
            double moneyReceived = transactionsReceived.Sum(obj => (double)obj?["payload"]?["payload"]?["amount"]);

            Console.WriteLine(moneySent);
            Console.WriteLine(moneyReceived);

            return moneyReceived - moneySent;
        }

        public static List<JObject> FilterOutTransactionsByTicker(List<JObject> transactionBlocks, string ticker)
        {
            List<JObject> transactionBlocksByTicker = transactionBlocks.Where(obj => (string)(obj?["payload"]?["payload"]?["ticker"] ?? "") == ticker).ToList();

            return transactionBlocksByTicker;
            
        }

        public static List<JObject> FilterOutByTransactions(List<JObject> blocks)
        {
            // TODO: Change the hardcoded "cbdc" to something else.
            // Filter out all non cbdc type blocks
            List<JObject> transactionBlocks = blocks.Where(obj => (string)(obj?["payload"]?["headers"]?["type"] ?? "") == "transaction").ToList();

            return transactionBlocks;
        }
    }
}
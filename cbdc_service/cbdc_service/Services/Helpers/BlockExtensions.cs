using System;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;


namespace cbdc_service.Services.Helpers
{
    public static class BlockExtensions
    {
        public static dynamic CreateCbdcBlock(string name, string ticker, string publicKey, string publicAddress, string prevTicker)
        {
            var b = new 
            {
                payload = new 
                {
                    headers = new 
                    {
                        // TODO: Either this is the first=null or not-first=prev_hash or
                        prevHash = "",
                        type = "cbdc",
                        publicKey = publicKey,
                        prevTicker = prevTicker
                    },
                    payload = new
                    {
                        name = name,
                        ticker = ticker,
                        publicAddress = publicAddress
                    }
                }
            };

        return b;
        }

        public static dynamic CreateTransactionBlock(string publicKey, string receiver, double amount, string ticker)
        {
            var b = new 
            {
                payload = new 
                {
                    headers = new 
                    {
                        type = "transaction",
                        
                        publicKey = publicKey,

                        nonce = 404,
                        signature = "signature",
                        _hash = "_hash"
                    },
                    payload = new
                    {
                        // transaction variables
                        receiver = receiver,
                        amount = amount,
                        // CBDC
                        ticker = ticker.ToUpper()
                    }
                }
            };

            return b;
        }

        async public static Task PostBlock(dynamic block)
        {
            var b = new 
            {
                payload = new 
                {
                    headers = new 
                    {
                        type = "cbdc",
                        publicKey = "publicKey",
                        prevTicker = "prevTicker"
                    },
                    payload = new
                    {
                        name = "name",
                        ticker = "ticker",
                        publicAddress = "publicAddress"
                    }
                }
            };
            Console.WriteLine(block);
            using (HttpClient client = new HttpClient())
            {
                var content = new StringContent(JsonConvert.SerializeObject(block), Encoding.UTF8, "application/json");
                HttpResponseMessage res = await client.PostAsync(CbdcExtensions.AnnallURL, content);

                if (res.StatusCode != HttpStatusCode.OK)
                {
                    throw new Exception($"Status code {res.StatusCode} from {CbdcExtensions.AnnallURL}| Message: {await res.Content.ReadAsStringAsync()} | Block: {block} | Block Type: {block.GetType()} | Message: {content.GetType()}");
                }
                
                Console.WriteLine($"Status code: {res.StatusCode}");
                Console.WriteLine($"Annall URL: {CbdcExtensions.AnnallURL}");


            }
        }

        async public static Task<List<JObject>> GetBlocks()
        {
            List<JObject> blocks = null;

            using (HttpClient client = new HttpClient())
            {
                HttpResponseMessage res = await client.GetAsync(CbdcExtensions.AnnallURL);
                blocks = await HttpResponseMessageExtensions.DeserializeJsonToList(res, false);
 
                return blocks;
            }
        }

        public static void DisplayInConsole(List<JObject> blocks)
        {
            // Simply prints out each block in the list of blocks
            foreach (var block in blocks)
            {
                System.Console.WriteLine(block);
            }
        }
    }
}
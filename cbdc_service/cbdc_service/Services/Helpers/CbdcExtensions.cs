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
    public static class CbdcExtensions
    {
        public const string AnnallURL = "http://176.58.116.107:80/blocks";
        public static List<JObject> FilterOutByCbdc(List<JObject> blocks, string ticker)
        {
            // TODO: Change the hardcoded "cbdc" to something else.
            // Filter out all non cbdc type blocks
            List<JObject> cbdcBlocks = blocks.Where(obj => (string)(obj?["payload"]?["headers"]?["type"] ?? "") == "cbdc").ToList();
            return cbdcBlocks;
        }

        public static List<JObject> FilterOutByCbdcTicker(List<JObject> cbdcBlocks, string ticker)
        {
            // Filter out all non cbdc type blocks with ticker=ticker
            List<JObject> cbdcBlocksOfSameTicker = cbdcBlocks.Where(obj => (string)(obj?["payload"]?["payload"]?["ticker"] ??  "") == ticker.ToUpper()).ToList();
            return cbdcBlocksOfSameTicker;
        }

        public static List<JObject> CheckIfTickerAlreadyExists(List<JObject> blocks, string ticker)
        {
            // =============== Used when creating a new ticker if it already exists ===============
            List<JObject> cbdcBlocks = CbdcExtensions.FilterOutByCbdc(blocks, ticker);
            List<JObject> cbdcBlocksOfSameTicker = CbdcExtensions.FilterOutByCbdcTicker(cbdcBlocks, ticker);

            // If ticker is found - throw exception
            if (cbdcBlocksOfSameTicker.Count() > 0)
            {
                throw new Exception("CBDC of the following ticker already exists!");
            }
            return cbdcBlocksOfSameTicker;
        }

        public static List<JObject> CheckIfTickerDoesNotExist(List<JObject> blocks, string ticker)
        {
            // =============== Used when using ticker for different operations - create transactions etc. ===============
            List<JObject> cbdcBlocks = CbdcExtensions.FilterOutByCbdc(blocks, ticker);
            List<JObject> cbdcBlocksOfSameTicker = CbdcExtensions.FilterOutByCbdcTicker(cbdcBlocks, ticker);

            // If ticker is found - throw exception
            if (cbdcBlocksOfSameTicker.Count() != 1)
            {
                throw new Exception("CBDC of the following ticker does not exist!");
            }

            return cbdcBlocksOfSameTicker;
        }

        public static void CheckIfPublicKeyIsOwnerOfCbdc(List<JObject> cbdcBlocks, string publicKey)
        {
            // Check if sender corresponds to the creator of the cbdc we allow - else we throw exception
            
            List<JObject> filteredByPublicKeyBlocks = cbdcBlocks.Where(obj => (string)(obj?["payload"]?["headers"]?["publicKey"] ?? "") == publicKey).ToList();

            // The only success case we are interested in
            if (filteredByPublicKeyBlocks.Count() == 1)
            {
                return;
            }
            
            throw new Exception("PublicKey is not the owner of the following cbdc");
        }

    }
}
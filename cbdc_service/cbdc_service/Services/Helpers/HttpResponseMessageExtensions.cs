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
    public static class HttpResponseMessageExtensions
    {
        public static async Task<Object> DeserializeJsonToObject(this HttpResponseMessage response, bool flatten = false)
        {
            var json = await response.Content.ReadAsStringAsync();
            Console.WriteLine("=== Fetchin from Annall ===");
            Console.WriteLine(json);
            Console.WriteLine(json.GetType());
            var jsonObject = JObject.Parse(json);
            // var data = jsonObject["data"];
            // if (flatten)
            // {
            //     data = FlattenJsonObject(data);
            // }
            return jsonObject;
            // return data;
            // return JsonConvert.DeserializeObject<T>(data.ToString());
        }

        public static async Task<List<JObject>> DeserializeJsonToList(this HttpResponseMessage response, bool flatten = false)
        {
            string data = await response.Content.ReadAsStringAsync();
            List<JObject> retData = JsonConvert.DeserializeObject<List<JObject>>(data);
            // var data = JObject.Parse(array);
            // if (flatten)
            // {
            //     data = FlattenJsonArray(data);
            // }
            return retData;
            // return JsonConvert.DeserializeObject<IEnumerable<T>>(data.ToString());
        }
        // private static JToken FlattenJsonObject(JToken jsonToken)
        // {
        //     var newJsonObject = new JObject();
        //     foreach (var token in jsonToken.OfType<JProperty>())
        //     {
        //         token
        //             .Descendants()
        //             .Where(p => !p.Any())
        //             .ToList()
        //             .ForEach(j =>
        //             {
        //                 newJsonObject.Add(j.Parent);
        //             });
        //     }

        //     return newJsonObject;
        // }

        private static JToken FlattenJsonArray(JToken jsonToken)
        {
            var newJsonArray = new JArray();

            foreach (var token in jsonToken.OfType<JObject>())
            {
                var jObject = new JObject();

                token
                    .Descendants()
                    .Where(p => !p.Any())
                    .ToList()
                    .ForEach(j =>
                    {
                        jObject.Add(j.Parent);
                    });

                newJsonArray.Add(jObject);
            }

            return newJsonArray;
        }
    }
}
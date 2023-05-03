using System.Net;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using Nethereum.Util;
using Nethereum.Signer.Crypto;
using Nethereum.Hex.HexConvertors.Extensions;
using Nethereum.RLP;

namespace cbdc_service.Services.Helpers
{
    public static class CryptoGraphy
    {
    public static byte[] _publicKeyNoPrefix;
    public static byte[] _publicKeyNoPrefixCompressed;
    public static byte[] empty;

    static Random rd = new Random();

public static string GetPublicAddress()

{
    int stringLength = 42;
    const string allowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789!@$?_-";
    char[] chars = new char[stringLength];

    for (int i = 0; i < stringLength; i++)
    {
        chars[i] = allowedChars[rd.Next(0, allowedChars.Length)];
    }

    return new string(chars);
}
    }
} 

// public static string GetPublicAddress()
// {
//             var initaddr = new Sha3Keccack().CalculateHash(GetPubKeyNoPrefix());
//             var addr = new byte[initaddr.Length - 12];
//             Array.Copy(initaddr, 12, addr, 0, initaddr.Length - 12);
//             Console.WriteLine("Inside GetPublicAddress");
//             dynamic var = new AddressUtil().ConvertToChecksumAddress(addr.ToHex());
//             return var; 
// }
//  public static byte[] GetPubKeyNoPrefix()
//         { 
//             ECKey ecKey = new ECKey(_publicKeyNoPrefix, true);
//             if (_publicKeyNoPrefix == null)
//             {   
//                 var pubKey = ecKey.GetPubKey(false);
//                 var arr = new byte[pubKey.Length - 1];
//                 Array.Copy(pubKey, 1, arr, 0, arr.Length);
//                 _publicKeyNoPrefix = arr;
//             }
//             return _publicKeyNoPrefix;            
//         }
// }

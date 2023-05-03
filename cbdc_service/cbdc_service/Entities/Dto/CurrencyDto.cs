namespace cbdc_service.Models.Dto
{
	public class CurrencyDto
	{
		public CurrencyDto(string name, string ticker, string publicKey, string publicAddress, string prevTicker)
		{
			Name = name;
			Ticker = ticker;
			PublicKey = publicKey;
			PublicAddress = publicAddress;
			PrevTicker = prevTicker;
		}
		public string Name { get; init; }
		public string Ticker { get; init; }
		public string PublicKey { get; init; }
		public string PublicAddress { get; init; }
		public string PrevTicker { get; init; }
	}
	
}


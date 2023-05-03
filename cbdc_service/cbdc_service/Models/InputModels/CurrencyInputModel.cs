using System.ComponentModel.DataAnnotations;

namespace cbdc_service.Models.InputModels
{
    public class CurrencyInputModel
    {
        
        [Required(ErrorMessage = "Name was not given!")]    
        public string Name { get; init; }
        [Required(ErrorMessage = "Supply was not given!")]
		public string Ticker { get; init; }

        [Required(ErrorMessage = "Public Key was not given!")]
		public string PublicKey { get; init; }
        [Required(ErrorMessage = "Prev Ticker was not given!")]
        public string PrevTicker { get; init; }



    }
}
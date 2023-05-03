using System.ComponentModel.DataAnnotations;

namespace cbdc_service.Models.InputModels
{
    public class TransactionInputModel
    {
        
        [Required(ErrorMessage = "Sender was not given!")]    
        public string Sender { get; init; }

        [Required(ErrorMessage = "Receiver was not given!")]
        public string Receiver { get; set; }

        [Required(ErrorMessage = "Ticker was not given!")]
		public string Ticker { get; init; }

        [Required(ErrorMessage = "Amount was not given!")]
		public double Amount { get; init; }

    }
}
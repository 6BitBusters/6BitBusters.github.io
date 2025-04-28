export interface CurrencyData {
  rates: {
    // Chiave dinamica per le valute
    [currencyCode: string]: number;
  };
}

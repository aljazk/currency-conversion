export interface ExchangeRates {
  [key: string]: number; // Allows any string as the key (currency code)
}

export interface OpenExchangeRatesResponse {
  disclaimer: string;
  license: string;
  timestamp: number;
  base: string;
  rates: ExchangeRates;
}

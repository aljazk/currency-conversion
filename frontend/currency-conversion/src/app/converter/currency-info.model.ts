export interface CurrencyInfoDTO {
  [key: string]: string; // Allows any string as the key (currency code)
}
export interface CurrencyInfo {
  key: string;
  value: string;
}

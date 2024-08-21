import { CurrencyInfo } from './currency-info.model';

export interface IConversionRepository {
  getConversionRate(fromCurrency: string, toCurrency: string): Promise<number>;
  getSupportedCurrencies(): Promise<CurrencyInfo>;
}

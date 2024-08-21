import { IConversionRepository } from '../conversion-repository.interface';
import { CurrencyInfo } from '../currency-info.model';
import { CurrencyValidatonError } from '../currency-validaton.error';
import { demoConversionRates, supportedCurrencies } from './demo-rates.data';

export class DemoConversionRepository implements IConversionRepository {
  async getConversionRate(
    fromCurrency: string,
    toCurrency: string
  ): Promise<number> {
    const fromCurrencyRate = (demoConversionRates.rates as any)[fromCurrency];
    if (!fromCurrencyRate) {
      throw new CurrencyValidatonError(fromCurrency);
    }
    const toCurrencyRate = (demoConversionRates.rates as any)[toCurrency];
    if (!toCurrencyRate) {
      throw new CurrencyValidatonError(toCurrency);
    }
    return Promise.resolve(toCurrencyRate / fromCurrencyRate);
  }

  getSupportedCurrencies(): Promise<CurrencyInfo> {
    return Promise.resolve(supportedCurrencies);
  }
}

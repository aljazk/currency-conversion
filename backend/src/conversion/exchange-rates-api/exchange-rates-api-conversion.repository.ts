import { IConversionRepository } from '../conversion-repository.interface';
import { CurrencyInfo } from '../currency-info.model';
import { OpenExchangeRatesResponse } from './exchange-rates-api.model';

export class ExchangeRatesAPIConversionRepository
  implements IConversionRepository
{
  async getConversionRate(
    fromCurrency: string,
    toCurrency: string
  ): Promise<number> {
    const response = await fetch(
      'https://openexchangerates.org/api/latest.json?app_id=714755b0bb17481499f53a0297606ebb'
    );
    const conversionRates =
      (await response.json()) as OpenExchangeRatesResponse;
    const fromCurrencyRate = conversionRates.rates[fromCurrency];
    if (!fromCurrencyRate) {
      throw new Error(`Cannot find currency rate for ${fromCurrency}`);
    }
    const toCurrencyRate = conversionRates.rates[toCurrency];
    if (!toCurrencyRate) {
      throw new Error(`Cannot find currency rate for ${toCurrency}`);
    }
    return toCurrencyRate / fromCurrencyRate;
  }

  async getSupportedCurrencies(): Promise<CurrencyInfo> {
    return (
      await fetch('https://openexchangerates.org/api/currencies.json')
    ).json();
  }
}

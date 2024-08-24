import { IConversionRepository } from '../conversion-repository.interface';
import { CurrencyInfo } from '../currency-info.model';
import { CurrencyValidatonError } from '../currency-validaton.error';
import { OpenExchangeRatesResponse } from './exchange-rates-api.model';

export class ExchangeRatesAPIConversionRepository
  implements IConversionRepository
{
  async getConversionRate(
    fromCurrency: string,
    toCurrency: string
  ): Promise<number> {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error(
        'Environment variable "API_KEY" is not set. Cannot fetch exchange rates.'
      );
    }
    const response = await fetch(
      'https://openexchangerates.org/api/latest.json?app_id=' + apiKey
    );
    const conversionRates =
      (await response.json()) as OpenExchangeRatesResponse;
    const fromCurrencyRate = conversionRates.rates[fromCurrency];
    if (!fromCurrencyRate) {
      throw new CurrencyValidatonError(fromCurrency);
    }
    const toCurrencyRate = conversionRates.rates[toCurrency];
    if (!toCurrencyRate) {
      throw new CurrencyValidatonError(toCurrency);
    }
    return toCurrencyRate / fromCurrencyRate;
  }

  async getSupportedCurrencies(): Promise<CurrencyInfo> {
    return (
      await fetch('https://openexchangerates.org/api/currencies.json')
    ).json();
  }
}

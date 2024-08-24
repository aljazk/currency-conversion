import { ILogger } from '../logger.interface';
import { IConversionRepository } from './conversion-repository.interface';
import { DemoConversionRepository } from './demo-rates/demo-conversion.repository';
import { ExchangeRatesAPIConversionRepository } from './exchange-rates-api/exchange-rates-api-conversion.repository';

export class ConversionRepositorySelector {
  private conversionRepositories = new Map<string, () => IConversionRepository>(
    [
      ['demo', () => new DemoConversionRepository()],
      ['exchange-rates-api', () => new ExchangeRatesAPIConversionRepository()],
    ]
  );

  constructor(private logger: ILogger) {}

  private validateAndDefaultSource(conversionRatesSource?: string): string {
    conversionRatesSource = conversionRatesSource?.toLowerCase();
    if (!conversionRatesSource) {
      this.logger.log(
        'Environment variable CONVERSION_RATES_SOURCE not defined. Using "demo".'
      );
      conversionRatesSource = 'demo';
    }
    return conversionRatesSource;
  }

  getRepository(conversionRatesSource?: string): IConversionRepository {
    conversionRatesSource = this.validateAndDefaultSource(
      conversionRatesSource
    );
    let conversionRepositoryLoader = this.conversionRepositories.get(
      conversionRatesSource
    );
    if (!conversionRepositoryLoader) {
      this.logger.log(
        `Cannot find repository for CONVERSION_RATES_SOURCE="${conversionRatesSource}". Using "demo" instad.`
      );
      conversionRepositoryLoader = this.conversionRepositories.get('demo')!;
    }
    this.logger.log(
      `Using "${conversionRatesSource}" for conversion rates source`
    );
    return conversionRepositoryLoader();
  }
}

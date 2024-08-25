import { ConversionRepositorySelector } from './conversion-repository-selector';
import { DemoConversionRepository } from './demo-rates/demo-conversion.repository';
import { ExchangeRatesAPIConversionRepository } from './exchange-rates-api/exchange-rates-api-conversion.repository';

describe('ConversionRepositorySelector', () => {
  let conversionRepositorySelector: ConversionRepositorySelector;

  beforeEach(() => {
    conversionRepositorySelector = new ConversionRepositorySelector(console);
  });

  it('Should return demo repositry if demo is requested', async () => {
    expect(conversionRepositorySelector.getRepository('demo')).toBeInstanceOf(
      DemoConversionRepository
    );
  });

  it('Should return exchange-rates-api repositry if exchange-rates-api is requested', async () => {
    expect(
      conversionRepositorySelector.getRepository('exchange-rates-api')
    ).toBeInstanceOf(ExchangeRatesAPIConversionRepository);
  });

  it('Should return demo repositry if nothing is requested', async () => {
    expect(conversionRepositorySelector.getRepository()).toBeInstanceOf(
      DemoConversionRepository
    );
  });

  it('Should return demo repositry if invalid repository is requested', async () => {
    expect(conversionRepositorySelector.getRepository('test')).toBeInstanceOf(
      DemoConversionRepository
    );
  });
});

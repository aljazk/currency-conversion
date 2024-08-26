import { IConversionRepository } from './conversion-repository.interface';
import { ConversionService } from './conversion.service';
import { ConversionsHistoryService } from './history/conversions-history.service';

class ConversionsHistoryServiceMock extends ConversionsHistoryService {
  constructor() {
    super(null as any);

    this.storeConversion = jest
      .fn()
      .mockImplementation(async () => Promise.resolve());
    this.getConversionsHistory = jest.fn();
  }
}

describe('ConversionService', () => {
  let conversionService: ConversionService;
  let conversionRepositoryMock: IConversionRepository;

  let conversionsHistoryServiceMock: ConversionsHistoryService;

  beforeEach(() => {
    conversionsHistoryServiceMock = new ConversionsHistoryServiceMock();
    conversionRepositoryMock = {
      getConversionRate: jest.fn().mockImplementation(() => 1.5),
      getSupportedCurrencies: jest.fn(),
    } as IConversionRepository;
    conversionService = new ConversionService(
      conversionRepositoryMock,
      conversionsHistoryServiceMock,
      console
    );
  });

  it('Should request currency conversion rate', async () => {
    await conversionService.convert({ from: 'EUR', to: 'USD', amount: '12' });
    expect(conversionRepositoryMock.getConversionRate).toHaveBeenCalledWith(
      'EUR',
      'USD'
    );
  });

  it('Should return correct result', async () => {
    const result = await conversionService.convert({
      from: 'EUR',
      to: 'USD',
      amount: '20',
    });
    expect(result).toEqual({
      amount: '20',
      conversionRate: 1.5,
      from: 'EUR',
      result: 30,
      to: 'USD',
    });
  });

  it('Should return correct result for different conversion rate', async () => {
    conversionRepositoryMock.getConversionRate = jest
      .fn()
      .mockImplementation(() => 2);
    const result = await conversionService.convert({
      from: 'FR',
      to: 'DE',
      amount: '7',
    });
    expect(result).toEqual({
      amount: '7',
      conversionRate: 2,
      from: 'FR',
      result: 14,
      to: 'DE',
    });
  });

  it('Should call ConversionsHistoryService.storeConversion with result', async () => {
    await conversionService.convert({ from: 'EUR', to: 'USD', amount: '10' });
    expect(conversionsHistoryServiceMock.storeConversion).toHaveBeenCalledWith({
      amount: '10',
      conversionRate: 1.5,
      from: 'EUR',
      result: 15,
      to: 'USD',
    });
  });
});

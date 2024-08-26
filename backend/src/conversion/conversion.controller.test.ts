import * as classValidator from 'class-validator';
import { IConversionRepository } from './conversion-repository.interface';
import { ConversionRequestDTO } from './conversion-request-DTO';
import { ConversionController } from './conversion.controller';
import { ConversionService } from './conversion.service';
import { CurrencyInfo } from './currency-info.model';
import { ConversionsHistoryService } from './history/conversions-history.service';

class ConversionRepositoryMock implements IConversionRepository {
  // getConversionRate(fromCurrency: string, toCurrency: string): number {
  //   return 1.5;
  // }
  getConversionRate = jest.fn(
    (fromCurrency: string, toCurrency: string): Promise<number> => {
      return Promise.resolve(1.5);
    }
  );
  getSupportedCurrencies(): Promise<CurrencyInfo> {
    return Promise.resolve({ EUR: 'Euro', USD: 'Dollar' });
  }
}

class MockConversionService extends ConversionService {
  constructor() {
    super(null as any, null as any, console);
    this.convert = jest.fn((dto: ConversionRequestDTO) => {
      const conversionRate = 1.5;
      return Promise.resolve(
        Object.assign(
          {
            result: Number(dto.amount) * conversionRate,
            conversionRate: conversionRate,
          },
          dto
        )
      );
    });
  }
}

class ConversionsHistoryServiceMock extends ConversionsHistoryService {
  constructor() {
    super(null as any);
    this.getConversionsHistory = jest.fn().mockResolvedValue([]);
    this.storeConversion = jest.fn();
  }
}

describe('ConversionController', () => {
  let mockConversionService: MockConversionService;
  let mockConversionRepository: ConversionRepositoryMock;
  let mockConversionsHistoryService: ConversionsHistoryService;
  let validateSpy: jest.SpyInstance;
  let convertCurrency: ConversionController;

  beforeEach(() => {
    mockConversionService = new MockConversionService();
    mockConversionsHistoryService = new ConversionsHistoryServiceMock();
    mockConversionRepository = new ConversionRepositoryMock();
    validateSpy = jest.spyOn(classValidator, 'validate');
    convertCurrency = new ConversionController(
      mockConversionRepository,
      mockConversionService,
      mockConversionsHistoryService
    );
  });

  it('Should validate DTO', async () => {
    await convertCurrency.convertCurrency({
      from: 'EUR',
      to: 'USD',
      amount: '10' as any,
    });
    expect(validateSpy).toHaveBeenCalledWith({
      from: 'EUR',
      to: 'USD',
      amount: '10',
    });
  });

  it('Should throw error if query param "from" is missing', async () => {
    try {
      await convertCurrency.convertCurrency({ to: 'EUR', amount: '10' } as any);
    } catch (e) {
      expect(e).toBeTruthy();
    }
  });

  it('Should throw error if query param "to" is missing', async () => {
    try {
      await convertCurrency.convertCurrency({
        from: 'EUR',
        amount: '10',
      } as any);
    } catch (e) {
      expect(e).toBeTruthy();
    }
  });

  it('Should throw error if query param "amount" is missing', async () => {
    try {
      await convertCurrency.convertCurrency({ from: 'EUR', to: 'USD' } as any);
    } catch (e) {
      expect(e).toBeTruthy();
    }
  });

  it('Should throw error if query param "amount" is not a number', async () => {
    try {
      await convertCurrency.convertCurrency({
        from: 'EUR',
        to: 'USD',
        amount: 'abc' as any,
      } as any);
    } catch (e) {
      expect(e).toBeTruthy();
    }
  });

  it('Should call convert with correct DTO', async () => {
    await convertCurrency.convertCurrency({
      from: 'EUR',
      to: 'USD',
      amount: '12' as any,
    });
    expect(mockConversionService.convert).toHaveBeenCalledWith({
      from: 'EUR',
      to: 'USD',
      amount: '12',
    });
  });

  it('Should return whatever convert method from ConversionService returns', async () => {
    mockConversionService.convert = jest
      .fn()
      .mockReturnValue({ return: 'Test' });
    expect(
      await convertCurrency.convertCurrency({
        from: 'EUR',
        to: 'USD',
        amount: '12' as any,
      })
    ).toEqual({
      return: 'Test',
    });
  });

  it('Support currencies should return whatever conversionRepository.getSupportedCurrencies returns', async () => {
    mockConversionRepository.getSupportedCurrencies = jest
      .fn()
      .mockReturnValue({ return: 'Test' });
    expect(await convertCurrency.supportedCurrencies()).toEqual({
      return: 'Test',
    });
  });

  it('getConversionsHistory should return whatever ConversionsHistoryService.getConversionsHistory returns', async () => {
    mockConversionsHistoryService.getConversionsHistory = jest
      .fn()
      .mockResolvedValue([]);
    expect(await convertCurrency.getConversionsHistory()).toEqual([]);
  });

  it('getConversionsHistory should reutrn whatever ConversionsHistoryService.getConversionsHistory returns, another value', async () => {
    mockConversionsHistoryService.getConversionsHistory = jest
      .fn()
      .mockResolvedValue([1, 2, 3]);
    expect(await convertCurrency.getConversionsHistory()).toEqual([1, 2, 3]);
  });
});

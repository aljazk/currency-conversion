import { NextFunction, Request, Response } from 'express';
import { IConversionRepository } from './conversion-repository.interface';
import { ConversionController } from './conversion.controller';
import { CurrencyValidatonError } from './currency-validaton.error';
import { ConversionService } from './conversion.service';
import { ConversionRequestDTO } from './conversion-request-DTO';
import { ConversionReponseDTO } from './conversion-response.DTO';
import { CurrencyInfo } from './currency-info.model';
import * as classValidator from 'class-validator';
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
            result: dto.amount * conversionRate,
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
  let mockReq: Request;
  let mockRes: Response;
  let mockNext: NextFunction;
  let mockConversionService: MockConversionService;
  let mockConversionRepository: ConversionRepositoryMock;
  let mockConversionsHistoryService: ConversionsHistoryService;
  let validateSpy: jest.SpyInstance;
  let convertCurrency: ConversionController;

  beforeEach(() => {
    mockReq = { query: {} } as Request;
    mockRes = {
      status: jest.fn(() => mockRes),
      json: jest.fn(() => mockRes),
      send: jest.fn(() => mockRes),
    } as unknown as Response;
    mockNext = jest.fn();
    mockConversionService = new MockConversionService();
    mockConversionsHistoryService = new ConversionsHistoryServiceMock();
    mockConversionRepository = new ConversionRepositoryMock();
    validateSpy = jest.spyOn(classValidator, 'validate');
    convertCurrency = new ConversionController(
      mockConversionRepository,
      mockConversionService,
      mockConversionsHistoryService,
      console
    );
  });

  it('Should validate DTO', async () => {
    mockReq.query = { from: 'EUR', to: 'USD', amount: '10' };
    await convertCurrency.convertCurrency(mockReq, mockRes, mockNext);
    expect(validateSpy).toHaveBeenCalledWith({
      from: 'EUR',
      to: 'USD',
      amount: '10',
    });
  });

  it('Should pass error to next if query param "from" is missing', async () => {
    mockReq.query = { to: 'EUR', amount: '10' };
    await convertCurrency.convertCurrency(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it('Should pass error to next if query param "to" is missing', async () => {
    mockReq.query = { from: 'EUR', amount: '10' };
    await convertCurrency.convertCurrency(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it('Should pass error to next if query param "amount" is missing', async () => {
    mockReq.query = { from: 'EUR', to: 'USD' };
    await convertCurrency.convertCurrency(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it('Should pass error to next if query param "amount" is not a number', async () => {
    mockReq.query = { from: 'EUR', to: 'USD', amount: 'abc' };
    await convertCurrency.convertCurrency(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it('Should call convert with correct DTO', async () => {
    mockReq.query = { from: 'EUR', to: 'USD', amount: '12' };
    await convertCurrency.convertCurrency(mockReq, mockRes, mockNext);
    expect(mockConversionService.convert).toHaveBeenCalledWith({
      from: 'EUR',
      to: 'USD',
      amount: '12',
    });
  });

  it('Should send whatever convert method from ConversionService returns', async () => {
    mockReq.query = { from: 'EUR', to: 'USD', amount: '12' };
    mockConversionService.convert = jest
      .fn()
      .mockReturnValue({ return: 'Test' });
    await convertCurrency.convertCurrency(mockReq, mockRes, mockNext);
    expect(mockRes.send).toHaveBeenCalledWith({
      return: 'Test',
    });
  });

  it('Support currencies should send whatever conversionRepository.getSupportedCurrencies returns', async () => {
    mockReq.query = { from: 'EUR', to: 'USD', amount: '12' };
    mockConversionRepository.getSupportedCurrencies = jest
      .fn()
      .mockReturnValue({ return: 'Test' });
    await convertCurrency.supportedCurrencies(mockReq, mockRes, mockNext);
    expect(mockRes.send).toHaveBeenCalledWith({
      return: 'Test',
    });
  });

  it('getConversionsHistory should send whatever ConversionsHistoryService.getConversionsHistory returns', async () => {
    mockConversionsHistoryService.getConversionsHistory = jest
      .fn()
      .mockResolvedValue([]);
    await convertCurrency.getConversionsHistory(mockReq, mockRes, mockNext);
    expect(mockRes.send).toHaveBeenCalledWith([]);
  });

  it('getConversionsHistory should send whatever ConversionsHistoryService.getConversionsHistory returns, another value', async () => {
    mockConversionsHistoryService.getConversionsHistory = jest
      .fn()
      .mockResolvedValue([1, 2, 3]);
    await convertCurrency.getConversionsHistory(mockReq, mockRes, mockNext);
    expect(mockRes.send).toHaveBeenCalledWith([1, 2, 3]);
  });
});

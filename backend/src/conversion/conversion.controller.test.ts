import { NextFunction, Request, Response } from 'express';
import {
  CurrencyInfo,
  IConversionRepository,
} from './conversion-repository.interface';
import { ConversionController } from './conversion.controller';
import { CurrencyValidatonError } from './currency-validaton.error';

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

describe('ConversionController', () => {
  let mockReq: Request;
  let mockRes: Response;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = { query: {} } as Request;
    mockRes = {
      status: jest.fn(() => mockRes),
      json: jest.fn(() => mockRes),
      send: jest.fn(() => mockRes),
    } as unknown as Response;
    mockNext = jest.fn();
  });

  it('Should convert currency', async () => {
    const mockConversionRepository = new ConversionRepositoryMock();
    const convertCurrency = new ConversionController(
      mockConversionRepository,
      console
    );
    mockReq.query = { from: 'EUR', to: 'USD', amount: '10' };
    await convertCurrency.convertCurrency(mockReq, mockRes, jest.fn());

    expect(mockConversionRepository.getConversionRate).toHaveBeenCalledWith(
      'EUR',
      'USD'
    );
    expect(mockRes.send).toHaveBeenCalledWith({
      amount: '10',
      conversionRate: 1.5,
      from: 'EUR',
      result: 15,
      to: 'USD',
    });
  });

  it('Should throw error if from param is missing', async () => {
    const mockConversionRepository = new ConversionRepositoryMock();
    const convertCurrency = new ConversionController(
      mockConversionRepository,
      console
    );
    mockReq.query = { to: 'USD', amount: '10' };

    await convertCurrency.convertCurrency(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(expect.anything());
    expect(mockNext).not.toHaveBeenCalled(); // Next shouldn't be called for validation errors
  });

  it('Should throw error if to param is missing', async () => {
    const mockConversionRepository = new ConversionRepositoryMock();
    const convertCurrency = new ConversionController(
      mockConversionRepository,
      console
    );
    mockReq.query = { from: 'USD', amount: '10' };

    await convertCurrency.convertCurrency(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(expect.anything());
    expect(mockNext).not.toHaveBeenCalled(); // Next shouldn't be called for validation errors
  });

  it('Should throw error if amount param is missing', async () => {
    const mockConversionRepository = new ConversionRepositoryMock();
    const convertCurrency = new ConversionController(
      mockConversionRepository,
      console
    );
    mockReq.query = { from: 'USD', to: 'EUR' };

    await convertCurrency.convertCurrency(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(expect.anything());
    expect(mockNext).not.toHaveBeenCalled(); // Next shouldn't be called for validation errors
  });

  it('Should throw error if amount param is not number', async () => {
    const mockConversionRepository = new ConversionRepositoryMock();
    const convertCurrency = new ConversionController(
      mockConversionRepository,
      console
    );
    mockReq.query = { from: 'USD', to: 'EUR', amount: 'ABC' };

    await convertCurrency.convertCurrency(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(expect.anything());
    expect(mockNext).not.toHaveBeenCalled(); // Next shouldn't be called for validation errors
  });

  it('Should handle currency validation error from conversion repository', async () => {
    const mockConversionRepository = new ConversionRepositoryMock();
    mockConversionRepository.getConversionRate = jest.fn(
      (fromCurrency: string, toCurrency: string) => {
        throw new CurrencyValidatonError('Error');
      }
    );
    const convertCurrency = new ConversionController(
      mockConversionRepository,
      console
    );
    mockReq.query = { from: 'EUR1', to: 'USD', amount: '10' };
    await convertCurrency.convertCurrency(mockReq, mockRes, mockNext);

    expect(mockConversionRepository.getConversionRate).toHaveBeenCalledWith(
      'EUR1',
      'USD'
    );
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(expect.anything());
    expect(mockNext).not.toHaveBeenCalled(); // Next shouldn't be called for validation errors
  });

  it('Should pass randmon errors from currency repository forward', async () => {
    const mockConversionRepository = new ConversionRepositoryMock();
    mockConversionRepository.getConversionRate = jest.fn(
      (fromCurrency: string, toCurrency: string) => {
        throw new Error('Error');
      }
    );
    const convertCurrency = new ConversionController(
      mockConversionRepository,
      console
    );
    mockReq.query = { from: 'EUR1', to: 'USD', amount: '10' };
    await convertCurrency.convertCurrency(mockReq, mockRes, mockNext);

    expect(mockConversionRepository.getConversionRate).toHaveBeenCalledWith(
      'EUR1',
      'USD'
    );
    expect(mockNext).toHaveBeenCalledTimes(1);
  });
});

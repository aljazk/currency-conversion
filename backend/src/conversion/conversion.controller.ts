import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { ILogger } from '../logger.interface';
import { IConversionRepository } from './conversion-repository.interface';
import { ConversionRequestDTO } from './conversion-request-DTO';
import { ConversionService } from './conversion.service';
import { ConversionsHistoryService } from './history/conversions-history.service';

export class ConversionController {
  constructor(
    private conversionRepository: IConversionRepository,
    private conversionService: ConversionService,
    private conversionsHistoryService: ConversionsHistoryService,
    private logger: ILogger
  ) {}
  public async convertCurrency(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const dto = Object.assign(new ConversionRequestDTO(), req.query);
      const errors = await validate(dto);
      if (errors.length > 0) {
        throw errors;
      }
      res.send(await this.conversionService.convert(dto));
    } catch (e) {
      this.logger.error(e as Error);
      next(e);
    }
  }

  public async supportedCurrencies(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      res.send(await this.conversionRepository.getSupportedCurrencies());
    } catch (e) {
      this.logger.error(e as Error);
      next(e);
    }
  }

  public async getConversionsHistory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      res.send(await this.conversionsHistoryService.getConversionsHistory());
    } catch (e) {
      this.logger.error(e as Error);
      next(e);
    }
  }
}

import { NextFunction, Request, Response, Router } from 'express';
import { logger } from '../logger';
import { ConversionRepositorySelector } from './conversion-repository-selector';
import { ConversionController } from './conversion.controller';
import { ConversionService } from './conversion.service';
import { ConversionsHistoryService } from './history/conversions-history.service';
import { DocumentDBClient } from '../mongodb';
import { ConversionRequestDTO } from './conversion-request-DTO';

export class ConversionRoutes {
  constructor() {}

  private async handleRequest(
    req: Request,
    res: Response,
    next: NextFunction,
    callback: () => Promise<any>
  ) {
    try {
      res.send(await callback());
    } catch (e) {
      logger.error(e as Error);
      next(e);
    }
  }

  getRouter(conversionRatesSource?: string) {
    const router = Router();

    const conversionRepository = new ConversionRepositorySelector(
      logger
    ).getRepository(conversionRatesSource);

    const conversionsHistoryService = new ConversionsHistoryService(
      new DocumentDBClient(logger, process.env.DATABASE_URI)
    );

    const conversionController = new ConversionController(
      conversionRepository,
      new ConversionService(
        conversionRepository,
        conversionsHistoryService,
        logger
      ),
      conversionsHistoryService
    );

    router.post(
      '/convert',
      async (req: Request, res: Response, next: NextFunction) => {
        this.handleRequest(req, res, next, () => {
          console.log(req.body);
          return conversionController.convertCurrency(
            req.body as ConversionRequestDTO
          );
        });
      }
    );

    router.get(
      '/supported-currencies',
      async (req: Request, res: Response, next: NextFunction) => {
        this.handleRequest(req, res, next, () => {
          return conversionController.supportedCurrencies();
        });
      }
    );

    router.get(
      '/conversions-history',
      async (req: Request, res: Response, next: NextFunction) => {
        this.handleRequest(req, res, next, () => {
          return conversionController.getConversionsHistory();
        });
      }
    );
    return router;
  }
}

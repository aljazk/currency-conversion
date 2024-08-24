import { Router } from 'express';
import { logger } from '../logger';
import { ConversionRepositorySelector } from './conversion-repository-selector';
import { ConversionController } from './conversion.controller';
import { ConversionService } from './conversion.service';
import { ConversionsHistoryService } from './history/conversions-history.service';
import { DocumentDBClient } from '../mongodb';

export class ConversionRoutes {
  constructor() {}

  getRouter(conversionRatesSource?: string) {
    const router = Router();

    const conversionRepository = new ConversionRepositorySelector(
      logger
    ).getRepository(conversionRatesSource);

    const conversionController = new ConversionController(
      conversionRepository,
      new ConversionService(
        conversionRepository,
        new ConversionsHistoryService(
          new DocumentDBClient(logger, process.env.DATABASE_URI)
        ),
        logger
      ),
      logger
    );

    router.get(
      '/convert',
      conversionController.convertCurrency.bind(conversionController)
    );
    router.get(
      '/supported-currencies',
      conversionController.supportedCurrencies.bind(conversionController)
    );
    return router;
  }
}

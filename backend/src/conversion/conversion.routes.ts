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
      conversionsHistoryService,
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
    router.get(
      '/conversions-history',
      conversionController.getConversionsHistory.bind(conversionController)
    );
    return router;
  }
}

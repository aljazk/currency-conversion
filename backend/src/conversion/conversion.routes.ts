import { Router } from 'express';
import { ConversionController } from './conversion.controller';
import { DemoConversionRepository } from './demo-rates/demo-conversion.repository';
import { ConversionService } from './conversion.service';
import { logger } from '../logger';

const router = Router();

const conversionRepository = new DemoConversionRepository();
const conversionController = new ConversionController(
  conversionRepository,
  new ConversionService(conversionRepository, logger),
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

export { router as conversionRoutes };

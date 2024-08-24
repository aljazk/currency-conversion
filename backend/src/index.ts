import 'dotenv/config';
import express from 'express';
import { ConversionRoutes } from './conversion/conversion.routes';
import { errorHandler } from './error-handler';
import { logger } from './logger';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello from TypeScript Express!');
});

app.use(
  '/conversion',
  new ConversionRoutes().getRouter(process.env.CONVERSION_RATES_SOURCE)
);
app.use(errorHandler);

app.listen(port, () => {
  logger.log(`Server listening on port ${port}`);
});

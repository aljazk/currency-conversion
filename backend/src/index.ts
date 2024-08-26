import 'dotenv/config';
import express from 'express';
import { ConversionRoutes } from './conversion/conversion.routes';
import { errorHandler } from './error-handler';
import { logger } from './logger';
import swaggerUi from 'swagger-ui-express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.get('/', (req, res) => {
  res.send(
    '<html><p>Currency conversion service</p><a href="./docs">Documentation</a></html>'
  );
});

app.use(
  '/conversion',
  new ConversionRoutes().getRouter(process.env.CONVERSION_RATES_SOURCE)
);

app.use(express.static('public'));
app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: '/swagger.json',
    },
  })
);

app.use(errorHandler);

app.listen(port, () => {
  logger.log(`Server listening on port ${port}`);
});

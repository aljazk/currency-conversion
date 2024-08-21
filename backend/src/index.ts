import express from 'express';
import { conversionRoutes } from './conversion/conversion.routes';
import { errorHandler } from './error-handler';
import { logger } from './logger';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello from TypeScript Express!');
});

app.use('/conversion', conversionRoutes);
app.use(errorHandler);

app.listen(port, () => {
  logger.log(`Server listening on port ${port}`);
});

console.log(process.env.TEST);

import { ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { CurrencyValidatonError } from './conversion/currency-validaton.error';
import { logger } from './logger';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (Array.isArray(err) && err[0] instanceof ValidationError) {
    return res.status(400).json({ errors: err });
  }
  if (err instanceof CurrencyValidatonError) {
    return res.status(400).json({ error: err.message });
  }
  logger.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
}

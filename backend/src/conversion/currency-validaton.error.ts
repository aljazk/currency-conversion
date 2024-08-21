export class BadRequestError extends Error {}

export class CurrencyValidatonError extends BadRequestError {
  constructor(currency: string) {
    super(`Currency '${currency}' is not supported.`);
  }
}

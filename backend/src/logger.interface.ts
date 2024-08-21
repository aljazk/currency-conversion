export interface ILogger {
  log(message: string): void;
  error(message: Error): void;
}

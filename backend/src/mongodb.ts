import { Collection, Document, MongoClient } from 'mongodb';
import { ILogger } from './logger.interface';

export class DocumentDBClient {
  constructor(private logger: ILogger, private readonly uri?: string) {}

  async connect<T>(
    operation: (collection: Collection<Document>) => Promise<T>
  ): Promise<T | undefined> {
    if (!this.uri) {
      this.logger.log('DATABASE_URI not set, can not connect to database.');
      return;
    }
    const client = await MongoClient.connect(this.uri);

    const db = client.db(process.env.DATABSE_NAME ?? 'currency-conversion');
    const col = db.collection(
      process.env.DATABSE_COLLECTION_NAME ?? 'conversion-history'
    );

    const result = await operation(col);

    await client.close();
    return result;
  }
}

import { Collection, Document, MongoClient } from 'mongodb';
import { ILogger } from './logger.interface';

export class DocumentDBClient {
  constructor(private logger: ILogger, private readonly uri?: string) {}

  async connect(
    operation: (collection: Collection<Document>) => Promise<void>
  ): Promise<void> {
    if (!this.uri) {
      this.logger.log('DATABASE_URI not set, can not connect to database.');
      return;
    }
    const client = await MongoClient.connect(this.uri);

    console.log('Connected to DocumentDB');

    const db = client.db(process.env.DATABSE_NAME ?? 'currency-conversion');
    const col = db.collection(
      process.env.DATABSE_COLLECTION_NAME ?? 'conversion-history'
    );

    await operation(col);
    // Insert a single document
    // await col.insertOne({ hello: 'Amazon DocumentDB' });

    // // Find the document that was previously written
    // const result = await col.findOne({ hello: 'Amazon DocumentDB' });
    await client.close();
  }
}

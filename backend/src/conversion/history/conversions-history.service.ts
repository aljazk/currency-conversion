import { Collection, Document } from 'mongodb';
import { DocumentDBClient } from '../../mongodb';
import { ConversionReponseDTO } from '../conversion-response.DTO';
import { ConversionDatabaseItem } from './conversion-database-item';

export class ConversionsHistoryService {
  constructor(private database: DocumentDBClient) {}
  public storeConversion(conversion: ConversionReponseDTO): Promise<void> {
    return this.database.connect(async (collection: Collection<Document>) => {
      const item = Object.assign(
        { date: new Date() },
        conversion
      ) as ConversionDatabaseItem;
      await collection.insertOne(item);
    });
  }
  public async getConversionsHistory(): Promise<Array<ConversionDatabaseItem>> {
    const result = await this.database.connect<Array<ConversionDatabaseItem>>(
      async (collection: Collection<Document>) => {
        return (await collection
          .find()
          .toArray()) as unknown as ConversionDatabaseItem[];
      }
    );
    return result ?? new Array<ConversionDatabaseItem>();
  }
}

import { validate } from 'class-validator';
import { IConversionRepository } from './conversion-repository.interface';
import { ConversionRequestDTO } from './conversion-request-DTO';
import { ConversionReponseDTO } from './conversion-response.DTO';
import { ILogger } from '../logger.interface';
import { ConversionsHistoryService } from './history/conversions-history.service';

export class ConversionService {
  constructor(
    private conversionRepository: IConversionRepository,
    private conversionsHistoryService: ConversionsHistoryService,
    private logger: ILogger
  ) {}

  public async convert(
    dto: ConversionRequestDTO
  ): Promise<ConversionReponseDTO> {
    const conversionRate = await this.conversionRepository.getConversionRate(
      dto.from,
      dto.to
    );

    const converted = this.convertCurrency(dto.amount, conversionRate);
    const result = this.prepareResponse(dto, converted, conversionRate);
    this.logger.log(
      `Converted ${result.amount} ${result.from} to ${result.result} ${result.to} using ${result.conversionRate} conversion rate`
    );
    this.conversionsHistoryService
      .storeConversion(result)
      .catch((e) => this.logger.error(e as Error));
    return result;
  }

  private prepareResponse(
    dto: ConversionRequestDTO,
    converted: number,
    conversionRate: number
  ) {
    const result = Object.assign(new ConversionReponseDTO(), dto);
    result.result = converted;
    result.conversionRate = conversionRate;
    return result;
  }

  private convertCurrency(amount: number, conversionRate: number) {
    return amount * conversionRate;
  }
}

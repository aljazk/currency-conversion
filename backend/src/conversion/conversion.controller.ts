import { validate } from 'class-validator';
import { Body, Get, Post, Queries, Route } from 'tsoa';
import { IConversionRepository } from './conversion-repository.interface';
import { ConversionRequestDTO } from './conversion-request-DTO';
import { ConversionReponseDTO } from './conversion-response.DTO';
import { ConversionService } from './conversion.service';
import { CurrencyInfo } from './currency-info.model';
import { ConversionsHistoryService } from './history/conversions-history.service';

@Route('conversion')
export class ConversionController {
  constructor(
    private conversionRepository: IConversionRepository,
    private conversionService: ConversionService,
    private conversionsHistoryService: ConversionsHistoryService
  ) {}

  /**
   * Converts amount from one currency to another.
   * @param conversionRequestDTO
   * @returns
   */
  @Post('convert')
  public async convertCurrency(
    @Body() conversionRequestDTO: ConversionRequestDTO
  ): Promise<ConversionReponseDTO> {
    const dto = Object.assign(new ConversionRequestDTO(), conversionRequestDTO);
    console.log(dto);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw errors;
    }
    return await this.conversionService.convert(dto);
  }

  /**
   * Returns list of all supported currencies.
   * @returns
   */
  @Get('supported-currencies')
  public async supportedCurrencies(): Promise<CurrencyInfo> {
    return await this.conversionRepository.getSupportedCurrencies();
  }

  /**
   * Returns list of conversions that have been stored in database.
   * @returns
   */
  @Get('conversions-history')
  public async getConversionsHistory() {
    return await this.conversionsHistoryService.getConversionsHistory();
  }
}

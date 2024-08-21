import { ConversionRequestDTO } from './conversion-request-DTO';

export class ConversionReponseDTO extends ConversionRequestDTO {
  result!: number;
  conversionRate!: number;
}

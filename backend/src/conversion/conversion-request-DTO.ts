import { IsNumberString, IsString } from 'class-validator';

export class ConversionRequestDTO {
  @IsString()
  from!: string;

  @IsString()
  to!: string;

  @IsNumberString()
  amount!: string;
}

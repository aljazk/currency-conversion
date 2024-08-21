import {
  IsNumber,
  IsNumberString,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class ConversionRequestDTO {
  @IsString()
  from!: string;

  @IsString()
  to!: string;

  @IsNumberString()
  amount!: number;
}

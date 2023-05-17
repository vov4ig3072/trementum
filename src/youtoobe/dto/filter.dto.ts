import { IsDateString } from 'class-validator';

export class FilterDto {
  @IsDateString()
  start: string;

  @IsDateString()
  end: string;
}

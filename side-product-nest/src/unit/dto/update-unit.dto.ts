import { IsString } from 'class-validator';

export class UpdateUnitDto {
  @IsString()
  unitname: string;
}

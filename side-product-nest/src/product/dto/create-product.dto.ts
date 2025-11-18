import { IsDefined, IsNumber, IsString, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';
import { Optional } from '@nestjs/common';

export class CreateProductDto {
  @IsDefined()
  @IsString()
  readonly productname: string;

  @IsDefined()
  @IsString()
  readonly description: string;

  @IsDefined()
  @Type(() => Number)
  readonly quantity: number;

  @IsDefined()
  @IsString()
  readonly unit: string;

  @IsDefined()
  @Type(() => Number)
  readonly price: number;

  @Optional()
  @IsString()
  image: string;

  @IsDefined()
  @IsString()
  readonly catalog: string;

  @IsDefined()
  @IsString()
  readonly ownerID: string;
}

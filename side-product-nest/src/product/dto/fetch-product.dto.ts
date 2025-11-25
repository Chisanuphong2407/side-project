import { IsNotEmpty, IsOptional } from 'class-validator';

export class FetchProductDto {
  @IsOptional()
  productname?: string;

  @IsOptional()
  unit?: string;

  @IsOptional()
  catalog?: string;

  @IsOptional()
  @IsNotEmpty()
  ownerID: string;
}

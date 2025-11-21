// import { IsString } from 'class-validator';

export class UpdateProductDto {
  readonly productname?: string;

  readonly description?: string;

  readonly quantity?: number;

  readonly unit?: string;

  readonly price?: number;

  readonly catalog?: string;

  readonly ownerID?: string;
}

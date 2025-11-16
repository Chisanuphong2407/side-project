// import { IsString } from 'class-validator';

export class CreateProductDto {
  readonly productname: string;

  readonly description: string;

  readonly quantity: number;

  readonly unit: string;

  readonly price: number;

  readonly image: string;

  readonly catalog: string;

  readonly ownerID: string;
}

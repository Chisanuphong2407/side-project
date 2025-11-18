import { IsString } from 'class-validator';

export class CreateCatalogDto {
  @IsString()
  readonly catalogName: string;
}

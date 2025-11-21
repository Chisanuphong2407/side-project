import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type productDocument = Product & Document;

@Schema()
export class Product {
  @Prop()
  productname: string;

  @Prop()
  description: string;

  @Prop()
  quantity: number;

  @Prop()
  unit: string;

  @Prop()
  price: number;

  @Prop()
  catalog: string;

  @Prop()
  ownerID: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

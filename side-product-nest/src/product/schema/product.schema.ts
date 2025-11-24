import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type productDocument = Product & Document;

@Schema()
export class Product {
  @Prop()
  productname: string;

  @Prop()
  description: string;

  @Prop()
  quantity: number;

  @Prop({ type: Types.ObjectId, ref: 'Unit', required: true })
  unit: Types.ObjectId;

  @Prop()
  price: number;

  @Prop({ type: Types.ObjectId, ref: 'Catalog', required: true })
  catalog: Types.ObjectId;

  @Prop()
  ownerID: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
